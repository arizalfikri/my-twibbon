import React, { useState, useEffect } from "react";
import { X, Image, Link, Type, FileText } from "lucide-react";
import ModalAlert from "../../layout/ModalAlert";
import { useForm } from "react-hook-form";
import { useGET, usePATCH } from "../../services/api";
import { useModalStore } from "../../helper/store/modal.store";
import { useQueryClient } from "@tanstack/react-query";
import { editTwiboneSchema } from "../../helper/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDebounce } from "use-debounce";

function ModalEditTwibonne({ visibel, onClose, onEditSuccess, itemData }) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePATCH(`/event-twibbon/${itemData?.id}`);
  const { openToast } = useModalStore();
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const { data: twibbonsData } = useGET("/twibbons");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    defaultValues: {
      title: "",
      caption: "",
      link: "",
    },
    resolver: yupResolver(editTwiboneSchema),
  });

  useEffect(() => {
    if (itemData) {
      setValue("title", itemData.title || "");
      setValue("caption", itemData.caption || "");
      setValue("link", itemData.slug || "");
    }
  }, [itemData, setValue]);

  const watchTitle = watch("title");
  const watchLink = watch("link");
  const [debouncedTitle] = useDebounce(watchTitle, 600);
  const [debouncedLink] = useDebounce(watchLink, 600);

  useEffect(() => {
    if (!twibbonsData?.data) return;
    if (watchTitle !== debouncedTitle || watchLink !== debouncedLink) {
      setIsCheckingDuplicates(true);
    } else {
      setIsCheckingDuplicates(false);
    }

    if (debouncedTitle) {
      const isDuplicateTitle = twibbonsData.data.some(
        (item) =>
          item.title.toLowerCase() === debouncedTitle.toLowerCase() &&
          item.id !== itemData?.id
      );
      if (isDuplicateTitle) {
        setError("title", {
          type: "manual",
          message: "Judul sudah digunakan oleh kampanye lain",
        });
      } else {
        clearErrors("title");
      }
    }
    if (debouncedLink) {
      const isDuplicateSlug = twibbonsData.data.some(
        (item) =>
          item.slug_event_twibbon.toLowerCase() ===
            debouncedLink.toLowerCase() && item.id !== itemData?.id
      );
      if (isDuplicateSlug) {
        setError("link", {
          type: "manual",
          message: "Link kampanye sudah digunakan",
        });
      } else {
        clearErrors("link");
      }
    }
  }, [
    debouncedTitle,
    debouncedLink,
    watchTitle,
    watchLink,
    twibbonsData,
    itemData,
    setError,
    clearErrors,
  ]);

  const handleSubmitWithValidation = async () => {
    if (isCheckingDuplicates) {
      openToast(
        "toast",
        true,
        "Tunggu sebentar, sedang memeriksa data...",
        "warning"
      );
      return;
    }

    const isValid = await trigger();
    if (!isValid || errors.title || errors.link) {
      openToast("toast", true, "Perbaiki error sebelum menyimpan", "warning");
      return;
    }

    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data) => {
    try {
      const response = await mutateAsync({
        url: `/event-twibbon/${itemData?.id}`,
        data: data,
      });

      if (response.status === 200 || response.status === 201) {
        queryClient.setQueryData(["twibbons"], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data:
              oldData.data?.map((item) =>
                item.id === itemData?.id ? { ...item, ...response.data } : item
              ) || [],
          };
        });

        openToast("toast", true, "Twibbon berhasil diperbarui!", "success");

        if (onEditSuccess) {
          onEditSuccess();
        }
        onClose();
      }
    } catch (error) {
      switch (error?.response?.status) {
        case 400:
          openToast(
            "toast",
            true,
            error?.response?.data?.message || "Data tidak valid"
          );
          break;
        case 401:
          openToast(
            "toast",
            true,
            "Anda tidak memiliki akses untuk mengedit twibbon ini",
            "info"
          );
          break;
        case 403:
          openToast("toast", true, "Akses ditolak", "warning");
          break;
        case 404:
          openToast("toast", true, "Twibbon tidak ditemukan");
          break;
        case 409:
          openToast("toast", true, "Link sudah digunakan ");
          break;
        default:
          openToast("toast", true, "Kesalahan Server");
          break;
      }
    }
  };

  const handleCancel = () => {
    if (itemData) {
      setValue("title", itemData.title || "");
      setValue("caption", itemData.caption || "");
      setValue("link", itemData.slug || "");
    }
    onClose();
  };

  if (!visibel) return null;

  const isSubmitDisabled =
    isPending || isCheckingDuplicates || errors.title || errors.link;

  return (
    <ModalAlert onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="w-full max-w-2xl max-h-[95vh] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 dark:bg-gray-700 rounded-xl">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Edit Twibbon
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    Update informasi twibbon Anda
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 transition-colors rounded-lg hover:text-gray-700 hover:bg-white/60 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Image Section */}
              <div className="flex flex-col items-center space-y-3">
                <h3 className="self-start text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Preview Gambar
                </h3>
                <div className="w-full max-w-sm">
                  <div className="w-full overflow-hidden border-2 border-gray-200 border-dashed dark:border-gray-700 aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    {itemData?.image ? (
                      <img
                        src={`https://api-twibbon-dev.digiduindo.com${itemData.image}`}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        <div className="space-y-3 text-center">
                          <Image className="w-12 h-12 mx-auto opacity-60" />
                          <p className="text-sm font-medium">Tidak ada gambar</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Judul Kampanye<span className="text-red-500">*</span>
                    {isCheckingDuplicates && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (Memeriksa...)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register("title")}
                    className={`w-full px-4 py-3 text-sm border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                      errors.title
                        ? "border-red-300 bg-red-50 dark:bg-red-900/30"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    placeholder="Masukkan judul kampanye..."
                  />
                  {errors.title && (
                    <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Caption */}
                <div className="space-y-2">
                  <label
                    htmlFor="caption"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Caption
                  </label>
                  <textarea
                    id="caption"
                    {...register("caption")}
                    rows={4}
                    className="w-full px-4 py-3 text-sm text-gray-900 transition-all duration-200 bg-white border border-gray-300 resize-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    placeholder="Tulis caption untuk twibbon ini..."
                  />
                  <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Caption akan ditampilkan sebagai deskripsi twibbon
                  </p>
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <label
                    htmlFor="link"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <Link className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Link Kampanye<span className="text-red-500">*</span>
                    {isCheckingDuplicates && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (Memeriksa...)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        twibbo.nz/
                      </span>
                    </div>
                    <input
                      type="text"
                      id="link"
                      {...register("link")}
                      className={`w-full px-4 py-3 pl-[90px] pr-12 text-sm border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                        errors.link
                          ? "border-red-300 bg-red-50 dark:bg-red-900/30"
                          : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                      placeholder="link-kampanye"
                    />
                    <Link className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none dark:text-gray-500 top-1/2 right-4" />
                  </div>
                  {errors.link && (
                    <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.link.message}
                    </p>
                  )}
                  <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Link yang akan digunakan untuk mengakses twibbon
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmitWithValidation}
                disabled={isSubmitDisabled}
                className={`flex-1 px-6 py-3 font-semibold text-white text-sm rounded-xl transition-all duration-200 shadow-lg ${
                  isSubmitDisabled
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isPending ? "Menyimpan..." : isCheckingDuplicates ? "Memeriksa..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalAlert>
  );
}

export default ModalEditTwibonne;
