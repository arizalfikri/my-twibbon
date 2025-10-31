import React from "react";
import { useTranslation } from "react-i18next";
import { useDELETE } from "../../services/api";
import ModalAlert from "../../layout/ModalAlert";
import ModalDeleteLayout from "../layout/ModalDeleteLayout";

function ModalDeleteCollection({
  visible,
  onClose,
  onDeleteSuccess,
  collectionId,
}) {
  if (!visible) return null;
  const { t } = useTranslation();

  const deleteMutation = useDELETE();

  const handleDelete = async () => {
    if (!collectionId) return;

    try {
      await deleteMutation.mutateAsync(`/bookmark/${collectionId}`);
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
            {t("modaldeletecollection.title")}
          </h3>
          <p className="mt-2 text-center text-gray-600 dark:text-white">
            {t("modaldeletecollection.message")}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-5 text-[16px] mb-5">
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="bg-white border-2 border-[#E8121F] text-black px-10 md:px-20 lg:px-20 py-3 items-center rounded-lg mt-6 font-semibold disabled:opacity-50"
          >
            {t("modaldeletecollection.cancel")}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending || !collectionId}
            className="bg-[#E8121F] hover:bg-[#ff000d] px-10 md:px-20 lg:px-20 py-3 items-center rounded-lg -mt-2 md:mt-6 text-[#FFFFFF] font-semibold disabled:opacity-50"
          >
            {deleteMutation.isPending
              ? t("modaldeletecollection.deleting")
              : t("modaldeletecollection.delete")}
          </button>
        </div>
      </ModalDeleteLayout>
    </ModalAlert>
  );
}

export default ModalDeleteCollection;
