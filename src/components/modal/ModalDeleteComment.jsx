import React from "react";
import ModalAlert from "../../layout/ModalAlert";
import { useDELETE } from "../../services/api";
import ModalDeleteLayout from "../layout/ModalDeleteLayout";
export default function ModalDeleteComment({
  commentId,
  id_user_twibbons,
  onClose,
  onDeleteSuccess,
}) {
  if (!commentId) return null;

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
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-center">Hapus Komentar</h3>
          <p className="mt-2 text-center text-gray-600">
            Apakah Anda yakin ingin menghapus komentar ini?
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-5 text-[16px]">
          <button
            onClick={onClose}
            className="bg-white border-2 border-[#E8121F] text-black px-10 md:px-20 lg:px-20 py-3 items-center rounded-lg mt-6 font-semibold disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-[#E8121F] hover:bg-[#ff000d] px-10 md:px-20 lg:px-20 py-3 items-center rounded-lg -mt-2 md:mt-6 text-[#FFFFFF] font-semibold disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </ModalDeleteLayout>
    </ModalAlert>
  );
}
