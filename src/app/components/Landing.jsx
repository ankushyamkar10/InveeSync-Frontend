"use client";

import React, { useState } from "react";
import ItemsMaster from "./LandingComponents/ItemsMaster";
import Processes from "./LandingComponents/Processes";
import BillsOfMaterials from "./LandingComponents/BillsOfMaterials";
import ProcessSteps from "./LandingComponents/ProcessSteps";
import {
  FiBox,
  FiSettings,
  FiLayers,
  FiList,
  FiTrendingUp,
  FiCheckSquare,
  FiAlertCircle,
} from "react-icons/fi";

const Landing = ({ activeItem: activeTab, setActiveItem: setActiveTab }) => {

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Items Master":
        return <ItemsMaster />;
      case "Processes":
        return <Processes />;
      case "Bill of Materials":
        return <BillsOfMaterials />;
      case "Process Steps":
        return <ProcessSteps />;
      default:
        return <ItemsMaster />;
    }
  };

  return (
    <div className="md:min-h-screen bg-gray-50 flex flex-col flex-1 overflow-auto">

      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 pt-4 pb-5">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiSettings className="text-primary" />
            Data Onboarding
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:flex-1 flex flex-col">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="stats bg-white shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FiTrendingUp size={24} />
              </div>
              <div className="stat-title text-gray-900">Active Processes</div>
              <div className="stat-value text-primary">12</div>
              <div className="stat-desc text-gray-900">
                ↗︎ 2 Processes added this week
              </div>
            </div>
          </div>

          <div className="stats bg-white shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <FiCheckSquare size={24} />
              </div>
              <div className="stat-title text-gray-900">Completed BOMs</div>
              <div className="stat-value text-success">28</div>
              <div className="stat-desc text-gray-900">80% completion rate</div>
            </div>
          </div>

          <div className="stats bg-white shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <FiAlertCircle size={24} />
              </div>
              <div className="stat-title text-gray-900">Pending BOMs</div>
              <div className="stat-value text-warning">7</div>
              <div className="stat-desc text-gray-900">Requires attention</div>
            </div>
          </div>
        </div>


        <div className="tabs tabs-boxed bg-white p-1 rounded-lg mb-6 h-20 md:h-auto md:py-1.5">
          <button
            className={`tab gap-2 flex-1 h-20 md:h-auto md:py-1.5 ${
              activeTab === "Items Master"
                ? "bg-primary text-white"
                : "text-gray-900"
            }`}
            onClick={() => setActiveTab("Items Master")}
          >
            <FiBox /> Items Master
          </button>
          <button
            className={`tab gap-2 flex-1 h-20 md:h-auto md:py-1.5 ${
              activeTab === "Processes"
                ? "bg-primary text-white"
                : "text-gray-900"
            }`}
            onClick={() => setActiveTab("Processes")}
          >
            <FiSettings /> Processes
          </button>
          <button
            className={`tab gap-2 flex-1 h-20 md:h-auto md:py-1.5 ${
              activeTab === "Bill of Materials" ? "bg-primary text-white" : "text-gray-900"
            }`}
            onClick={() => setActiveTab("Bill of Materials")}
          >
            <FiLayers /> BOM
          </button>
          <button
            className={`tab gap-2 flex-1 h-20 md:h-auto md:py-1.5 ${
              activeTab === "Process Steps" ? "bg-primary text-white" : "text-gray-900"
            }`}
            onClick={() => setActiveTab("Process Steps")}
          >
            <FiList /> Steps
          </button>
        </div>


        <div className="bg-white rounded-lg shadow-sm md:p-6 h-96 overflow-auto">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Landing;
