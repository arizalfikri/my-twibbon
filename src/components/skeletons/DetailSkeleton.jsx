import React from "react";
import Skeleton from "../common/Skeleton";

const DetailSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Header Skeleton */}
      <header className="container px-3 py-3 m-5 mx-auto">
        <div className="grid grid-cols-1 items-center lg:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <Skeleton variant="text" height="1.5rem" width="60%" />
            <Skeleton variant="text" height="1rem" width="40%" />
          </div>
          <div className="flex justify-start items-center space-x-2 lg:justify-center">
            <Skeleton variant="circular" width="1.25rem" height="1.25rem" />
            <Skeleton variant="text" height="1rem" width="30%" />
          </div>
          <div className="hidden lg:flex justify-end">
            <Skeleton variant="rectangular" height="2.5rem" width="200px" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Editor Skeleton */}
        <div className="p-4 flex justify-center items-center bg-gray-50 dark:bg-gray-800/50 min-h-[400px]">
          <div className="w-full max-w-lg aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
            <Skeleton variant="rectangular" height="80%" />
            <div className="flex gap-4">
              <Skeleton variant="rectangular" height="3rem" width="100%" />
              <Skeleton variant="rectangular" height="3rem" width="3rem" />
            </div>
          </div>
        </div>

        {/* Right Column: Cards Grid Skeleton */}
        <div className="p-4 h-full bg-white dark:bg-gray-900">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
