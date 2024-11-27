"use client";

import { useFetchItems } from "@/app/queries/ItemsMaster";
import { 
  useCreateProcessMutation, 
  useUpdateProcessMutation, 
  useDeleteProcessMutation, 
  useFetchProcesses 
} from "@/app/queries/Process";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlineSave, 
  HiOutlineX, 
  HiExclamationCircle 
} from "react-icons/hi";
import Loading from "../Loading";

const Processes = () => {
  // Initial form state
  const [formValues, setFormValues] = useState({
    process_name: "",
    type: "",
    process_description: "",
    factory_id: 15,
    tenant_id: 0,
    created_by: "user3",
    last_updated_by: "user3",
  });

  // State for editing and validation
  const [editingRow, setEditingRow] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    isValid: false,
    errors: {}
  });

  // Data fetching hooks
  const { data: processData, isLoading: processLoading, refetch } = useFetchProcesses();
  const { data: itemsData, isLoading: itemsLoading } = useFetchItems();

  // Mutation hooks
  const createProcess = useCreateProcessMutation();
  const updateProcess = useUpdateProcessMutation();
  const deleteProcess = useDeleteProcessMutation();

  // Validation function
  const validateForm = (values) => {
    const errors = {};

    // Mandatory field checks
    if (!values.process_name || values.process_name.trim() === '') {
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

    // Additional validation rules
    if (values.process_name && values.process_name.length < 3) {
      errors.process_name = "Process name must be at least 3 characters long";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Validation effect
  useEffect(() => {
    const validation = validateForm(formValues);
    setValidationErrors(validation);
  }, [formValues]);

  // Input change handler
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  // Select change handler
  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setFormValues(prev => ({
        ...prev,
        tenant_id: selectedOption.tenant_id,
      }));
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm(formValues);

    if (!validation.isValid) {
      setValidationErrors(validation);
      return;
    }

    createProcess.mutate({ formData: formValues }, {
      onSuccess: () => {
        refetch();
        // Reset form after successful submission
        setFormValues({
          process_name: "",
          type: "",
          process_description: "",
          factory_id: 15,
          tenant_id: 0,
          created_by: "user3",
          last_updated_by: "user3",
        });
        // Add toast notification
        toast.success('Process created successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      },
      onError: (error) => {
        // Handle API-level validation errors
        toast.error(`Submission failed: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  // Edit handlers
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

    updateProcess.mutate({ 
      processId: editingRow, 
      formData: formValues 
    }, {
      onSuccess: () => {
        refetch();
        setEditingRow(null);
        // Add toast notification
        toast.success('Process updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      },
      onError: (error) => {
        // Handle API-level validation errors
        toast.error(`Update failed: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const handleDelete = (processId) => {
    deleteProcess.mutate({ processId }, {
      onSuccess: () => {
        refetch();
        // Add toast notification
        toast.success('Process deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      },
      onError: (error) => {
        // Handle API-level validation errors
        toast.error(`Deletion failed: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  // Validation error rendering
  const renderValidationError = (field) => {
    const error = validationErrors.errors[field];
    return error ? (
      <div className="text-red-500 text-xs mt-1 flex items-center">
        <HiExclamationCircle className="mr-1" /> {error}
      </div>
    ) : null;
  };

  // Loading state
  if (processLoading || itemsLoading) return <Loading />;

  // Prepare item options for dropdown
  const itemOptions = itemsData?.map((item) => ({
    id: item.id,
    label: `${item.internal_item_name} (ID: ${item.id})`,
    tenant_id: item.tenant_id,
  }));

  return (
    <div className="bg-white w-full max-w-4xl mx-auto text-gray-900 p-6 rounded-lg shadow-lg">
      {/* ToastContainer for notifications */}
      <ToastContainer />

      <h2 className="text-lg font-bold mb-4">Process Management</h2>

      {/* Tenant Selection with Validation */}
      <div className="mb-6">
        <label htmlFor="tenant_id" className="block text-sm font-medium text-gray-700">
          Tenant <span className="text-red-600">*</span>
        </label>
        <Select
          id="tenant_id"
          value={itemOptions?.find((option) => option.id === formValues.tenant_id)}
          onChange={handleSelectChange}
          options={itemOptions}
          placeholder="Select Tenant"
          className={validationErrors.errors.tenant_id ? 'border-2 border-red-500' : ''}
        />
        {renderValidationError('tenant_id')}
      </div>

      {/* Process List Table */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-4">Processes</h3>
        <div className="overflow-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Process Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Last Updated By</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processData.map((process) => (
                <tr key={process.id} className="text-center">
                  <td className="px-4 py-2">
                    {editingRow === process.id ? (
                      <input
                        type="text"
                        value={formValues.process_name}
                        onChange={handleChange}
                        id="process_name"
                        className={`input input-bordered w-full ${validationErrors.errors.process_name ? 'input-error' : ''}`}
                      />
                    ) : (
                      process.process_name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingRow === process.id ? (
                      <input
                        type="text"
                        value={formValues.type}
                        onChange={handleChange}
                        id="type"
                        className="input input-bordered w-full"
                      />
                    ) : (
                      process.type
                    )}
                  </td>
                  <td className="px-4 py-2">{process.created_by}</td>
                  <td className="px-4 py-2">{process.last_updated_by}</td>
                  <td className="px-4 py-2 flex justify-center">
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

      {/* New Process Form */}
      <form className="grid grid-cols-2 gap-6 mt-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="process_name" className="block text-sm font-medium text-gray-700">
            Process Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="process_name"
            value={formValues.process_name}
            onChange={handleChange}
            className={`input input-bordered w-full ${validationErrors.errors.process_name ? 'input-error' : ''}`}
          />
          {renderValidationError('process_name')}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="type"
            value={formValues.type}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="process_description" className="block text-sm font-medium text-gray-700">
            Process Description
          </label>
          <textarea
            id="process_description"
            value={formValues.process_description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={!validationErrors.isValid}
            className={`btn w-full ${validationErrors.isValid ? 'btn-success' : 'btn-disabled'}`}
          >
            {validationErrors.isValid ? "Save Process" : "Complete Required Fields"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Processes;