import React from "react";

const Loading = ({title = "Loading..."}) => {
  return (
    <div className="flex justify-center items-center flex-col w-full mt-4">
      <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <p className="ml-4 mt-4 text-sm text-gray-500">{title}</p>
    </div>
  );
};

export default Loading;
