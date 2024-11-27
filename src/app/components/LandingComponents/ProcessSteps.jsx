'use client'

import { useFetchItems } from '@/app/queries/ItemsMaster'
import { useFetchProcesses, useFetchProcessSteps, useCreateProcessStepsMutation } from '@/app/queries/Process';
import React, { useState, useMemo } from 'react'
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProcessSteps = () => {
  const { data: items, isLoading: isLoadingItems } = useFetchItems();  
  const { data: processes, isLoading: isLoadingProcesses } = useFetchProcesses();  

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [sequence, setSequence] = useState('');
  const [conversionRatio, setConversionRatio] = useState('');

  // Use the new mutation hook for creating process steps
  const createProcessStepsMutation = useCreateProcessStepsMutation();

  // Fetch process steps with conditional fetching
  const { 
    data: processSteps, 
    isLoading: isLoadingSteps, 
    isError: isErrorSteps 
  } = useFetchProcessSteps(selectedItem?.value, selectedProcess?.value);

  // Memoize item and process options to avoid reprocessing on every render
  const itemOptions = useMemo(() => items?.map(item => ({
    value: item.id,
    label: item.internal_item_name
  })), [items]);

  const processOptions = useMemo(() => processes?.map(process => ({
    value: process.id,
    label: process.process_name
  })), [processes]);

  // Create lookup objects for items and processes to avoid repeated search
  const itemLookup = useMemo(() => {
    return items?.reduce((acc, item) => {
      acc[item.id] = item.internal_item_name;
      return acc;
    }, {});
  }, [items]);

  const processLookup = useMemo(() => {
    return processes?.reduce((acc, process) => {
      acc[process.id] = {
        name: process.process_name,
        type: process.type
      };
      return acc;
    }, {});
  }, [processes]);

  const handleItemChange = (selectedOption) => {
    setSelectedItem(selectedOption);
    setSelectedProcess(null);
    setSequence('');
    setConversionRatio('');
  };

  const handleProcessChange = (selectedOption) => {
    setSelectedProcess(selectedOption);
    setSequence('');
    setConversionRatio('');
  };

  const handleSequenceChange = (e) => setSequence(e.target.value);
  const handleConversionRatioChange = (e) => setConversionRatio(e.target.value);

  const validateForm = () => {
    // Validation checks
    const errors = [];

    if (!selectedItem) {
      errors.push('Please select an item');
    }

    if (!selectedProcess) {
      errors.push('Please select a process');
    }

    if (!sequence || isNaN(sequence) || parseInt(sequence) <= 0) {
      errors.push('Please enter a valid sequence number');
    }

    if (!conversionRatio || isNaN(conversionRatio) || parseFloat(conversionRatio) < 0) {
      errors.push('Please enter a valid conversion ratio');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      const formData = {
        item_id: selectedItem.value,
        process_id: selectedProcess.value,
        sequence: parseInt(sequence),
        conversion_ratio: parseFloat(conversionRatio),
        created_by:"user3",
        last_updated_by: "user4",
      };

      // Use the mutation to create process steps
      const response = await createProcessStepsMutation.mutateAsync({ formData });
      
      // Show success toast
      toast.success('Process step added successfully');

      // Reset form fields
      setSequence('');
      setConversionRatio('');
    } catch (error) {
      // Detailed error logging and user-friendly message
      console.error('Detailed Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });

      // Try to extract a meaningful error message
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Failed to add process step';

      // Show detailed error toast
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <ToastContainer 
        position="top-right" 
        autoClose={5000}  // Increased duration for error messages
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Process Steps Configuration</h2>
        <p className="text-gray-600 mb-6">Define manufacturing sequence and parameters</p>

        <div className="form-control w-full max-w-md mb-8">
          <label className="label">
            <span className="label-text text-gray-700 font-medium">Select Item</span>
          </label>
          <Select
            className="react-select text-gray-900"
            value={selectedItem}
            onChange={handleItemChange}
            options={itemOptions}
            placeholder="Select an item"
            isDisabled={isLoadingItems}
          />
        </div>

        {selectedItem && (
          <div className="form-control w-full max-w-md mb-8">
            <label className="label">
              <span className="label-text text-gray-700 font-medium">Select Process</span>
            </label>
            <Select
              className="react-select text-gray-900"
              value={selectedProcess}
              onChange={handleProcessChange}
              options={processOptions}
              placeholder="Select a process"
              isDisabled={isLoadingProcesses || !selectedItem}
            />
          </div>
        )}
      </div>

      {selectedItem && selectedProcess && (processSteps && processSteps.length > 0 ? 
        <div className="overflow-x-auto mt-6">
          <table className="table w-full text-gray-900 border border-gray-200">
            <thead>
              <tr className='text-gray-900'>
                <th>Item Name</th>
                <th>Process Name</th>
                <th>Process Type</th>
                <th>Sequence</th>
                <th>Conversion Ratio</th>
              </tr>
            </thead>
            <tbody >
              {isLoadingSteps ? (
                <tr className='text-gray-900'>
                  <td colSpan="6" className="text-center">Loading process steps...</td>
                </tr>
              ) : isErrorSteps ? (
                <tr className='text-gray-900'>
                  <td colSpan="6" className="text-center text-red-500">Error loading process steps. Please try again.</td>
                </tr>
              ) : (
                processSteps?.map((processStep, index) => {
                  const itemName = itemLookup[processStep.item_id] || 'Unknown Item';
                  const { name: processName, type: processType } = processLookup[processStep.process_id] || { name: 'Unknown Process', type: 'Unknown Type' };

                  return (
                    <tr className='text-gray-900' key={index}>
                      <td>{itemName}</td>
                      <td>{processName}</td>
                      <td>{processType}</td>
                      <td>{processStep.sequence}</td>
                      <td>{processStep.conversion_ratio}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
       : <div className='py-6 border border-gray-200 text-center text-gray-900'>No Data for above selected pair</div>)}

      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900">Add New Process Step</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full max-w-md mb-4">
            <label className="label">
              <span className="label-text text-gray-700 font-medium">Sequence</span>
            </label>
            <input
              type="number"
              value={sequence}
              onChange={handleSequenceChange}
              disabled={!selectedItem || !selectedProcess}
              className="input input-bordered w-full bg-white text-gray-900 outline-none"
              placeholder="Enter sequence number"
              min="1"
            />
          </div>

          <div className="form-control w-full max-w-md mb-4">
            <label className="label">
              <span className="label-text text-gray-700 font-medium">Conversion Ratio</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={conversionRatio}
              onChange={handleConversionRatioChange}
              disabled={!selectedItem || !selectedProcess}
              className="input input-bordered w-full"
              placeholder="Enter conversion ratio"
              min="0"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={!selectedItem || !selectedProcess || !sequence || !conversionRatio || createProcessStepsMutation.isLoading}
          >
            {createProcessStepsMutation.isLoading ? 'Adding...' : 'Add Process Step'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProcessSteps;