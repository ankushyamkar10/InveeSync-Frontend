'use client';
import React from 'react';
import { FiX } from 'react-icons/fi';

const ErrorHandlerModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-40">
      {/* Modal Window */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Bulk Upload Error Management Console
          </h1>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose} // Trigger onClose
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section: Summary */}
          <div>
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
                <div
                  className="bg-green-500 h-6 rounded-full"
                  style={{ width: '67%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-800 font-medium">67% Complete</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-600 font-medium">Error Summary:</p>
              <p className="text-gray-800">Total Records: 1000</p>
              <p className="text-gray-800">Successful: 670</p>
              <p className="text-gray-800">Failed: 330</p>
            </div>

            <div className="bg-red-100 p-4 rounded-md border border-red-300">
              <p className="text-red-800 font-semibold mb-2">
                Validation Errors:
              </p>
              <ul className="list-disc list-inside text-red-700">
                <li>Row 45: Invalid supplier_item_name format</li>
                <li>Row 122: process_description missing</li>
              </ul>
            </div>
          </div>

          {/* Right Section: Details */}
          <div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Supplier Item Name:
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter Supplier Item Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Process Description:
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter Process Description"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Quality Check:
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter Quality Check"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Conversion Ratio:
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter Conversion Ratio"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button className="btn btn-success w-1/2 mr-2">
                Apply Fixes
              </button>
              <button
                className="btn btn-error w-1/2 ml-2"
                onClick={onClose} // Trigger onClose
              >
                Cancel Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandlerModal;
