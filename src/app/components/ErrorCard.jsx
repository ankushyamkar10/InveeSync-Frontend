import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorCard = ({ error }) => {
  // Ensure error is an object or has a meaningful message
  const errorMessage = 
    typeof error === 'string' 
      ? error 
      : error?.message 
      || error?.error 
      || 'An unexpected error occurred';

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-4 shadow-sm">
      <div>
        <FiAlertCircle className="text-red-600 w-8 h-8 animate-pulse" />
      </div>
      <div className="flex-1">
        <h3 className="text-red-900 font-bold text-lg mb-1">
          Something Went Wrong
        </h3>
        <p className="text-red-700 text-sm break-words">
          {errorMessage}
        </p>
      </div>
    </div>
  );
};

export default ErrorCard;