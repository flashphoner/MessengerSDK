// External deps
import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="p-0">
      <div className="flex gap-4">
        {/* Connection to Server Section */}
        <div className="w-full bg-white pt-3 pb-3 pr-2 pl-2 rounded-md shadow-md animate-pulse">
          <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
          <div className="flex w-full items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-full flex align-items-center justify-between">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="w-10 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        {/* Send Friend Request (second user) */}
        <div className="w-full bg-white p-2 rounded-md shadow-md animate-pulse">
          <div className="w-3/4 h-6 bg-gray-300 rounded mb-3"></div>
          <div className="w-full h-10 bg-gray-300 rounded mb-3"></div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">

        {/* Friends Section */}
        <div className="w-full bg-white p-2 rounded-md shadow-md animate-pulse">
          <div className="w-3/4 h-6 bg-gray-300 rounded mb-3"></div>
          <div className="w-full h-10 bg-gray-300 rounded mb-0"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
