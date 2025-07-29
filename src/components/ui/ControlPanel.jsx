// components/ui/ControlPanel.jsx
import React from 'react';
import UploadButton from '../buttons/UploudButton';
import DownloadButton from '../buttons/DownloadButton';

const ControlPanel = ({ onDownload, hasImage = false }) => {
  if (!hasImage) {
    return (
      <div className="flex justify-center p-4">
        <UploadButton />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="grid w-full max-w-sm grid-cols-4 gap-3 mx-auto">
          <UploadButton variant="icon" />
          <DownloadButton 
            onClick={onDownload}
            fullWidth={true}
          />
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="justify-center hidden gap-3 pt-4 md:flex">
        <UploadButton variant="icon" />
        <DownloadButton onClick={onDownload} />
      </div>
    </>
  );
};

export default ControlPanel;