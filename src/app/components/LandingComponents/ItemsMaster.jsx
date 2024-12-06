"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useFetchItems,
  useUpdateItemMutation,
} from "@/app/queries/ItemsMaster";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUpload,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../Loading";
import { ItemFormModal } from "@/app/modals/ItemModal";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import ItemBulkModal from "@/app/modals/ItemBulkModal";
import ErrorCard from "../ErrorCard";

const VALID_TYPES = ["sell", "purchase"];
const VALID_UOMS = ["kgs", "kg", "nos", "no"];

const validateItem = (newItem) => {
  const errors = [];

  if (!newItem.internal_item_name)
    errors.push("Internal item name is required.");

  if (!newItem.type || !VALID_TYPES.includes(newItem.type.toLowerCase())) {
    errors.push(`Type must be one of: ${VALID_TYPES.join(", ")}`);
  }

  if (!newItem.uom || !VALID_UOMS.includes(newItem.uom.toLowerCase())) {
    errors.push(`UoM must be one of: ${VALID_UOMS.join(", ")}`);
  }

  if (["sell", "purchase"].includes(newItem.type.toLowerCase())) {
    const minBuffer = parseFloat(newItem.min_buffer);
    const maxBuffer = parseFloat(newItem.max_buffer);

    if (isNaN(minBuffer) || isNaN(maxBuffer))
      errors.push("Buffer values must be valid numbers.");
    if (maxBuffer < minBuffer)
      errors.push(
        "Maximum buffer must be greater than or equal to minimum buffer."
      );
    if (!newItem.max_buffer) errors.push("Max buffer is required.");
    if (!newItem.min_buffer) errors.push("Min buffer is required.");
  }

  if (
    newItem.type.toLowerCase() === "sell" &&
    !newItem.additional_attributes?.scrap_type
  ) {
    errors.push("Scrap type is required for 'sell' items.");
  }

  if (
    newItem.additional_attributes?.avg_weight_needed === undefined ||
    newItem.additional_attributes?.avg_weight_needed === ""
  ) {
    errors.push("Average weight needed must be specified.");
  }

  if (!newItem.additional_attributes)
    errors.push("Additional attributes are required.");

  return errors;
};

const ItemsMaster = () => {
  const { data, isLoading, isError, error } = useFetchItems();
  const createItemMutation = useCreateItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const [itemsTypes, setItemsTypes] = useState({});

  useEffect(() => {
    // Check if itemsData is available and is an array
    if (data && Array.isArray(data)) {
      // Create a new object to avoid mutating the existing state
      const newItemsTypes = {};

      // Loop through the data and transform it into the desired object format
      data.forEach((item) => {
        if (item.id && item.type) {
          newItemsTypes[item.id] = item.type;
        }
      });

      // Update the state with the transformed object
      setItemsTypes(newItemsTypes);
    }
  }, [data]);
  const { csvData } = useSelector((state) => state.fileUploadItem);

  const handleEditClick = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemToDelete) => {
    deleteItemMutation.mutate(itemToDelete.id, {
      onSuccess: () => toast.success("Item deleted successfully!"),
      onError: (err) =>
        toast.error(
          `Failed to delete the item, ${err?.response?.data?.message}`
        ),
      onSettled: () => setBulkModalOpen(false),
    });
  };

  const handleSaveItem = (newItem) => {
    const validationErrors = validateItem(newItem);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    if (["sell", "purchase"].includes(newItem.type)) {
      newItem.additional_attributes.min_buffer ??= 0;
      newItem.additional_attributes.max_buffer ??= 0;
    }

    const mutation = editItem ? updateItemMutation : createItemMutation;
    const action = editItem ? "updated" : "created";

    mutation.mutate(
      {
        itemId: editItem?.id,
        formData: {
          ...newItem,
          tenant_id: 2,
          created_by: "current_user",
          createdAt: editItem ? undefined : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success(`Item ${action} successfully!`);
          setIsModalOpen(false);
          queryClient.invalidateQueries("items");
        },
        onError: () => toast.error(`Failed to ${action} item.`),
      }
    );
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data?.filter((item) =>
      [item.internal_item_name, item.type, item.uom]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const validateRow = (item) => {
    try {
      const errors = validateItem(item);
      return errors.length > 0;
    } catch {
      return true;
    }
  };

  const handleAddNewItem = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full flex flex-col overflow-auto">
      <div className="container mx-auto px-4 py-8 md:flex-1 bg-inherit">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">
              Items Master
            </h1>

            {/* Search and Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Search Input */}
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search items..."
                  className="
                    w-full md:w-96 pl-10 pr-4 py-2 
                    border border-gray-200 rounded-2xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-300
                    bg-gray-50 text-blue-900
                    dark:bg-gray-700 dark:text-white dark:border-gray-600
                    shadow-md
                  "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  className="
                    flex items-center gap-2 
                    px-4 py-2 rounded-full 
                    bg-gradient-to-br from-blue-500 to-blue-600 text-white 
                    hover:from-blue-600 hover:to-blue-700 
                    transition-all duration-300 
                    shadow-xl hover:shadow-2xl
                  "
                  onClick={() => setBulkModalOpen(true)}
                >
                  {csvData?.length === 0 ? (
                    <>
                      <FaUpload />
                      Bulk Upload
                    </>
                  ) : (
                    <>
                      <FaEye />
                      View CSV
                    </>
                  )}
                </button>

                <button
                  className="
                    flex items-center gap-2 
                    px-4 py-2 rounded-full 
                    bg-gradient-to-br from-green-500 to-green-600 text-white 
                    hover:from-green-600 hover:to-green-700 
                    transition-all duration-300 
                    shadow-xl hover:shadow-2xl
                  "
                  onClick={handleAddNewItem}
                >
                  <FaPlus />
                  Add Item
                </button>
              </div>
            </div>
          </div> 

          {/* Data Table */}
          {!isLoading && data ? (
            <div className="overflow-x-auto shadow-md">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="bg-gray-800 text-gray-300">
                  <tr className="bg-blue-800">
                    {[
                      "Item Name",
                      "Type",
                      "UoM",
                      "Avg Weight",
                      "Status",
                      "Action",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-center font-semibold bg-gray-800"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody >
                  {filteredData?.length > 0 ? (
                    filteredData?.map((item) => {
                      const validation = validateRow(item);
                      return (
                        <tr
                          key={item.id}
                          className="
                          border-b border-gray-700
                           hover:bg-gray-800
                          transition-colors duration-200
                        "
                        >
                          <td className="px-6 py-4 font-medium text-white">
                            {item.internal_item_name}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-300">
                            {item.type}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-300">
                            {item.uom}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-300">
                            {item.additional_attributes?.avg_weight_needed?.toString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`
                              px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                validation
                                  ? "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                                  : "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                              }
                            `}
                            >
                              {validation ? "Pending" : "Completed"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center space-x-2">
                              <button
                                className="
                                p-2 rounded-full 
                                text-blue-600 hover:bg-blue-100 
                                dark:text-blue-400 dark:hover:bg-blue-900/50
                                transition-all duration-300
                              "
                                onClick={() => handleEditClick(item)}
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                className="
                                p-2 rounded-full 
                                text-red-600 hover:bg-red-100 
                                dark:text-red-400 dark:hover:bg-red-900/50
                                transition-all duration-300
                              "
                                onClick={() => handleDeleteItem(item)}
                              >
                                <FaTrash size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 hover:bg-gray-800">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-24 w-24 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                          <h3 className="text-xl font-semibold text-gray-400">
                            No Items Found
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {searchQuery
                              ? "No items match your current filters"
                              : "Start by adding a new item"}
                          </p>
                          <button
                            onClick={handleAddNewItem}
                            className="
                            btn btn-primary btn-md mt-4 
                            bg-gradient-to-br from-blue-500 to-blue-600 text-white 
                            hover:from-blue-600 hover:to-blue-700
                            rounded-full px-6 py-2
                            transition-all duration-300
                            shadow-xl hover:shadow-2xl
                          "
                          >
                            Add New Item
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          )}

          {/* Error Handling */}
          {isError && <ErrorCard error={error} />}

          {/* Modals */}
          {isBulkModalOpen && (
            <ItemBulkModal
              isOpen={isBulkModalOpen}
              onClose={() => setBulkModalOpen(false)}
              type="items"
              itemsTypes={itemsTypes}
            />
          )}

          <ItemFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setEditItem(null);
              setIsModalOpen(false);
            }}
            onSave={handleSaveItem}
            tenantId={2}
            isLoading={
              createItemMutation.isLoading || updateItemMutation.isLoading
            }
            isError={createItemMutation.isError || updateItemMutation.isError}
            isEdit={!!editItem}
            item={editItem}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemsMaster;
