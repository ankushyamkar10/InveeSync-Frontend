import React from "react";

const Loading = ({title = "Loading..."}) => {
  return (
    <div className="flex justify-center items-center flex-col w-full mt-4 md:mt-12">
      <span className="loading loading-bars loading-lg text-gray-600"></span>
      <p className="ml-4 mt-4 text-sm text-gray-500">{title}</p>
    </div>
  );
};

export default Loading;
