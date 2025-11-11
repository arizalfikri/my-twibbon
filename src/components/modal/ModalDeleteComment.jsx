import React from "react";
import ModalAlert from "../../layout/ModalAlert";
import { useDELETE } from "../../services/api";
import ModalDeleteLayout from "../layout/ModalDeleteLayout";
import { useTranslation } from "react-i18next";
export default function ModalDeleteComment({
  commentId,
  id_user_twibbons,
  onClose,
  onDeleteSuccess,
}) {
  if (!commentId) return null;

  const {t} =useTranslation()
  const deleteMutation = useDELETE(
    `twibbon/user/${id_user_twibbons}/comments/${commentId}`
  );

  const handleDelete = async () => {
    if (!commentId || !id_user_twibbons) return;
    try {
      const response = await deleteMutation.mutateAsync(
        `twibbon/user/${id_user_twibbons}/comments/${commentId}`
      );

      if (response.status === 200) {
        if (onDeleteSuccess) onDeleteSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  return (
    <ModalAlert onClose={onClose}>
      <ModalDeleteLayout>
     
        <div className="flex flex-col md:flex-row justify-center gap-5 text-[16px] mb-5">
          <button
            onClick={onClose}
            className="bg-white border-2 border-[#E8121F] text-black px-10 md:px-20 lg:px-20 py-3 items-center rounded-lg mt-6 font-semibold disabled:opacity-50"
          >
            {t("modaldeletecomment.cancel")}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-[#E8121F] hover:bg-[#ff000d] px-10 md:px-20 lg:px-20 py-3 items-center rounded-lg -mt-2 md:mt-6 text-[#FFFFFF] font-semibold disabled:opacity-50"
          >
            {deleteMutation.isPending
              ? t("modaldeletecomment.deleting")
              : t("modaldeletecomment.delete")}
          </button>
        </div>
      </ModalDeleteLayout>
    </ModalAlert>
  );
}
