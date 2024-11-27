'use client';
import React, { useState } from 'react';
import { FiAlertTriangle, FiChevronRight, FiTool } from 'react-icons/fi';
import ErrorHandlerModal from "../modals/ErrorHandlerModal";

const PendingSetup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingItems = [
    {
      title: 'Steel Pipe Grade A',
      description: 'Missing UoM',
      href: '/resolve/steel-pipe',
      severity: 'high',
    },
    {
      title: 'Assembly X23',
      description: 'Incomplete components',
      href: '/resolve/assembly-x23',
      severity: 'medium',
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-w-[20%] border-l border-gray-200 bg-white p-6">

      <div className="flex items-center justify-between mb-6 ">
        <div className="flex items-center gap-2">
          <FiTool className="text-warning" />
          <h2 className="text-lg font-bold text-gray-900">Pending Setup</h2>
        </div>
        <div className="badge badge-warning badge-sm">
          {pendingItems.length} items
        </div>
      </div>


      <div className="space-y-4">
        {pendingItems.map((item, index) => (
          <div
            key={index}
            className="card bg-base-100 hover:bg-base-50 transition-colors duration-200 shadow-sm"
          >
            <div className="card-body p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <FiAlertTriangle className="text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-base-content/70 mb-3">
                    {item.description}
                  </p>
                  <span
                    href={item.href}
                    className="btn btn-warning btn-sm gap-2 w-full"
                  >
                    Resolve Now
                    <FiChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      {pendingItems.length > 0 && (
        <div className="mt-6">
          <button
            className="btn btn-ghost btn-sm w-full text-gray-900"
            onClick={openModal}
          >
            Check Error Modal
          </button>
        </div>
      )}


      {isModalOpen && <ErrorHandlerModal onClose={closeModal} />}
    </div>
  );
};

export default PendingSetup;
