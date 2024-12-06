'use client';
import PendingSetup from "./components/PendingJobs";
import Landing from "./components/Landing";
import { FiSettings, FiTool } from "react-icons/fi";
import { useState } from "react";

export default function Home() {
  const [showPending, setShowPending] = useState(false);
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md h-[60px] border-b border-gray-200 dark:border-gray-700 w-full sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 w-full justify-center">
            <FiSettings className="text-blue-600 w-6 h-6" />
            <span className="tracking-tight">Masterlist Management</span>
          </h1>
          <FiTool
            className="md:hidden text-primary w-6 h-6 animate-pulse cursor-pointer"
            onClick={() => setShowPending(!showPending)}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] bg-gradient-to-br from-gray-900 to-gray-800 relative">
        {/* Mobile Drawer Animation */}
        <div
          className={`absolute md:static top-0 left-0 w-full md:w-[300px] z-40 
            bg-white border-b border-gray-200 
            md:block 
            transition-transform duration-300  ease-linear
            ${showPending 
              ? 'translate-y-0 md:translate-y-0' 
              : '-translate-y-[20em] md:translate-y-0'
            }`}
        >
          <PendingSetup />
        </div>
        
        {/* Content Section */}
        <div
          className={`relative flex-1 w-full h-full md:overflow-auto bg-white 
            transition-margin duration-300  ease-linear
            ${showPending 
              ? 'mt-[260px] md:mt-0' 
              : ''
            }`}
        >
          <Landing />
        </div>
      </div>
    </div>
  );
}