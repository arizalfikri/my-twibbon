import React from "react";
import ModalAlert from "../../layout/ModalAlert";
import { LogOut, AlertTriangle } from "lucide-react";
import { useGlobalStore } from "../../helper/store/global.store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

function ModalLogout({ isOpen, onClose }) {
  const queryClient = useQueryClient();
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

    queryClient.removeQueries();

    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <ModalAlert onClose={onClose}>
      <div className="max-w-lg mx-auto overflow-hidden bg-white border border-gray-200 shadow-2xl dark:bg-gray-900 rounded-3xl dark:border-gray-700">
        {/* Header Section */}
        <div className="relative px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            {/* Icon Warning */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center border border-red-200 w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl dark:border-red-500/20">
                <AlertTriangle className="text-red-500 w-7 h-7" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex-1 text-left">
              <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                {t("logout.title")}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {t("logout.message")}
              </p>
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div className="grid grid-cols-1 gap-4 px-8 py-6 bg-gray-50 dark:bg-gray-800/50 md:grid-cols-2">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600"
          >
            {t("logout.cancel")}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-red-600 shadow-md rounded-xl hover:bg-red-700 hover:shadow-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            <span>{t("logout.confirm")}</span>
          </button>
        </div>
      </div>
    </ModalAlert>
  );
}

export default ModalLogout;