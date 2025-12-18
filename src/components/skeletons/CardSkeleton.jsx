import React from "react";
import Skeleton from "../common/Skeleton";

const CardSkeleton = () => {
  return (
    <div className="overflow-hidden bg-white rounded-xl border-2 border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="aspect-square">
        <Skeleton />
      </div>
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton variant="text" height="1.25rem" width="90%" />
        <Skeleton variant="text" height="1.25rem" width="60%" />

        <div className="flex justify-between items-center mt-2">
          {/* Author */}
          <Skeleton variant="text" height="0.875rem" width="40%" />
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
          {/* Date/Supporters */}
          <Skeleton variant="text" height="0.875rem" width="50%" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
