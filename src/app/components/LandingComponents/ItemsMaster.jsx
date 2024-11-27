"use client";

import React, { useState, useMemo } from "react";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useFetchItems,
  useUpdateItemMutation,
} from "@/app/queries/ItemsMaster";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import Select from "react-select";
import Loading from "../Loading";


const ItemFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  tenantId = 2,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      internal_item_name: '',
      item_description: '',
      uom: '',
      type: '',
      max_buffer: '',
      min_buffer: '',
      customer_item_name: '',
      is_job_work: false,
      created_by: 'user1',
      last_updated_by: 'user2',
      additional_attributes: {
        drawing_revision_number: '',
        drawing_revision_date: '',
        avg_weight_needed: '',
        scrap_type: '',
        shelf_floor_alternate_name: '',
      },
      tenant_id: 2,
    }
  );

  const { data: items, isLoading, error } = useFetchItems();

  const handleChange = (e, name) => {
    const value = name === 'is_job_work' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdditionalAttributeChange = (e, name) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      additional_attributes: { ...formData.additional_attributes, [name]: value },
    });
  };

  const validateForm = () => {
    const {
      internal_item_name,
      type,
      uom,
      max_buffer,
      min_buffer,
      customer_item_name,
      additional_attributes,
    } = formData;

    if (!internal_item_name || !type || !uom || !max_buffer || !min_buffer || !customer_item_name) {
      return false;
    }


    if (
      !additional_attributes.drawing_revision_number ||
      !additional_attributes.drawing_revision_date ||
      !additional_attributes.avg_weight_needed ||
      !additional_attributes.scrap_type ||
      !additional_attributes.shelf_floor_alternate_name
    ) {
      return false;
    }


    const isDuplicate = items?.some(
      (item) =>
        item.internal_item_name === internal_item_name &&
        item.tenant_id === tenantId
    );
    if (isDuplicate) {
      alert('An item with this name already exists for the tenant.');
      return false;
    }

    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[700px] max-w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Add/Edit Item</h2>
          <button onClick={onClose} className="text-red-600">
            <FaTimes />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[500px] mt-4">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="w-full">
              <label className="block font-semibold text-gray-700">Item Name</label>
              <input
                type="text"
                value={formData.internal_item_name}
                onChange={(e) => handleChange(e, 'internal_item_name')}
              className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                placeholder="Enter item name"
              />
            </div>


            <div className="w-full">
              <label className="block font-semibold text-gray-700">Item Description</label>
              <input
                type="text"
                value={formData.item_description}
                onChange={(e) => handleChange(e, 'item_description')}
              className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                placeholder="Enter item description"
              />
            </div>


            <div className="w-full">
              <label className="block font-semibold text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange(e, 'type')}
                className="select select-bordered w-full bg-white text-gray-900 focus:outline-none"
              >
                <option value="">Select type</option>
                <option value="sell">Sell</option>
                <option value="purchase">Purchase</option>
                <option value="component">Component</option>
              </select>
            </div>


            <div className="w-full">
              <label className="block font-semibold text-gray-700">UoM</label>
              <input
                type="text"
                value={formData.uom}
                onChange={(e) => handleChange(e, 'uom')}
              className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                placeholder="Enter UoM"
              />
            </div>


            <div className="w-full">
              <label className="block font-semibold text-gray-700">Max Buffer</label>
              <input
                type="number"
                value={formData.max_buffer}
                onChange={(e) => handleChange(e, 'max_buffer')}
              className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                placeholder="Enter max buffer"
                min="0"
              />
            </div>


            <div className="w-full">
              <label className="block font-semibold text-gray-700">Min Buffer</label>
              <input
                type="number"
                value={formData.min_buffer}
                onChange={(e) => handleChange(e, 'min_buffer')}
              className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                placeholder="Enter min buffer"
                min="0"
              />
            </div>


            <div className="w-full">
              <label className="block font-semibold text-gray-700">Customer Item Name</label>
              <input
                type="text"
                value={formData.customer_item_name}
                onChange={(e) => handleChange(e, 'customer_item_name')}
              className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                placeholder="Enter customer item name"
              />
            </div>


            <div className="w-full sm:col-span-2">
              <h3 className="font-semibold mb-2 text-gray-900">Additional Attributes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700">Drawing Revision Number</label>
                  <input
                    type="text"
                    value={formData.additional_attributes.drawing_revision_number}
                    onChange={(e) => handleAdditionalAttributeChange(e, 'drawing_revision_number')}
                  className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Drawing Revision Date</label>
                  <input
                    type="date"
                    value={formData.additional_attributes.drawing_revision_date}
                    onChange={(e) => handleAdditionalAttributeChange(e, 'drawing_revision_date')}
                  className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Average Weight Needed</label>
                  <input
                    type="number"
                    value={formData.additional_attributes.avg_weight_needed}
                    onChange={(e) => handleAdditionalAttributeChange(e, 'avg_weight_needed')}
                  className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Scrap Type</label>
                  <input
                    type="text"
                    value={formData.additional_attributes.scrap_type}
                    onChange={(e) => handleAdditionalAttributeChange(e, 'scrap_type')}
                  className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Shelf Floor Alternate Name</label>
                  <input
                    type="text"
                    value={formData.additional_attributes.shelf_floor_alternate_name}
                    onChange={(e) => handleAdditionalAttributeChange(e, 'shelf_floor_alternate_name')}
                  className="input input-borderd w-full bg-white text-gray-900 disabled:bg-white disabled:border-gray-200 disabled:placeholder:text-gray-900 focus:outline-none border border-gray-200"
                  />
                </div>
              </div>
            </div>


            <div className="flex items-center space-x-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={formData.is_job_work}
                onChange={(e) => handleChange(e, 'is_job_work')}
                className="checkbox checkbox-primary"
              />
              <label className="font-semibold text-gray-900">Is Job Work</label>
            </div>
          </form>
        </div>


        <div className="mt-6 flex justify-end space-x-2">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
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



const ItemMasterRow = React.memo(({ item, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableItem, setEditableItem] = useState(item);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditableItem({ ...item });
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onEdit(editableItem);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditableItem(item);
  };

  const handleChange = (value, field) => {
    setEditableItem({
      ...editableItem,
      [field]: value,
    });
  };

  const validateRow =
    !editableItem.internal_item_name ||
    !editableItem.type ||
    !editableItem.uom ||
    !editableItem.avg_weight_needed;

  const typeOptions = useMemo(
    () => [
      { value: "sell", label: "Sell" },
      { value: "purchase", label: "Purchase" },
      { value: "component", label: "Component" },
    ],
    []
  );

  return (
    <tr className="border-gray-200 text-gray-900 hover:bg-gray-100 text-center">
      <td className="text-left">
        {isEditing ? (
          <input
            type="text"
            value={editableItem.internal_item_name}
            onChange={(e) => handleChange(e.target.value, "internal_item_name")}
            className="input input-bordered w-full"
          />
        ) : (
          item.internal_item_name
        )}
      </td>
      <td>
        {isEditing ? (
          <Select
            value={typeOptions.find(
              (option) => option.value === editableItem.type
            )}
            onChange={(selected) => handleChange(selected.value, "type")}
            options={typeOptions}
            placeholder="Select Type"
            className="react-select text-gray-900 bg-white"          />
        ) : (
          item.type
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editableItem.uom}
            onChange={(e) => handleChange(e.target.value, "uom")}
            className="input input-bordered w-full"
          />
        ) : (
          item.uom
        )}
      </td>
      <td>{item.additional_attributes.avg_weight_needed}</td>
      <td className="">
        <span
          className={`badge text-sm py-3 text-gray-900 border ${
            validateRow ? "badge-warning" : "bg-green-200 border-green-300"
          }`}
        >
          {validateRow ? "Pending" : "Completed"}
        </span>
      </td>
      <td className="flex justify-center space-x-2">
        {!isEditing ? (
          <>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleEditClick}
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={() => onDelete(item)}
            >
              <FaTrash />
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-sm btn-success"
              onClick={handleSaveClick}
            >
              <FaSave />
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={handleCancelClick}
            >
              <FaTimes />
            </button>
          </>
        )}
      </td>
    </tr>
  );
});

const ItemsMaster = () => {
  const { data, isLoading, isError } = useFetchItems();
  const createItemMutation = useCreateItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleEditItem = (updatedItem) => {
    updateItemMutation.mutate({ itemId: updatedItem.id, formData: updatedItem });
  };

  const handleDeleteItem = ( itemToDelete ) => {
    deleteItemMutation.mutate({ itemId: itemToDelete.id });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div className="text-center text-red-600">Error fetching data</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Items Master</h1>
        <button
          className="btn btn-primary text-white"
          onClick={() => {
            setEditItem(null);
            setIsModalOpen(true);
          }}
        >
          <FaPlus className="mr-2" /> Add Item
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-900 text-center">
              <th className="px-4 py-3 text-left">Item Name</th>
              <th className="px-4 py-3 text-center">Type</th>
              <th className="px-4 py-3 text-center">UoM</th>
              <th className="px-4 py-3 text-center">Avg Weight</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <ItemMasterRow
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newItem) => createItemMutation.mutate({formData:newItem})}
        initialData={editItem}
        tenantId={2}
      />
    </div>
  );
};

export default ItemsMaster;