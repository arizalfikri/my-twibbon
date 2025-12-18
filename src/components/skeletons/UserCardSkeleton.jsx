import React from "react";
import Skeleton from "../common/Skeleton";

const UserCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <Skeleton
        variant="circular"
        width="3rem"
        height="3rem"
        className="flex-shrink-0"
      />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton variant="text" height="1.25rem" width="70%" />
        <Skeleton variant="text" height="0.875rem" width="40%" />
      </div>
    </div>
  );
};

export default UserCardSkeleton;
