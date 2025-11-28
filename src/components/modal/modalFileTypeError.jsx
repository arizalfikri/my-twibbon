import React from "react";
import { useTranslation } from "react-i18next";
import ModalAlert from "../../layout/ModalAlert";
import { useModalStore } from "../../helper/store/modal.store";

export default function ModalFileTypeError() {
  const { t } = useTranslation();
  const { modalFileError, openModal } = useModalStore();

  const handleClose = () => {
    openModal("modalFileError", false);
  };

  if (!modalFileError) return null;

  return (
    <ModalAlert onClose={handleClose}>
      <div className="w-full max-w-md p-6 rounded-lg sm:p-8 sm:mx-auto bg-primary-600">
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

        {/* Icon Error - Transparency Theme */}
        <div className="flex justify-center mb-4">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="64" height="64" rx="32" fill="#FFD7B5" />
            {/* Background pattern to show transparency */}
            <defs>
              <pattern
                id="checkerboard"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
              >
                <rect width="2" height="2" fill="#FFD7B5" />
                <rect x="2" y="2" width="2" height="2" fill="#FFD7B5" />
                <rect x="2" y="0" width="2" height="2" fill="#FFD7B5" />
                <rect x="0" y="2" width="2" height="2" fill="#FFD7B5" />
              </pattern>
            </defs>

            {/* Image frame */}
            <rect
              x="20"
              y="22"
              width="24"
              height="18"
              rx="2"
              fill="url(#checkerboard)"
              stroke="#E81212"
              strokeWidth="2"
            />

            {/* Error X mark */}
            <circle cx="32" cy="31" r="8" fill="#E81212" />
            <path
              d="M28 27L36 35M36 27L28 35"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="mb-8 text-center text-white">
          <h3 className="mb-3 text-xl font-medium">
            {t("modalerror.transparent_image_required")}
          </h3>
          <p className="text-sm leading-relaxed text-primary-100">
            {t("modalerror.transparent_image_message")}{" "}
            <span className="font-semibold">
              {t("modalerror.png_transparent_format")}
            </span>{" "}
            {t("modalerror.or_edit_background")}
          </p>
        </div>

        {/* Transparency requirements info */}
        <div className="p-4 mb-6 rounded-lg bg-white/10">
          <div className="text-sm text-white">
            <div className="mb-2 font-medium">
              {t("modalerror.image_requirements")}:
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>
                  {t("modalerror.png_transparent_format_requirement")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{t("modalerror.no_solid_background")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{t("modalerror.max_file_size")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Help text */}
        <div className="p-3 mb-6 rounded-lg bg-blue-500/20">
          <div className="text-xs text-orange-200">
            <span className="font-medium">💡 {t("modalerror.tips")}:</span>{" "}
            {t("modalerror.tools_suggestion")}
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            className="bg-[#E8121F] hover:bg-[#d43c46] text-white text-sm font-medium px-8 py-3 rounded-lg transition-colors duration-200 w-full"
            onClick={handleClose}
          >
            {t("modalerror.choose_transparent_image")}
          </button>
        </div>
      </div>
    </ModalAlert>
  );
}
