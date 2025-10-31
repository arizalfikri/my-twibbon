import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Image as ImageIcon, // ✅ Rename icon
  Camera,
} from "lucide-react";
import { useModalStore } from "../../helper/store/modal.store";
import { useTranslation } from "react-i18next";

function ImageUploadArea({ name = "image", setValue, error, value }) {
  const { t } = useTranslation();

  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { openModal } = useModalStore();

  const allowedTypes = ["image/png"];

  // ✅ Restore preview image when component mounts with existing value
  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(value);
    } else if (value && typeof value === "string") {
      // Handle jika value berupa URL string
      setUploadedImage(value);
    } else if (!value) {
      // Clear preview jika tidak ada value
      setUploadedImage(null);
    }
  }, [value]);

  const handleFile = (file) => {
    if (file && allowedTypes.includes(file.type)) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;

        img.onload = () => {
          // Buat canvas untuk membaca pixel
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

          let hasTransparency = false;
          for (let i = 3; i < imageData.length; i += 4) {
            if (imageData[i] < 255) {
              hasTransparency = true;
              break;
            }
          }

          if (hasTransparency) {
            setUploadedImage(img.src);
            setValue(name, file); // kirim ke react-hook-form
          } else {
            openModal("modalFileError", true); // ✅ tampilkan error
            setUploadedImage(null);
            setValue(name, null);
          }
        };
      };

      reader.readAsDataURL(file);
    } else {
      openModal("modalFileError", true); // format salah
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setValue(name, null);
  };

  return (
    <div className="h-full p-6">
      <div className="flex flex-col h-full">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
          {t("imageUpload.title")}{" "}
        </h3>

        <div
          className={`flex-1 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
            dragActive
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
              : uploadedImage
              ? "border-green-400 bg-green-50 dark:bg-green-900/10"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadedImage ? (
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="object-contain max-w-full max-h-full mb-4 rounded-lg shadow-md md:h-[50vh]"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <X size={16} />
                  <span>{t("imageUpload.delete")}</span>
                </button>
                <label className="flex items-center px-4 py-2 space-x-2 text-black transition-colors bg-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-600 dark:text-gray-900">
                  <Camera size={16} />
                  <span>{t("imageUpload.change")}</span>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-lg font-medium text-gray-600 dark:text-gray-300">
                {t("imageUpload.dragDrop")}
              </p>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                {t("imageUpload.orClick")}
              </p>
              <label className="inline-flex items-center px-6 py-3 space-x-2 text-black transition-colors bg-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-600 dark:text-gray-900">
                <ImageIcon size={20} />
                <span>{t("imageUpload.choose")}</span>
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                {t("imageUpload.supported")}
              </p>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadArea;
