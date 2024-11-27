"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  useFetchBoM,
  useCreateBoMMutation,
  useUpdateBoMMutation,
  useDeleteBoMMutation,
} from "@/app/queries/BoM";
import { useFetchItems } from "@/app/queries/ItemsMaster";
import Loading from "../Loading";

const validateBoMEntry = (component) => {
  const errors = [];
  if (!component.item_id) errors.push("Item ID is required");
  if (!component.component_id) errors.push("Component ID is required");
  if (
    !component.quantity ||
    isNaN(Number(component.quantity)) ||
    Number(component.quantity) <= 0
  ) {
    errors.push("Quantity must be a positive number");
  }
  if (
    component.uom === "Nos" &&
    !Number.isInteger(Number(component.quantity))
  ) {
    errors.push("Quantity for Nos must be an integer");
  }
  return errors;
};

const BillsOfMaterials = () => {
  const [newComponent, setNewComponent] = useState({
    item_id: "",
    component_id: "",
    quantity: "",
    uom: "",
  });
  const [errors, setErrors] = useState([]);
  const [components, setComponents] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which component is being edited
  const [editedComponent, setEditedComponent] = useState(null);

  const { data: bomData, isLoading: bomLoading } = useFetchBoM();
  const { data: itemsData, isLoading: itemsLoading } = useFetchItems();

  const createBoM = useCreateBoMMutation();
  const updateBoM = useUpdateBoMMutation();
  const deleteBoM = useDeleteBoMMutation();

  useEffect(() => {
    if (bomData) {
      setComponents(
        bomData.map((item) => ({
          id: item.id,
          item_id: item.item_id,
          component_id: item.component_id,
          quantity: item.quantity,
          uom: item.uom || "KG",
        }))
      );
    }
  }, [bomData]);

  const handleRemove = (id) => {
    deleteBoM.mutate(
      { Id: id },
      {
        onSuccess: () =>
          setComponents(components.filter((component) => component.id !== id)),
      }
    );
  };

  const handleAddComponent = () => {
    const validationErrors = validateBoMEntry(newComponent);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    createBoM.mutate(
      {
        formData: {
          ...newComponent,
          quantity: Number(newComponent.quantity),
          created_by: 2,
          last_updated_by: 2,
        },
      },
      {
        onSuccess: () => {
          setNewComponent({
            item_id: "",
            component_id: "",
            quantity: "",
            uom: "",
          });
          setErrors([]);
        },
      }
    );
  };

  const handleEdit = (id) => {
    const component = components.find((comp) => comp.id === id);
    setEditingId(id);
    setEditedComponent({ ...component });
  };

  const handleSave = (id) => {
    const validationErrors = validateBoMEntry(editedComponent);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    updateBoM.mutate(
      {
        Id: id,
        formData: {
          ...editedComponent,
          quantity: Number(editedComponent.quantity),
          last_updated_by: 2,
        },
      },
      {
        onSuccess: () => {
          setComponents((prev) =>
            prev.map((comp) => (comp.id === id ? { ...editedComponent } : comp))
          );
          setEditingId(null);
          setErrors([]);
        },
      }
    );
  };

  const handleChange = (e, field, forEdit = false) => {
    if (forEdit) {
      setEditedComponent({ ...editedComponent, [field]: e.target.value });
    } else {
      setNewComponent({ ...newComponent, [field]: e.target.value });
    }
  };

  const itemOptions = itemsData
    ? itemsData.map((item) => ({
        value: item.id,
        label: `Item ${item.id} - ${item.internal_item_name}`,
      }))
    : [];

  const uomOptions = [
    { value: "Nos", label: "Nos" },
    { value: "KG", label: "KG" },
    { value: "M", label: "M" },
    { value: "PCS", label: "PCS" },
  ];

  if (bomLoading || itemsLoading) return <Loading />;

  return (
    <div className="bg-white w-full max-w-4xl mx-auto text-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Bill of Materials Builder
      </h2>

      {errors.length > 0 && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto mb-8">
        <table className="table table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-900">
              <th className="px-4 py-3 text-left">Item ID</th>
              <th className="px-4 py-3 text-center">Component ID</th>
              <th className="px-4 py-3 text-center">Quantity</th>
              <th className="px-4 py-3 text-center">UOM</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr key={component.id} className="border-b hover:bg-gray-100">
                {editingId === component.id ? (
                  <>
                    <td className="px-4 py-3 text-left">{component.item_id}</td>
                    <td className="px-4 py-3 text-center">
                      {component.component_id}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={editedComponent.quantity}
                        onChange={(e) => handleChange(e, "quantity", true)}
                        className="input input-bordered w-full focus:outline-none bg-white text-gray-900 py-2"
                        />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={editedComponent.uom}
                        onChange={(e) => handleChange(e, "uom", true)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        {uomOptions.map((uom) => (
                          <option key={uom.value} value={uom.value}>
                            {uom.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleSave(component.id)}
                      >
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-left">
                      {component.item_id}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {component.component_id}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {component.quantity}
                    </td>
                    <td className="px-4 py-3 text-center">{component.uom}</td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(component.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleRemove(component.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Add Component
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Item ID</label>
            <Select
              value={itemOptions.find(
                (option) => option.value === newComponent.item_id
              )}
              onChange={(selected) =>
                setNewComponent({
                  ...newComponent,
                  item_id: selected?.value || "",
                })
              }
              options={itemOptions}
              placeholder="Select Item ID"
              className=""
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Component ID</label>
            <Select
              value={itemOptions.find(
                (option) => option.value === newComponent.component_id
              )}
              onChange={(selected) =>
                setNewComponent({
                  ...newComponent,
                  component_id: selected?.value || "",
                })
              }
              options={itemOptions}
              placeholder="Select Component ID"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Quantity</label>
            <input
              type="number"
              value={newComponent.quantity}
              onChange={(e) => handleChange(e, "quantity")}
              className="p-3 py-1.5 border border-gray-400/60 rounded w-full focus:outline-none bg-white text-gray-900"
              placeholder="Enter Quantity"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">UOM</label>
            <Select
              value={uomOptions.find(
                (option) => option.value === newComponent.uom
              )}
              onChange={(selected) =>
                setNewComponent({ ...newComponent, uom: selected?.value || "" })
              }
              options={uomOptions}
              placeholder="Select UOM"
            />
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
          onClick={handleAddComponent}
        >
          Add Component
        </button>
      </div>
    </div>
  );
};

export default BillsOfMaterials;
