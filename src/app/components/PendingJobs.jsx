"use client";
import React, { useState, useMemo } from "react";
import { FiAlertTriangle, FiChevronRight, FiTool } from "react-icons/fi";
import BomBulkModal from "../modals/BomBulkModal";
import { useFetchItems } from "../queries/ItemsMaster";
import { useFetchBoM } from "../queries/BillsOfMaterial";
import { usePendingJobs } from "../hooks/usePendingJobs";
import Loading from "./Loading";

const PendingJobs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const { data: items = [], isLoading: itemsLoading } = useFetchItems();
  const { data: boms = [], isLoading: bomsLoading } = useFetchBoM();


  const pendingItems = usePendingJobs(items, boms);

  const openModal = (type, rowIndex) => {
    setModalType(type);
    setSelectedRowIndex(rowIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedRowIndex(null);
  };

  const loading = itemsLoading || bomsLoading;

  return (
    <div className="min-w-[20%] md:h-[calc(100vh-60px)]  bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-3 overflow-auto">
      <div className="flex items-center justify-between mb-6 border-b pb-3 ">
        <div className="flex items-center gap-3">
          <FiTool className="text-primary w-6 h-6 animate-pulse" />
          <h2 className="text-xl font-bold text-blue-900 dark:text-white">Pending Setup</h2>
        </div>
      </div>
  
      {loading ? (
        <div className="text-center text-gray-500 py-6 animate-pulse">
          Analyzing setup requirements...
          <Loading />
        </div>
      ) : pendingItems.length === 0 ? (
        <div className="text-center text-green-700 bg-green-50 dark:bg-green-900/30 py-6 rounded-lg border border-green-200 dark:border-green-700">
          🎉 All setup requirements are complete!
        </div>
      ) : (
        <div className="space-y-4">
          {pendingItems.map((item, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl ${
                item.severity === "high"
                  ? "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/60"
                  : "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-900/60"
              }`}
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
              <div className="relative z-10 p-4">
                <div className="flex items-start gap-3">
                  <FiAlertTriangle
                    className={`w-6 h-6 ${
                      item.severity === "high" ? "text-red-500 animate-bounce" : "text-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-base leading-tight mb-1 ${
                        item.severity === "high" ? "text-red-900 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600  dark:text-gray-300 mb-0">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* {isModalOpen && modalType === "sell_item" && (
        <BulkUploadModal
          type="sell_item"
          isOpen={isModalOpen}
          onClose={closeModal}
          highlightRowIndex={selectedRowIndex}
        />
      )} */}
  
      {/* {isModalOpen && modalType === "purchase_item" && (
        <BulkUploadModal
          type="purchase_item"
          isOpen={isModalOpen}
          onClose={closeModal}
          highlightRowIndex={selectedRowIndex}
        />
      )} */}
  
      {/* {isModalOpen && modalType === "component_item" && (
        <BomBulkModal
          type="component_item"
          isOpen={isModalOpen}
          onClose={closeModal}
          highlightRowIndex={selectedRowIndex}
        />
      )} */}
    </div>
  );
};

export default PendingJobs;