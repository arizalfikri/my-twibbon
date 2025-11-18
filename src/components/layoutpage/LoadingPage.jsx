import React from "react";
import { SyncLoader } from "react-spinners";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <SyncLoader color="#FF6700" margin={3} size={15} />
    </div>
  );
};

export default LoadingPage;
