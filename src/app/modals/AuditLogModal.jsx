import React, { useState } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const AuditLogModal = () => {
  // Sample data
  const sampleData = [
    {
      timestamp: "2024-11-16 10:30 AM",
      user: "John Smith",
      action: "Created",
      details: "Added new item: Steel Pipe Grade A",
    },
    {
      timestamp: "2024-11-16 10:15 AM",
      user: "Sarah Lee",
      action: "Deleted",
      details: "Removed BOM: Assembly X23",
    },
    {
      timestamp: "2024-11-16 09:45 AM",
      user: "Mike Johnson",
      action: "Updated",
      details: "Modified process: Heat Treatment",
    },
    {
      timestamp: "2024-11-16 09:30 AM",
      user: "Emma Davis",
      action: "Created",
      details: "Added new process step: Quality Check",
    },
    {
      timestamp: "2024-11-16 09:15 AM",
      user: "Alex Wilson",
      action: "Updated",
      details: "Modified item: Bolt Assembly B12",
    },
    {
      timestamp: "2024-11-16 09:00 AM",
      user: "Lisa Chen",
      action: "Deleted",
      details: "Removed process: Packaging Line 2",
    },
  ];

  const dateRangeOptions = [
    "Last 24 hours",
    "Last 7 days", 
    "Last 30 days",
    "All Time"
  ];

  const actionOptions = [
    "All Actions",
    "Created", 
    "Updated", 
    "Deleted"
  ];

  const [dateRange, setDateRange] = useState("Last 7 days");
  const [selectedAction, setSelectedAction] = useState("All Actions");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const itemsPerPage = 3;

  // Filter data based on search query and selected action
  const filteredData = sampleData.filter((item) => {
    const matchesSearch =
      item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction =
      selectedAction === "All Actions" || item.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActionBadgeColor = (action) => {
    switch (action) {
      case "Created":
        return "bg-green-200 text-green-900";
      case "Deleted":
        return "bg-red-200 text-red-900";
      case "Updated":
        return "bg-blue-200 text-blue-900";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  return (
    <dialog id="view_audit_log" className="modal">
      <div className="modal-box text-gray-900 bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-900 border border-gray-900 rounded-full">
            ✕
          </button>
        </form>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Audit Log</h2>
          </div>

          <div className="flex gap-4 mb-6">
            {/* Date Range Dropdown */}
            <div className="dropdown relative">
              <label
                tabIndex={0}
                className="btn btn-outline normal-case flex gap-2"
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              >
                {dateRange} <FaChevronDown size={16} />
              </label>
              {isDateDropdownOpen && (
                <ul className="dropdown-content menu p-2 shadow bg-white rounded-box w-52 absolute z-10 border">
                  {dateRangeOptions.map((range) => (
                    <li key={range}>
                      <a 
                        onClick={() => {
                          setDateRange(range);
                          setIsDateDropdownOpen(false);
                        }}
                      >
                        {range}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action Dropdown */}
            <div className="dropdown relative">
              <label
                tabIndex={0}
                className="btn btn-outline normal-case flex gap-2"
                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
              >
                {selectedAction} <FaChevronDown size={16} />
              </label>
              {isActionDropdownOpen && (
                <ul className="dropdown-content menu p-2 shadow bg-white rounded-box w-52 absolute z-10 border">
                  {actionOptions.map((action) => (
                    <li key={action}>
                      <a 
                        onClick={() => {
                          setSelectedAction(action);
                          setIsActionDropdownOpen(false);
                        }}
                      >
                        {action}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex-1">
              <div className="relative">
                <FaSearch
                  className="absolute left-3 top-3 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="input input-bordered w-full pl-10 text-gray-900 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-gray-700 font-semibold">TIMESTAMP</th>
                  <th className="text-gray-700 font-semibold">USER</th>
                  <th className="text-gray-700 font-semibold">ACTION</th>
                  <th className="text-gray-700 font-semibold">DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="text-gray-600">{item.timestamp}</td>
                    <td className="text-gray-900">{item.user}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getActionBadgeColor(
                          item.action
                        )}`}
                      >
                        {item.action}
                      </span>
                    </td>
                    <td className="text-gray-900">{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </span>
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${
                    currentPage === index + 1 ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="btn btn-sm btn-ghost"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <FaChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AuditLogModal;