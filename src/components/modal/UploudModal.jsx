import React from "react";
import { Camera, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const UploadModal = ({ isOpen, onClose, onFileSelect, onCameraSelect }) => {
  if (!isOpen) return null;
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="p-6 mx-4 bg-white rounded-lg w-80 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold dark:text-white">
            {t("uploadModal.title")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label={t("uploadModal.close")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Camera */}
          <button
            onClick={onCameraSelect}
            className="flex items-center w-full gap-3 p-4 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-gray-800"
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
            className="flex items-center w-full gap-3 p-4 transition-colors rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 dark:bg-gray-800"
          >
            <Upload size={24} className="text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-purple-800 dark:text-purple-400">
                {t("uploadModal.upload.title")}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-500">
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
