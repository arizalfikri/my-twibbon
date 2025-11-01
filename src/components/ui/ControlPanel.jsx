// components/ui/ControlPanel.jsx
import React from "react";
import UploadButton from "../buttons/UploudButton";
import DownloadButton from "../buttons/DownloadButton";

const ControlPanel = ({ onDownload, hasImage = false }) => {
  if (!hasImage) {
    return (
      <div className="flex justify-center p-6">
        <UploadButton />
      </div>
    );
  }

  return (
    <>
      {/* 🔹 Mobile Controls (tetap fixed di bawah) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg md:hidden dark:border-gray-700 dark:bg-gray-900">
        <div className="flex justify-center gap-4 mx-auto">
          <UploadButton variant="icon" />
          <DownloadButton onClick={onDownload}   fullWidth={true}/>
        </div>  
      </div>

      {/* 🔹 Desktop Controls (rapi & proporsional) */}
      <div className="justify-center hidden gap-6 mt-6 md:flex md:mt-8">
        <UploadButton variant="icon" />
        <DownloadButton onClick={onDownload} />
      </div>
    </>
  );
};

export default ControlPanel;
