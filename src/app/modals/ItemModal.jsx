"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const initialState = {
  internal_item_name: "",
  item_description: "",
  uom: "",
  type: "",
  max_buffer: "",
  min_buffer: "",
  customer_item_name: "",
  is_job_work: false,
  created_by: "user1",
  last_updated_by: "user2",
  additional_attributes: {
    drawing_revision_number: "",
    drawing_revision_date: "",
    avg_weight_needed: "",
    scrap_type: "",
    shelf_floor_alternate_name: "",
  },
};

export const ItemFormModal = ({ isOpen, onClose, onSave, item, isEdit }) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); // New state to control form validation

  useEffect(() => {
    if (isEdit && item) {
      setFormData(item);
    }
    return () => setFormData(initialState);
  }, [isEdit, item]);

  const handleChange = (e, name) => {
    const value = name === "is_job_work" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (e, name) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      additional_attributes: { ...prev.additional_attributes, [name]: value },
    }));
  };

  // Validate the form and update the isFormValid state
  const validateForm = () => {
    const newErrors = {};
    const {
      internal_item_name,
      type,
      uom,
      max_buffer,
      min_buffer,
      additional_attributes,
    } = formData;

    if (!internal_item_name)
      newErrors.internal_item_name = "Item name is required.";
    if (!type) newErrors.type = "Type is required.";
    if (!uom) newErrors.uom = "UOM is required.";
    if (["sell", "purchase"].includes(type.toLowerCase()) && !max_buffer)
      newErrors.max_buffer = "Max buffer is required.";
    if (["sell", "purchase"].includes(type.toLowerCase()) && !min_buffer)
      newErrors.min_buffer = "Min buffer is required.";
    if (!additional_attributes.avg_weight_needed)
      newErrors.avg_weight_needed = "Average weight needed is required.";
    if (type.toLowerCase() === "sell" && !additional_attributes.scrap_type)
      newErrors.scrap_type = "Scrap type is required when type is 'sell'.";
    if (max_buffer && min_buffer && max_buffer < min_buffer) {
      newErrors.max_buffer = "Max buffer should be greater than Min buffer";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0); // Set form validity based on errors
  };

  useEffect(() => {
    validateForm(); // Run validation whenever formData changes
  }, [formData]); // Trigger validation only when formData changes

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[700px] max-h-[80%] overflow-auto max-w-full border border-gray-300">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-300">
            {isEdit ? "Edit Item" : "Add Item"}
          </h2>
          <button onClick={onClose} className="text-red-600">
            <FaTimes />
          </button>
        </div>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            "internal_item_name",
            "item_description",
            "uom",
            "type",
            "max_buffer",
            "min_buffer",
            "customer_item_name",
          ].map((field) => (
            <div key={field} className="w-full">
              <label className="block font-semibold text-gray-300">
                {field.replace("_", " ").toUpperCase()}{" "}
                <span className="text-red-600">*</span>
              </label>
              <input
                type={
                  field === "max_buffer" || field === "min_buffer"
                    ? "number"
                    : "text"
                }
                value={formData[field] || ""}
                onChange={(e) => handleChange(e, field)}
                className="input input-bordered w-full bg-gray-700 text-gray-300 focus:outline-none"
                placeholder={`Enter ${field.replace("_", " ")}`}
              />
              {errors[field] && (
                <p className="text-red-600 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}

          <div className="w-full sm:col-span-2">
            <h3 className="text-md font-semibold text-gray-300 mt-4">
              Additional Attributes
            </h3>
            {[
              "drawing_revision_number",
              "drawing_revision_date",
              "avg_weight_needed",
              "scrap_type",
              "shelf_floor_alternate_name",
            ].map((attr) => (
              <div key={attr} className="my-4">
                <label className="block text-sm font-semibold text-gray-300">
                  {attr.replace("_", " ").toUpperCase()}{" "}
                  <span className="text-red-600">*</span>
                </label>
                {attr === "avg_weight_needed" ? (
                  <div className="flex space-x-4">
                    {["TRUE", "FALSE"].map((value) => (
                      <label
                        key={value}
                        className="flex items-center text-gray-300"
                      >
                        <input
                          type="radio"
                          value={value}
                          checked={
                            formData.additional_attributes[attr] === value
                          }
                          onChange={(e) => handleAttributeChange(e, attr)}
                          className="mr-2"
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={attr === "drawing_revision_date" ? "date" : "text"}
                    value={formData.additional_attributes[attr] || ""}
                    onChange={(e) => handleAttributeChange(e, attr)}
                    className="input input-bordered w-full bg-gray-700 text-gray-300 focus:outline-none"
                    placeholder={`Enter ${attr.replace("_", " ")}`}
                  />
                )}
                {errors[attr] && (
                  <p className="text-red-600 text-sm">{errors[attr]}</p>
                )}
              </div>
            ))}
          </div>
        </form>
        <div className="mt-6 flex justify-end space-x-2">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary bg-gradient-to-br from-blue-500 to-blue-600 text-white 
                    hover:from-blue-600 hover:to-blue-700 
                    transition-all duration-300 
                    shadow-xl hover:shadow-2xl"
            onClick={() => {
              if (isFormValid) {
                onSave(formData);
                onClose();
              }
            }}
            disabled={!isFormValid}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
