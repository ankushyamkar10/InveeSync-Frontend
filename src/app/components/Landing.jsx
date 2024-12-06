"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import ItemsMaster from "./LandingComponents/ItemsMaster";
import BillsOfMaterials from "./LandingComponents/BillsOfMaterials";
import {
  FiBox,
  FiLayers,
  FiTrendingUp,
  FiCheckSquare,
  FiAlertCircle,
} from "react-icons/fi";
import { useFetchBoM } from "../queries/BoM";
import { useFetchItems } from "../queries/ItemsMaster";
import { usePendingSetup } from "../hooks/usePendingSetup";

const GlassCard = ({ title, count, icon: Icon, isLoading, colorClass, gradientClass }) => (
  <div className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl ${gradientClass}`}>
    <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
    <div className="relative z-10 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        <div className={`p-2 rounded-full ${colorClass} bg-opacity-20`}>
          <Icon size={20} className={`${colorClass}`} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {isLoading ? "..." : count}
        </span>
        <div className={`text-xs px-2 py-1 rounded-full ${colorClass} bg-opacity-20`}>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {title === "Item Master Entries" && "Total active items"}
        {title === "BoM Entries" && "Total Bills of Materials"}
        {title === "Pending Entries" && "Entries requiring review"}
      </div>
    </div>
  </div>
);

const Landing = () => {
  const [activeTab, setActiveTab] = useState("Items Master");

  // Fetch items and BOM data
  const { data: itemsData, isLoading: isItemsLoading } = useFetchItems();
  const { data: bomData, isLoading: isBomLoading } = useFetchBoM();

  // Count items using a for loop
  const itemCount = useMemo(() => {
    if (!itemsData) return 0;

    let count = 0;
    for (let i = 0; i < itemsData.length; i++) {
      if (!itemsData[i].is_deleted) {
        count++;
      }
    }
    return count;
  }, [itemsData]);

  // Count BOMs using a for loop
  const bomCount = useMemo(() => {
    if (!bomData) return 0;
    return bomData.length;
  }, [bomData]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Items Master":
        return <ItemsMaster />;
      case "Bill of Materials":
        return <BillsOfMaterials />;
      default:
        return <ItemsMaster />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full flex flex-col overflow-auto">
      <div className="container mx-auto px-4 py-8 md:flex-1 flex flex-col">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard 
            title="Item Master Entries"
            count={itemCount}
            icon={FiTrendingUp}
            isLoading={isItemsLoading}
            colorClass="text-blue-600"
            gradientClass="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/60"
          />
          
          <GlassCard 
            title="BoM Entries"
            count={bomCount}
            icon={FiCheckSquare}
            isLoading={isBomLoading}
            colorClass="text-green-600"
            gradientClass="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/60"
          />
          
          <GlassCard 
            title="Pending Entries"
            count={!isBomLoading && !isItemsLoading ? usePendingSetup(itemsData, bomData)?.length : 0}
            icon={FiAlertCircle}
            isLoading={isBomLoading || isItemsLoading}
            colorClass="text-yellow-600"
            gradientClass="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-900/60"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div 
            role="tablist" 
            className="inline-flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg"
          >
            <button
              className={`
                px-6 py-2 rounded-full transition-all duration-300 
                flex items-center gap-2 
                ${activeTab === "Items Master" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
              `}
              onClick={() => setActiveTab("Items Master")}
            >
              <FiBox /> Items Master
            </button>

            <button
              className={`
                px-6 py-2 rounded-full transition-all duration-300 
                flex items-center gap-2 
                ${activeTab === "Bill of Materials" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
              `}
              onClick={() => setActiveTab("Bill of Materials")}
            >
              <FiLayers /> BOM
            </button>
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Landing;