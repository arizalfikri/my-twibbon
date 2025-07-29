// components/buttons/UploadButton.jsx
import React from 'react';
import { Camera } from 'lucide-react';
import useUIStore from '../../helper/store/uiStore';

const UploadButton = ({ 
  variant = 'primary', // 'primary' | 'icon'
  className = '',
  disabled = false,
  children
}) => {
  const { openUploadModal, isDownloading } = useUIStore ();
  
  const baseClasses = "flex items-center justify-center font-medium transition-colors rounded-lg";
  
  const variants = {
    primary: `px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 gap-2 ${className}`,
    icon: `px-4 py-3 text-gray-700 bg-yellow-400 hover:bg-yellow-600 ${className}`,
  };
  
  const disabledClasses = "bg-gray-400 cursor-not-allowed hover:bg-gray-400";
  
  const isDisabled = disabled || isDownloading;
  
  const finalClasses = `${baseClasses} ${variants[variant]} ${
    isDisabled ? disabledClasses : ''
  }`;
  
  return (
    <button
      onClick={openUploadModal}
      disabled={isDisabled}
      className={finalClasses}
    >
      {variant === 'icon' ? (
        <Camera size={20} />
      ) : (
        <>
          <Camera size={20} />
          {children || 'Upload Gambar'}
        </>
      )}
    </button>
  );
};

export default UploadButton;