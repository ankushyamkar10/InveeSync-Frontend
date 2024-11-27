"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import Papa from "papaparse";
import Loading from "../components/Loading";

const BulkUploadModal = () => {
  const [files, setFiles] = useState([]);
  const [skipHeader, setSkipHeader] = useState(true); // Initially set to true to skip header
  const [isUploading, setIsUploading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFilesChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);
    parseCSV(fileArray[0]); // Parse the first file (assuming only one file is selected)
  };

  const parseCSV = (file) => {
    setIsLoading(true);

    // Use `header: false` because we handle the header row manually later
    Papa.parse(file, {
      complete: (result) => {
        let data = result.data;

        setCsvData(data);
        setIsLoading(false);
      },
      header: false, // Do not treat the first row as header in parsing
      skipEmptyLines: true,
      worker: true, // Use web worker to parse large files
    });
  };

  const handleSkipHeaderChange = () => {
    setSkipHeader(!skipHeader);
    if (files.length > 0) {
      parseCSV(files[0]); // Re-parse the CSV when the header setting changes
    }
  };

  const handleUpload = () => {
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setFiles([]);
      setCsvData([]);
      alert("Files uploaded successfully!");
    }, 2000);
  };

  const handleBrowseFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancel = () => {
    setFiles([]);
    setCsvData([]);
    setSkipHeader(true);
    const modal = document.getElementById("bulk_upload");
    if (modal) modal.close();
  };

  useEffect(() => {
    return () => {
      setIsLoading(false);
      setIsUploading(false);
      setCsvData([]);
      setFiles([]);
    };
  }, []);

  return (
    <dialog id="bulk_upload" className="modal">
      <div className="modal-box bg-white text-gray-900 p-6">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-900 border border-gray-900 rounded-full"
            aria-label="Close"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-4">Bulk Data Upload</h3>
        <div className="flex items-center justify-center w-full bg-white my-4">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full border rounded-lg cursor-pointer border-gray-300 border-dashed bg-[#F8F8F8]"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="rounded-full bg-gray-200 p-4">
                <FaArrowUp />
              </div>

              <p className="mt-2">Drag and drop files here</p>

              <span className="mt-2 mb-3"> or </span>

              <button
                type="button"
                className="py-3 px-6 rounded-md text-sm bg-[#3B82F6] border-none text-white font-thin"
                onClick={handleBrowseFilesClick}
              >
                Browse Files
              </button>
            </div>
            <input
              ref={fileInputRef}
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={onFilesChange}
              accept=".csv"
              multiple
            />
          </label>
        </div>
        <p className="text-gray-500 text-xs -mt-2 mb-4">
          Supported file types: .csv
        </p>

        <div className="bg-[#F8F8F8] border border-gray-300 flex items-center justify-between p-4">
          <div>Skip header for now</div>
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={skipHeader}
            onChange={handleSkipHeaderChange}
          />
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">Selected Files:</h4>
            <ul className="list-disc pl-6 text-gray-700">
              {files.map((file, index) => (
                <li key={index} className="text-sm">
                  {file.name} ({file.size} bytes)
                </li>
              ))}
            </ul>
          </div>
        )}

        {csvData.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">CSV Preview:</h4>
            <div
              className="overflow-auto"
              style={{ maxHeight: "300px", width: "100%" }}
            >
              <table className="table-auto w-full border border-gray-300 mr-6">
                <thead>
                  {/* Render headers based on the skipHeader flag */}
                  {skipHeader ? (
                    // Render indices (0, 1, 2, ...) when skipHeader is true
                    <tr>
                      {csvData[0] &&
                        Object.keys(csvData[0]).map((_, index) => (
                          <th
                            key={index}
                            className="px-4 py-2 text-sm border-b"
                          >
                            {index}
                          </th>
                        ))}
                    </tr>
                  ) : (
                    // Render the first row as the header when skipHeader is false
                    <tr>
                      {csvData[0] &&
                        Object.keys(csvData[0]).map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-2 text-sm border-b"
                          >
                            {header}
                          </th>
                        ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {/* Render rows */}
                  {skipHeader
                    ? csvData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 text-sm border-b"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))
                    : csvData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 text-sm border-b"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isLoading && <Loading title={"Preparing your data..."} />}

        <div className="flex items-center justify-end gap-4 mt-4">
          <form method="dialog">
            <button
              className="py-3 px-6 rounded-md text-sm bg-gray-300 border-none text-gray-900 font-thin"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </form>
          <button
            className="py-3 px-6 rounded-md text-sm bg-[#3B82F6] border-none text-white font-thin cursor-pointer"
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default BulkUploadModal;
