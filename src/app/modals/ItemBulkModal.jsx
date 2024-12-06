import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaUpload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { validateItems } from "../validations/ItemValidation";
import {
  useCreateItemMutation,
  useFetchItems,
} from "@/app/queries/ItemsMaster";
import { itemSchema } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";

import {
  parseItemFile,
  setItemFiles,
  clearItemData,
  editItemsCsvCell,
} from "@/app/feature/itemUploadsSlice";


const ItemBulkModal = ({ type, isOpen, onClose, itemsTypes }) => {
  const dispatch = useDispatch();
  const {
    files: itemsFiles,
    csvData: itemsCsvData,
    isLoading: itemsLoading,
    error: itemsError,
  } = useSelector((state) => state.fileUploadItem);
  const { data: items } = useFetchItems();
  const fileInputRef = useRef(null);

  const [csvData, setCsvData] = useState([]);


  const { files, csvInitialData, isLoading, error } = {
    files: itemsFiles,
    csvInitialData: itemsCsvData,
    isLoading: itemsLoading,
    error: itemsError,
  };

  useEffect(() => {
    if (isOpen && csvInitialData && csvInitialData.length > 0) {

      const validatedData = validateFn(
        csvInitialData.map((item) => item.row),
        false,
        itemsTypes,
        items
      );

      setCsvData(
        validatedData.map((validationResult, index) => ({
          ...csvInitialData[index],
          isValid: validationResult.isValid,
          reason: validationResult.reason,
        }))
      );
    } else if (isOpen) {
      setCsvData([]);
    }
  }, [isOpen, csvInitialData, itemsTypes, items]);

  const setFiles = setItemFiles;
  const clearData = clearItemData;

  const validateFn = validateItems;
  const mutation = useCreateItemMutation();

  const handleFileSelection = useCallback(
    (selectedFiles) => {
      const fileArray = Array.from(selectedFiles);
      dispatch(setFiles(fileArray));
      const parseFile = parseItemFile;
      if (fileArray.length > 0) {
        dispatch(
          parseFile({
            file: fileArray[0],
            validateFn,
            itemsTypes,
            items,
            skipHeader: true,
          })
        );
      }
    },
    [dispatch]
  );

  const handleDragEvents = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files) {
        handleFileSelection(e.dataTransfer.files);
      }
    },
    [handleFileSelection]
  );

  const handleEditCell = (rowIndex, cellIndex, value) => {
    setCsvData((prevData) => {

      const newData = prevData.map((row) => ({
        ...row,
        row: [...row.row], 
      }));

      newData[rowIndex].row[cellIndex] = value;

      return newData;
    });
  };

  const validateEditedRow = (rowIndex) => {
    const rowData = csvData[rowIndex];
    const validationResult = validateRow(rowData.row);

    if (validationResult) {
      setCsvData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex] = {
          ...rowData,
          isValid: validationResult[0].isValid,
          reason: validationResult[0].reason,
        };


        dispatch(editItemsCsvCell(newData));
        return newData;
      });
    }
  };

  const validateRow = (row) => {

    const validatedData = validateFn([row], false, itemsTypes, items);
    return validatedData;
  };

  const schema = itemSchema;
  const schemaFields = Object.keys(schema);

  const handleUpload = () => {

    const validRows = csvData.filter((rowData) => rowData.isValid);
    const invalidRows = csvData.filter((rowData) => !rowData.isValid);


    if (invalidRows.length > 0) {
      alert("Some rows are invalid. Please check the data.");
      return;
    }

    const schema = itemSchema;
    const schemaFields = Object.keys(schema);


    validRows.forEach((rowData) => {
      const dataObject = {};


      schemaFields.forEach((field, index) => {
        if (index < schemaFields.length - 2) {
          dataObject[field] = rowData.row[index];
        }
      });

      dataObject["customer_item_name"] = "Just to upload";
      dataObject["additional_attributes"] = {
        avg_weight_needed:
          rowData.row.length >= 13
            ? rowData.row[13]?.toString()?.toUpperCase()
            : null,
        scrap_type: rowData.row.length >= 14 ? rowData.row[14] : null,
      };

      mutation.mutate(dataObject, {
        onSuccess: () => {
          alert("Files uploaded successfully!");
        },
        onError: (error) => {
          console.error("Error during upload:", error);
          alert("Error during upload, please try again.");
        },
      });
    });

    resetUpload();
  };

  const resetUpload = () => {
    dispatch(clearData());
    onClose();
  };

  const handleBrowseFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownloadErrorReport = () => {
    const invalidRows = csvData.filter((rowData) => !rowData.isValid);

    if (invalidRows.length === 0) {
      alert("No errors found. All rows are valid!");
      return;
    }

    const schema = itemSchema;
    const headers = Object.keys(schema);

    const errorReportData = invalidRows.map((rowData) => ({
      "Row Number": rowData.rowNumber,
      ...headers.reduce(
        (acc, header, index) => ({
          ...acc,
          [header]: rowData.row[index],
        }),
        {}
      ),
      "Error Reason": rowData.reason || "No reason provided",
    }));

    const ws = XLSX.utils.json_to_sheet(errorReportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Error Report");
    XLSX.writeFile(wb, `Error_Report_${type}.xlsx`);
  };

  const renderUploadSection = () => (
    <div
      className="flex flex-col items-center justify-center w-full h-[20em] border rounded-lg cursor-pointer border-gray-300 border-dashed bg-white dark:bg-gray-800"
      onDragEnter={handleDragEvents}
      onDragLeave={handleDragEvents}
      onDragOver={handleDragEvents}
      onDrop={handleDragEvents}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-full bg-gray-200 p-4">
          <FaUpload className="text-gray-800" />
        </div>
        <p className="mt-2">Drag and drop files here</p>
        <span className="mt-2 mb-3"> or </span>
        <button
          type="button"
          className="py-3 px-6 rounded-md text-sm bg-[#7480ff] border-none  bg-gradient-to-br from-blue-500 to-blue-600 text-white 
                    hover:from-blue-600 hover:to-blue-700 
                    transition-all duration-300 
                    shadow-xl hover:shadow-2xl font-thin"
          onClick={handleBrowseFilesClick}
        >
          Browse Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileSelection(e.target.files)}
          accept=".csv, .xls, .xlsx, .ods"
          multiple
        />
      </div>
    </div>
  );

  const handleClosePreviewModal = () => {
    onClose();
  };

  const handleDiscardUpload = () => {
    resetUpload();
  };

  return (
    <>
      <div className="fixed inset-0 bg-white/60 dark:bg-gray-800/60 flex justify-center items-center z-50">
        <div className="modal-box bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-6 w-[95%] max-h-[80%] md:max-h-[70%] flex flex-col relative border border-gray-300">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-900 dark:text-gray-300 border border-gray-300 rounded-full"
              aria-label="Close"
              onClick={onClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-200 ">Bulk Data Upload</h3>


          <div className="flex-1 flex flex-col relative">
            {renderUploadSection()}

            <p className="text-gray-900 dark:text-gray-300 text-xs my-2">
              Supported file types: .csv, .xls, .xlsx, .ods
            </p>
            <div className="flex items-center justify-end gap-4 mt-8">
              <form method="dialog">
                <button
                  className="py-3 px-6 rounded-md text-sm bg-gray-300 border-none text-gray-900 font-thin"
                  type="button"
                  onClick={resetUpload}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>

        {csvData.length > 0 && (
          <div className="fixed inset-0 bg-white/60 dark:bg-gray-800/60 flex justify-center items-center z-[60]">
            <div className="modal-box bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-6 min-w-[90vw] min-h-[90vh]  flex flex-col relative  border border-gray-300">
              <h3 className="font-bold text-lg mb-4">Preview Complete</h3>

              {/* Main Preview Table */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
                <table className="w-full text-sm text-left rtl:text-right text-gray-400 border border-gray-200">
                  <thead className="text-xs  uppercase bg-gary-300 dark:bg-gray-700 text-gray-400">
                    <tr className="text-gray-900 dark:text-gray-200 text-center ">
                      {schemaFields.map((field, index) => (
                        <th key={index} className="px-6 py-3 text-center bg-gary-300 dark:bg-gray-700">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((rowData, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`border-b border-gray-200 
                        ${
                          rowData.isValid
                            ? "bg-green-100 hover:bg-green-200"
                            : "bg-red-100 hover:bg-red-200"
                        }
                      `}
                      >
                        {rowData.row &&
                          rowData.row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 text-center text-gray-900"
                            >
                              {cell !== null && cell !== undefined ? (
                                String(cell)
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invalid Entries Section */}
              <h3 className="font-bold text-md mb-2 text-gray-900 dark:text-gray-300">
                Invalid Entries
              </h3>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-gray-900 dark:text-gray-200 text-center ">
                      {schemaFields.map((field, index) => (
                        <th key={index} className="px-6 py-3 text-center bg-gary-300 dark:bg-gray-700">
                          {field}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center bg-gary-300 dark:bg-gray-700">Reason</th>
                      <th className="px-6 py-3 text-center bg-gary-300 dark:bg-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((rowData, rowIndex) => {
                      if (rowData.isValid) return null;
                      return (
                        <tr
                          key={rowIndex}
                          className="border-b border-gray-200 bg-red-100 hover:bg-red-200"
                        >
                          {rowData.row.map((cell, cellIndex) => {
                            return (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 text-center text-gray-900"
                              >
                                <input
                                  type="text"
                                  defaultValue={cell}
                                  onChange={(e) =>
                                    handleEditCell(
                                      rowIndex,
                                      cellIndex,
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-white p-2 border border-gray-300 rounded-md"
                                />
                              </td>
                            );
                          })}
                          <td className="px-6 py-4 text-center text-gray-900">
                            {rowData.reason || "No reason provided"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => validateEditedRow(rowIndex)}
                              className="p-2 rounded-full bg-green-400 hover:bg-green-500 text-white"
                              aria-label="Save"
                            >
                              💾
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="absolute bottom-20 md:bottom-6 -left-4 md:left-0 flex justify-between items-center w-full px-6">
                {/* Discard Button */}
                <button
                  onClick={handleDiscardUpload}
                  className="py-2 px-4 rounded-md bg-gray-400 text-white font-semibold"
                >
                  Discard
                </button>
              </div>

              {/* Buttons for Error Report and Upload */}
              <div className="absolute bottom-6 right-6 flex gap-4">
                <button
                  onClick={handleDownloadErrorReport}
                  className="py-3 px-6 rounded-md bg-red-400 text-white font-semibold"
                >
                  Download Error Report
                </button>
                <button
                  onClick={handleUpload}
                  className="py-3 px-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 text-white 
                    hover:from-blue-600 hover:to-blue-700 
                    transition-all duration-300 
                    shadow-xl hover:shadow-2xl font-semibold"
                >
                  Upload
                </button>
              </div>

              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-900 dark:text-gray-300 border border-gray-300 rounded-full"
                  aria-label="Close"
                  onClick={handleClosePreviewModal}
                >
                  ✕
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ItemBulkModal;
