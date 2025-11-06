import React from "react";
import { useTranslation } from "react-i18next";
import ModalAlert from "../../layout/ModalAlert";
import { useModalStore } from "../../helper/store/modal.store";
import { useNavigate } from "react-router-dom";
import useImageStore from "../../helper/store/imagestore";

export default function ModalKeluarEditor() {
  const { t } = useTranslation();
  const { modalLogout, openModal } = useModalStore();
  const { setImage } = useImageStore();
  const navigate = useNavigate();

  const handleExit = () => {
    openModal("modalLogout", false);
    setImage(null);
    navigate("/");
  };

  const handleCancel = () => {
    openModal("modalLogout", false);
  };

  if (!modalLogout) return null;

  return (
    <ModalAlert onClose={() => openModal("modalLogout", false)}>
      <div className="max-w-md p-8 mx-auto rounded-lg bg-primary-500">
        {/* Header dengan judul dan tombol close */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={() => openModal("modalLogout", false)}
            className="text-white transition-colors hover:text-gray-300 "
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

        {/* Icon Warning */}
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
              d="M32 16C31.2636 16 30.5454 16.1829 29.9272 16.5257C29.3141 16.8656 28.8218 17.3526 28.5051 17.9327L19.4032 34.9981C19.3715 35.0524 19.3437 35.1086 19.3201 35.1664C19.0779 35.7679 18.9837 36.4175 19.0446 37.0625C19.1055 37.7075 19.3196 38.3307 19.6709 38.8762C20.0222 39.4218 20.4998 39.8739 21.0639 40.1957C21.6279 40.5176 22.2615 40.6999 22.9129 40.7271C22.9607 40.7295 23.0078 40.7295 23.0544 40.7268C23.0794 40.7279 23.1045 40.7284 23.1297 40.7284H40.8703C40.8955 40.7284 40.9206 40.7279 40.9456 40.7268C41.5098 40.7226 42.0647 40.5618 42.5521 40.2598C43.0395 39.9577 43.4437 39.5254 43.7253 39.0078C44.0069 38.4902 44.1567 37.9063 44.1601 37.3119C44.1635 36.7175 44.0204 36.1318 43.7446 35.6112C43.7209 35.5529 43.6928 35.4962 43.6603 35.4414L34.4949 17.9327C34.1782 17.3526 33.6859 16.8656 33.0728 16.5257C32.4546 16.1829 31.7364 16 32 16ZM23 38C22.9739 38 22.9478 38.0007 22.9219 38.0021L22.9173 38.0019C22.6891 37.9911 22.4677 37.9249 22.2721 37.8092C22.0765 37.6935 21.9125 37.5318 21.7935 37.3375C21.6744 37.1431 21.6039 36.9219 21.588 36.6931C21.5745 36.4959 21.5976 36.2976 21.6562 36.1094L30.7581 19.044L30.7713 19.0197C30.8881 18.8098 31.0622 18.6347 31.2751 18.5141C31.4879 18.3934 31.7309 18.3309 31.9783 18.3309C32.2258 18.3309 32.4688 18.3934 32.6816 18.5141C32.8945 18.6347 33.0686 18.8098 33.1854 19.0197L33.1986 19.044L42.3005 36.1086C42.3609 36.3005 42.3828 36.5028 42.3646 36.7036C42.3447 36.9264 42.2743 37.1414 42.1594 37.3314C42.0445 37.5213 41.8887 37.6808 41.7046 37.7973C41.5213 37.9133 41.314 37.9835 41.1009 38H23ZM33.5 24C33.5 23.1716 32.8284 22.5 32 22.5C31.1716 22.5 30.5 23.1716 30.5 24V27.5C30.5 28.3284 31.1716 29 32 29C32.8284 29 33.5 28.3284 33.5 27.5V24ZM33.5 33C33.5 32.1716 32.8284 31.5 32 31.5C31.1716 31.5 30.5 32.1716 30.5 33V33.014C30.5 33.8424 31.1716 34.514 32 34.514C32.8284 34.514 33.5 33.8424 33.5 33.014V33Z"
              fill="#E81212"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="mb-8 text-center text-white">
          <h3 className="mb-3 text-xl font-medium">{t('modaleditor.confirm_exit')}</h3>
          <p className="text-sm leading-relaxed text-white">
            {t('modaleditor.exit_warning')}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="bg-[#E8121F] hover:bg-[#d43c46] text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            onClick={handleExit}
          >
            {t('modaleditor.yes_exit')}
          </button>
          <button
            className="px-6 py-3 text-sm font-medium text-white transition-colors duration-200 bg-transparent border rounded-lg border-white/30 hover:bg-white/10"
            onClick={handleCancel}
          >
            {t('modaleditor.cancel_continue')}
          </button>
        </div>
      </div>
    </ModalAlert>
  );
}