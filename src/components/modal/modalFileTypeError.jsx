import React from "react";
import ModalAlert from "../../layout/ModalAlert";
import { useModalStore } from "../../helper/store/modal.store";

export default function ModalFileTypeError() {
  const { modalFileError, openModal } = useModalStore();

  const handleClose = () => {
    openModal("modalFileError", false);
  };

  if (!modalFileError) return null;

  return (
    <ModalAlert onClose={handleClose}>
      <div className="bg-[#4C0D68] rounded-lg p-8 max-w-md mx-auto">
        {/* Header dengan tombol close */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={handleClose}
            className="text-white transition-colors hover:text-gray-300"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Icon Error */}
        <div className="flex justify-center mb-4">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="64" height="64" rx="32" fill="#FFD8E4" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M32 16C24.268 16 18 22.268 18 30C18 37.732 24.268 44 32 44C39.732 44 46 37.732 46 30C46 22.268 39.732 16 32 16ZM28.5 23.5C28.5 22.6716 29.1716 22 30 22H34C34.8284 22 35.5 22.6716 35.5 23.5V32.5C35.5 33.3284 34.8284 34 34 34H30C29.1716 34 28.5 33.3284 28.5 32.5V23.5ZM30 36.5C29.1716 36.5 28.5 37.1716 28.5 38C28.5 38.8284 29.1716 39.5 30 39.5H34C34.8284 39.5 35.5 38.8284 35.5 38C35.5 37.1716 34.8284 36.5 34 36.5H30Z"
              fill="#E81212"
            />
            <path
              d="M30 24H34V32H30V24Z"
              fill="white"
            />
            <rect
              x="30"
              y="36"
              width="4"
              height="2"
              fill="white"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="mb-8 text-center text-white">
          <h3 className="mb-3 text-xl font-medium">Format File Tidak Valid</h3>
          <p className="text-sm leading-relaxed text-purple-200">
            File yang Anda pilih tidak didukung. Harap pilih file dengan format 
            <span className="font-semibold"> JPG, JPEG, atau PNG</span> dengan ukuran maksimal 10MB.
          </p>
        </div>

        {/* Supported formats info */}
        <div className="p-4 mb-6 rounded-lg bg-white/10">
          <div className="text-sm text-white">
            <div className="mb-2 font-medium">Format yang didukung:</div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>JPG/JPEG</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>PNG</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            className="bg-[#E8121F] hover:bg-[#d43c46] text-white text-sm font-medium px-8 py-3 rounded-lg transition-colors duration-200 w-full"
            onClick={handleClose}
          >
            Pilih File Lain
          </button>
        </div>
      </div>
    </ModalAlert>
  );
}