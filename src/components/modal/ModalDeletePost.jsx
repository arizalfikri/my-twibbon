import React from "react";
import { useTranslation } from "react-i18next";
import { useDELETE } from "../../services/api";
import ModalAlert from "../../layout/ModalAlert";
import ModalDeleteLayout from "../layout/ModalDeleteLayout";

function ModalDeletePost({ visible, onClose, onDeleteSuccess, postId }) {
  if (!visible) return null;
  const { t } = useTranslation();

  const deleteMutation = useDELETE();

  const handleDelete = async () => {
    if (!postId) return;

    try {
      await deleteMutation.mutateAsync(`/event-user-twibbon/${postId}`);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <ModalAlert onClose={onClose}>
      <ModalDeleteLayout>
        <div className="grid grid-cols-1 gap-4 px-8 py-6 bg-gray-50 dark:bg-gray-800/50 md:grid-cols-2">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="w-full px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 disabled:opacity-50"
          >
            {t("logout.cancel")}
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending || !postId}
            className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-red-600 shadow-md rounded-xl hover:bg-red-700 hover:shadow-red-500/30 disabled:opacity-50"
          >
            <span>
              {deleteMutation.isPending
                ? t("modaldeletetwibbone.deleting")
                : t("modaldeletetwibbone.delete")}
            </span>
          </button>
        </div>
      </ModalDeleteLayout>
    </ModalAlert>
  );
}

export default ModalDeletePost;
