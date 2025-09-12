import React from "react";
import ModalAlert from "../../layout/ModalAlert";
import { useDELETE } from "../../services/api";
import ModalDeleteLayout from "../layout/ModalDeleteLayout";
import { useTranslation } from "react-i18next";

export default function ModalDeleteTwibone({
  visibel,
  onClose,
  onDeleteSuccess,
  itemId,
}) {
  if (!visibel) return null;
  const { t } = useTranslation();

  const deleteMutation = useDELETE(`/event-twibbon/${itemId}`);

  const handleDelete = async () => {
    if (!itemId) return;

    try {
      await deleteMutation.mutateAsync(`/event-twibbon/${itemId.id}`);

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
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-center dark:text-white">
            {t("modaldeletetwibbone.title")}{" "}
          </h3>
          <p className="mt-2 text-center text-gray-600 dark:text-white ">
            {t("modaldeletetwibbone.message")}{" "}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-5 text-[16px] mb-5">
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="bg-white border-2 border-[#E8121F] text-black px-10 md:px-20 lg:px-20 py-3 items-center rounded-lg mt-6 font-semibold disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending || !itemId}
            className="bg-[#E8121F] hover:bg-[#ff000d] px-10 md:px-20 lg:px-20 py-3 items-center rounded-lg -mt-2 md:mt-6 text-[#FFFFFF] font-semibold disabled:opacity-50 "
          >
            {deleteMutation.isPending
              ? t("modaldeletetwibbone.deleting")
              : t("modaldeletetwibbone.delete")}
          </button>
        </div>
      </ModalDeleteLayout>
    </ModalAlert>
  );
}
