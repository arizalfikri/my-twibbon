// components/buttons/DownloadButton.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import useUIStore from '../../helper/store/uiStore';

const DownloadButton = ({ 
  onClick,
  className = '',
  disabled = false,
  children,
  fullWidth = false
}) => {
  const { isDownloading } = useUIStore();
  
  const baseClasses = "px-6 py-3 font-medium text-white transition-colors rounded-lg flex items-center justify-center gap-2";
  
  const isDisabled = disabled || isDownloading;
  
  const widthClass = fullWidth ? 'w-full col-span-3' : '';
  
  const finalClasses = `${baseClasses} ${widthClass} ${className} ${
    isDisabled 
      ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' 
      : 'bg-purple-600 hover:bg-purple-700'
  }`;
  
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={finalClasses}
    >
      {isDownloading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Processing...
        </>
      ) : (
        children || 'Download'
      )}
    </button>
  );
};

export default DownloadButton;