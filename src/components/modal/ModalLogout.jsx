import React from "react";
import ModalAlert from "../../layout/ModalAlert";
import { LogOut, X, AlertTriangle } from "lucide-react";
import { useGlobalStore } from "../../helper/store/global.store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ModalLogout({ isOpen, onClose }) {
  const { setToken, setEmail, setFullName, setRole } = useGlobalStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");
    localStorage.removeItem("role");

    setToken(null);
    setEmail(null);
    setFullName(null);
    setRole(null);

    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <ModalAlert onClose={onClose}>
      <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white shadow-2xl dark:bg-gray-900 rounded-2xl">
        {/* Header */}
        <div className="relative px-8 py-6 text-center">
          <button
            onClick={onClose}
            className="absolute p-1 text-gray-500 transition-colors rounded-full top-4 right-4 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} className="dark:text-gray-300" />
          </button>

          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full dark:bg-red-900/40">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t("logout.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("logout.message")}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 font-semibold text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {t("logout.cancel")}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-semibold text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>
                {" "}
                <span>{t("logout.confirm")}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </ModalAlert>
  );
}

export default ModalLogout;
