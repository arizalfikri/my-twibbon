import React from "react";
import { Camera, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const UploadModal = ({ isOpen, onClose, onFileSelect, onCameraSelect }) => {
  if (!isOpen) return null;
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center  bg-black/50 backdrop-blur-sm md:items-center md:justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* WRAPPER FULLSCREEN MOBILE */}
      <div
        className="
          w-full bg-white dark:bg-gray-900 
          p-6 shadow-xl

          fixed bottom-0 rounded-t-2xl 
          max-h-[90vh] overflow-y-auto

          md:static md:rounded-xl md:w-80 md:max-h-none
        "
      >
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-3 right-3 hover:text-gray-600 md:hidden"
          aria-label={t('uploadModal.close')}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg font-semibold dark:text-white">
            {t("uploadModal.title")}
          </h3>

          {/* Desktop Close Button */}
          <button
            onClick={onClose}
            className="hidden text-gray-400 hover:text-gray-600 md:block"
          >
            <X size={20} />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Camera */}
          <button
            onClick={onCameraSelect}
            className="flex items-center w-full gap-3 p-4 transition-colors rounded-lg  bg-blue-50 hover:bg-blue-100 dark:bg-gray-800"
          >
            <Camera size={24} className="text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-blue-800 dark:text-blue-400">
                {t("uploadModal.camera.title")}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-500">
                {t("uploadModal.camera.desc")}
              </div>
            </div>
          </button>

          {/* Upload File */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
          />

          <label
            htmlFor="fileInput"
            className="flex items-center w-full gap-3 p-4 transition-colors rounded-lg cursor-pointer  bg-primary-50 hover:bg-primary-100 dark:bg-gray-800"
          >
            <Upload size={24} className="text-primary-600" />
            <div className="text-left">
              <div className="font-medium text-primary-800 dark:text-primary-400">
                {t("uploadModal.upload.title")}
              </div>
              <div className="text-sm text-primary-600 dark:text-primary-500">
                {t("uploadModal.upload.desc")}
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
