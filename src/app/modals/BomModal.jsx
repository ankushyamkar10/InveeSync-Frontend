"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Select from "react-select";
import { VALID_UOMS } from "../utils/constants";

export const BomFormModal = ({
  isOpen,
  onClose,
  onSave,
  bomEntry,
  itemOptions,
  isEdit,
}) => {
  const [formData, setFormData] = useState({
    item_id: "",
    component_id: "",
    quantity: "",
  });

  useEffect(() => {
    if (isEdit && bomEntry) {
      setFormData({
        item_id: bomEntry.item_id || "",
        component_id: bomEntry.component_id || "",
        quantity: bomEntry.quantity || "",
        uom: bomEntry.uom || "",
      });
    }
    return () => {
      setFormData({
        item_id: "",
        component_id: "",
        quantity: "",
        uom: "",
      });
    };
  }, [isEdit, bomEntry]);

  // Handle form field changes
  const handleChange = (e, name) => {
    const value = name === "quantity" ? e.target.value : e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selected, name) => {
    setFormData({ ...formData, [name]: selected ? selected.value : "" });
  };

  // Form validation
  const validateForm = () => {
    const { item_id, component_id, quantity, uom } = formData;

    // Ensure that required fields are filled and valid
    if (!item_id || !component_id || !quantity || !uom) {
      return false;
    }

    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      return false;
    }

    if (uom === "Nos" && !Number.isInteger(Number(quantity))) {
      return false;
    }

    return true;
  };

  // Don't show the modal if it's not open
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[700px] max-h-[80%] overflow-auto max-w-full border border-gray-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-300">
            {isEdit ? "Edit BoM Entry" : "Add BoM Entry"}
          </h2>
          <button onClick={onClose} className="text-red-600">
            <FaTimes />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[500px] mt-4">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Item ID */}
            <div className="w-full">
            <label className="block font-semibold text-gray-300">
            Item ID <span className="text-red-600">*</span>
              </label>
              <Select
                value={itemOptions.find(
                  (option) => option.value === formData.item_id
                )}
                onChange={(selected) => handleSelectChange(selected, "item_id")}
                options={itemOptions}
                className="bg-gray-700 text-gray-300 focus:outline-none"
                placeholder="Select Item"
              />
            </div>

            {/* Component ID */}
            <div className="w-full">
              <label className="block font-semibold text-gray-700">
                Component ID <span className="text-red-600">*</span>
              </label>
              <Select
                value={itemOptions.find(
                  (option) => option.value === formData.component_id
                )}
                onChange={(selected) =>
                  handleSelectChange(selected, "component_id")
                }
                options={itemOptions}
                className="bg-gray-700 text-gray-300 focus:outline-none"
                placeholder="Select Component"
              />
            </div>

            {/* Quantity */}
            <div className="w-full">
              <label className="block font-semibold text-gray-300">
                Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange(e, "quantity")}
                className="input input-bordered w-full bg-gray-700 text-gray-300 focus:outline-none"
                placeholder="Enter Quantity"
              />
            </div>
          </form>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
                className="btn btn-primary bg-gradient-to-br from-blue-500 to-blue-600 text-white 
                hover:from-blue-600 hover:to-blue-700 
                transition-all duration-300 
                shadow-xl hover:shadow-2xl disabled:bg-gray-700"
            onClick={() => {
              if (validateForm()) {
                onSave(formData);
                onClose();
              }
            }}
            disabled={!validateForm()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Example of validation for BoM entry
const validatebomEntry = (component) => {
  return (
    !component.item_id ||
    !component.component_id ||
    !component.quantity ||
    isNaN(Number(component.quantity)) ||
    Number(component.quantity) <= 0 ||
    (component.uom === "Nos" && !Number.isInteger(Number(component.quantity)))
  );
};
