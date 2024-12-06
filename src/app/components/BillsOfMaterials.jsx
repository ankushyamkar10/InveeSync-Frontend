"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useFetchBoM,
  useCreateBoMMutation,
  useUpdateBoMMutation,
  useDeleteBoMMutation,
} from "@/app/queries/BillsOfMaterial";
import { useFetchItems } from "@/app/queries/ItemsMaster";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUpload,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import Select from "react-select";
import { BomFormModal } from "@/app/modals/BomModal";
import BomBulkModal from "@/app/modals/BomBulkModal";
import ErrorCard from "./ErrorCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validateBoMEntry = (component) => {
  return (
    !component.item_id ||
    !component.component_id ||
    !component.quantity ||
    isNaN(Number(component.quantity)) ||
    Number(component.quantity) <= 0 ||
    (component.uom === "Nos" && !Number.isInteger(Number(component.quantity)))
  );
};

const BillsOfMaterials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [errors, setErrors] = useState([]);
  const [components, setComponents] = useState([]);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: bomData,
    isLoading: bomLoading,
    isError: isBomError,
    error: bomError,
  } = useFetchBoM();
  const { data: itemsData, isLoading: itemsLoading } = useFetchItems();
  const createBoMMutation = useCreateBoMMutation();
  const updateBoMMutation = useUpdateBoMMutation();
  const deleteBoMMutation = useDeleteBoMMutation();

  const [itemsTypes, setItemsTypes] = useState({});

  useEffect(() => {

    if (itemsData && Array.isArray(itemsData)) {

      const newItemsTypes = {};


      itemsData.forEach((item) => {
        if (item.id && item.type) {
          newItemsTypes[item.id] = item.type;
        }
      });


      setItemsTypes(newItemsTypes);
    }
  }, [itemsData]);

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

  const filteredData = useMemo(() => {
    if (!searchQuery) return components;
    return components.filter((item) =>
      [item.item_id, item.component_id, item.uom]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [components, searchQuery]);

  const handleRemove = (id) => {
    deleteBoMMutation.mutate(id, {
      onSuccess: (data) => {
        setComponents(components.filter((comp) => comp.id !== id));
        toast.success("Item deleted successfully!")
      },
      onError: (err) =>
        toast.error(
          `Failed to delete the item, ${err?.response?.data?.message}`
        ),
    });
  };

  const handleEditClick = (bomEntry) => {
    setEditItem(bomEntry);
    setIsModalOpen(true);
  };

  const handleSave = (bomEntry) => {
    const isInvalid = validateBoMEntry(bomEntry);
    if (isInvalid) {
      setErrors(["Please fill in all required fields correctly"]);
      return;
    }
    updateBoMMutation.mutate(
      {
        bomId: editItem.id,
        formData: { ...bomEntry, quantity: Number(bomEntry.quantity) },
      },
      {
        onSuccess: () => {
          setComponents((prev) =>
            prev.map((comp) =>
              comp.id === bomEntry.id ? { ...bomEntry } : comp
            )
          );
          setEditItem(null);
          setIsModalOpen(false);
          setErrors([]);
        },
      }
    );
  };

  const itemOptions = itemsData
    ? itemsData.map((item) => ({
        value: item.id,
        label: item.internal_item_name,
      }))
    : [];

  const { csvData } = useSelector((state) => state.fileUploadBom);

  const handleCloseModal = () => setBulkModalOpen(false);

  const handleAddNewItem = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  if (bomLoading || itemsLoading) return <Loading />;

  return (
    <div className="min-h-screen from-gray-900 to-gray-800 w-full flex flex-col overflow-auto">
      <div className="container mx-auto px-4 py-8 md:flex-1">
        <div className="bg-white  dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Bill of Materials
            </h1>
  
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search BoMs..."
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
  
                    <div className="flex space-x-4">
                <button
                  className="
                    flex items-center gap-2 
                    px-4 py-2 rounded-full 
                    bg-blue-600 text-white 
                    hover:bg-blue-700 
                    transition-all duration-300 
                    shadow-md hover:shadow-lg
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
                    bg-green-600 text-white 
                    hover:bg-green-700 
                    transition-all duration-300 
                    shadow-md hover:shadow-lg
                  "
                  onClick={handleAddNewItem}
                >
                  <FaPlus />
                  Add BoM
                </button>
              </div>
            </div>
          </div>
  
                {!bomLoading && bomData ? (
            <div className="overflow-x-auto shadow-md">
             <table className="w-full text-sm text-left rtl:text-right">
                <thead className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300">
                  <tr className="bg-blue-800">
                    {["ID", "Item ID", "Component ID", "Quantity", "Status", "Action"].map((header) => (
                      <th 
                        key={header} 
                        className="px-6 py-3 text-center font-semibold bg-white dark:bg-gray-800"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData?.length > 0 ? (
                    filteredData.map((component) => (
                      <tr
                        key={component.id}
                        className="
                           border-b border-gray-700
                           hover:bg-white hover:dark:bg-gray-700 dark:bg-gray-800
                          transition-colors duration-200
                        "
                      >
                        <td className="px-6 py-4 font-medium dark:text-gray-300 text-gray-900">
                          {component.id}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                          {component.item_id}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                          {component.component_id}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                          {component.quantity}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`
                              px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                validateBoMEntry(component)
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                              }
                            `}
                          >
                            {validateBoMEntry(component) ? "Pending" : "Completed"}
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
                              onClick={() => handleEditClick(component)}
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
                              onClick={() => handleRemove(component.id)}
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 hover:bg-white hover:dark:bg-gray-700 dark:bg-gray-800">
                      <div className="flex flex-col items-center justify-center space-y-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-24 w-24 text-gray-600  dark:text-gray-400"
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
                            No BoMs Found
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {searchQuery
                              ? "No BoMs match your current filters"
                              : "Start by adding a new BoM"}
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
                            Add New BoM
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

      {isBomError && <ErrorCard error={bomError} />}

            {isBulkModalOpen && (
        <BomBulkModal
          isOpen={isBulkModalOpen}
          onClose={handleCloseModal}
          type={"bom"}
          itemsTypes={itemsTypes}
        />
      )}

      {isModalOpen && (
        <BomFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          onSave={handleSave}
          tenantId={2}
          isLoading={createBoMMutation.isLoading || updateBoMMutation.isLoading}
          isError={createBoMMutation.isError || updateBoMMutation.isError}
          isEdit={!!editItem}
          bomEntry={editItem}
          itemOptions={itemOptions}
        />
      )}
    </div>
    </div>
  </div>
  );
};

export default BillsOfMaterials;
