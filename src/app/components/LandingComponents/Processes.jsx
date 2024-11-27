"use client";

import { useFetchItems } from "@/app/queries/ItemsMaster";
import {
  useCreateProcessMutation,
  useUpdateProcessMutation,
  useDeleteProcessMutation,
  useFetchProcesses,
} from "@/app/queries/Process";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineX,
  HiExclamationCircle,
} from "react-icons/hi";
import Loading from "../Loading";

const Processes = () => {
  const [formValues, setFormValues] = useState({
    process_name: "",
    type: "",
    process_description: "",
    factory_id: 15,
    tenant_id: 0,
    created_by: "user3",
    last_updated_by: "user3",
  });

  const [editingRow, setEditingRow] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    isValid: false,
    errors: {},
  });

  const {
    data: processData,
    isLoading: processLoading,
    refetch,
  } = useFetchProcesses();
  const { data: itemsData, isLoading: itemsLoading } = useFetchItems();

  const createProcess = useCreateProcessMutation();
  const updateProcess = useUpdateProcessMutation();
  const deleteProcess = useDeleteProcessMutation();

  const validateForm = (values) => {
    const errors = {};

    if (!values.process_name || values.process_name.trim() === "") {
      errors.process_name = "Process name is required";
    }

    if (!values.type) {
      errors.type = "Process type is required";
    }

    if (!values.tenant_id || values.tenant_id === 0) {
      errors.tenant_id = "Tenant selection is required";
    }

    if (!values.factory_id) {
      errors.factory_id = "Factory ID is required";
    }

    if (values.process_name && values.process_name.length < 3) {
      errors.process_name = "Process name must be at least 3 characters long";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  useEffect(() => {
    const validation = validateForm(formValues);
    setValidationErrors(validation);
  }, [formValues]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setFormValues((prev) => ({
        ...prev,
        tenant_id: selectedOption.tenant_id,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm(formValues);

    if (!validation.isValid) {
      setValidationErrors(validation);
      return;
    }

    createProcess.mutate(
      { formData: formValues },
      {
        onSuccess: () => {
          refetch();

          setFormValues({
            process_name: "",
            type: "",
            process_description: "",
            factory_id: 15,
            tenant_id: 0,
            created_by: "user3",
            last_updated_by: "user3",
          });

          toast.success("Process created successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        },
        onError: (error) => {
          toast.error(`Submission failed: ${error.message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        },
      }
    );
  };

  const handleEdit = (process) => {
    setFormValues({
      process_name: process.process_name,
      type: process.type,
      process_description: process.process_description,
      factory_id: process.factory_id,
      tenant_id: process.tenant_id,
      created_by: process.created_by,
      last_updated_by: process.last_updated_by,
    });
    setEditingRow(process.id);
  };

  const handleSaveEdit = () => {
    const validation = validateForm(formValues);

    if (!validation.isValid) {
      setValidationErrors(validation);
      return;
    }

    updateProcess.mutate(
      {
        processId: editingRow,
        formData: formValues,
      },
      {
        onSuccess: () => {
          refetch();
          setEditingRow(null);

          toast.success("Process updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        },
        onError: (error) => {
          toast.error(`Update failed: ${error.message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const handleDelete = (processId) => {
    deleteProcess.mutate(
      { processId },
      {
        onSuccess: () => {
          refetch();

          toast.success("Process deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        },
        onError: (error) => {
          toast.error(`Deletion failed: ${error.message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        },
      }
    );
  };

  const renderValidationError = (field) => {
    const error = validationErrors.errors[field];
    return error ? (
      <div className="text-red-500 text-xs mt-1 flex items-center">
        <HiExclamationCircle className="mr-1" /> {error}
      </div>
    ) : null;
  };

  if (processLoading || itemsLoading) return <Loading />;

  const itemOptions = itemsData?.map((item) => ({
    id: item.id,
    label: `${item.internal_item_name} (ID: ${item.id})`,
    tenant_id: item.tenant_id,
  }));

  return (
    <div className="bg-white w-full max-w-4xl mx-auto text-gray-900 p-6 rounded-lg shadow-lg">
      <ToastContainer />

      <h2 className="text-lg font-bold mb-4">Process Management</h2>

      <div className="mb-6">
        <label
          htmlFor="tenant_id"
          className="block text-sm font-medium text-gray-700"
        >
          Tenant <span className="text-red-600">*</span>
        </label>
        <Select
          id="tenant_id"
          value={itemOptions?.find(
            (option) => option.id === formValues.tenant_id
          )}
          onChange={handleSelectChange}
          options={itemOptions}
          placeholder="Select Tenant"
          className={
            validationErrors.errors.tenant_id ? "border-2 border-red-500" : ""
          }
        />
        {renderValidationError("tenant_id")}
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-4">Processes</h3>
        <div className="overflow-auto">
          <table className="table table-auto w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-900">
                <th className="px-4 py-3 text-left">Process Name</th>
                <th className="px-4 py-3 text-center ">Type</th>
                <th className="px-4 py-3 text-center ">Created By</th>
                <th className="px-4 py-3 text-center ">Last Updated By</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processData.map((process) => (
                <tr key={process.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-3 text-left">
                    {editingRow === process.id ? (
                      <input
                        type="text"
                        value={formValues.process_name}
                        onChange={handleChange}
                        id="process_name"
                        className={`input input-bordered w-full focus:outline-none bg-white text-gray-900 ${
                          validationErrors.errors.process_name
                            ? "input-error"
                            : ""
                        }`}
                      />
                    ) : (
                      process.process_name
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingRow === process.id ? (
                      <input
                        type="text"
                        value={formValues.type}
                        onChange={handleChange}
                        id="type"
                        className="input input-bordered w-full focus:outline-none bg-white text-gray-900"
                      />
                    ) : (
                      process.type
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{process.created_by}</td>
                  <td className="px-4 py-3 text-center">{process.last_updated_by}</td>
                  <td className="px-4 py-3 text-center flex justify-center">
                    {editingRow === process.id ? (
                      <>
                        <button
                          className="btn btn-sm btn-success mr-2"
                          onClick={handleSaveEdit}
                        >
                          <HiOutlineSave />
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={handleCancelEdit}
                        >
                          <HiOutlineX />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-outline btn-primary mr-2"
                          onClick={() => handleEdit(process)}
                        >
                          <HiOutlinePencilAlt />
                        </button>
                        <button
                          className="btn btn-sm btn-outline btn-danger"
                          onClick={() => handleDelete(process.id)}
                        >
                          <HiOutlineTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form className="grid grid-cols-2 gap-6 mt-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="process_name"
            className="block text-sm font-medium text-gray-700"
          >
            Process Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="process_name"
            value={formValues.process_name}
            onChange={handleChange}
            className={`input input-bordered w-full focus:outline-none bg-white text-gray-900 ${
              validationErrors.errors.process_name ? "input-error" : ""
            }`}
          />
          {renderValidationError("process_name")}
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="type"
            value={formValues.type}
            onChange={handleChange}
            className="input input-bordered w-full focus:outline-none bg-white text-gray-900"
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="process_description"
            className="block text-sm font-medium text-gray-700"
          >
            Process Description
          </label>
          <textarea
            id="process_description"
            value={formValues.process_description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full focus:outline-none bg-white text-gray-900"
          ></textarea>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={!validationErrors.isValid}
            className={`py-4 rounded-md w-full text-white font-semibold ${
              validationErrors.isValid ? "bg-green-600" : "bg-red-500 text-gray-900 cursor-not-allowed"
            }`}
          >
            {validationErrors.isValid
              ? "Save Process"
              : "Complete Required Fields"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Processes;
