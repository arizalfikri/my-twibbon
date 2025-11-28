import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Camera,
} from "lucide-react";
import { useModalStore } from "../../helper/store/modal.store";
import { useTranslation } from "react-i18next";

function ImageUploadArea({
  name = "template",
  setValue,
  error,
  value,
  type = "frame", // type akan di-pass dari parent
}) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { openModal } = useModalStore();

  // Allowed types per mode
  const allowedTypes = {
    frame: ["image/png", "image/webp"], // transparan wajib
    background: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  };

  // Helper cek transparansi
  const checkTransparency = (img, file, onSuccess, onFail) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const { data, width, height } = ctx.getImageData(
      0,
      0,
      img.width,
      img.height
    );
    const totalPixels = width * height;

    let transparentPixels = 0;

    // alpha < 200 → dianggap transparan
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 200) {
        transparentPixels++;
      }
    }

    const percent = (transparentPixels / totalPixels) * 100;
    console.log(`Transparansi Detected: ${percent.toFixed(3)}%`);

    // Minimal transparansi 3%
    if (percent >= 3) {
      onSuccess();
    } else {
      onFail();
    }
  };

  // Preview on mount
  useEffect(() => {
    if (!value) return setUploadedImage(null);

    if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(value);
    } else if (typeof value === "string") {
      setUploadedImage(value);
    }
  }, [value]);

  // Handle file secara umum
  const handleFile = (file) => {
    if (!file) return;

    if (!allowedTypes[type].includes(file.type)) {
      openModal("modalFileError", true);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;

      img.onload = () => {
        if (type === "frame") {
          // frame → harus transparan
          checkTransparency(
            img,
            file,
            () => {
              setUploadedImage(img.src);
              setValue(name, file);
            },
            () => {
              openModal("modalFileError", true);
              setUploadedImage(null);
              setValue(name, null);
            }
          );
        } else {
          // background → ga perlu transparan
          setUploadedImage(img.src);
          setValue(name, file);
        }
      };
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
    setDragActive(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setValue(name, null);
  };

  return (
    <div className="h-full p-6">
      <div className="flex flex-col h-full min-h-80">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
          {t("imageUpload.title")}
        </h3>

        <div
          className={`flex-1 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
            dragActive
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
              : uploadedImage
              ? "border-green-400 bg-green-50 dark:bg-green-900/10"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* PREVIEW */}
          {uploadedImage ? (
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              <img
                src={uploadedImage}
                alt="uploaded"
                className="object-contain max-w-full max-h-full mb-4 rounded-lg shadow-md md:h-[50vh]"
              />

              <div className="flex space-x-3">
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <X size={16} />
                  <span>{t("imageUpload.delete")}</span>
                </button>

                <label className="flex items-center px-4 py-2 space-x-2 text-black bg-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-600">
                  <Camera size={16} />
                  <span>{t("imageUpload.change")}</span>
                  <input
                    type="file"
                    accept={allowedTypes[type].join(",")}
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="text-center">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />

              <p className="mb-2 text-lg font-medium text-gray-600 dark:text-gray-300">
                {t("imageUpload.dragDrop")}
              </p>

              <label className="inline-flex items-center px-6 py-3 space-x-2 text-black bg-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-600">
                <ImageIcon size={20} />
                <span>{t("imageUpload.choose")}</span>

                <input
                  type="file"
                  accept={allowedTypes[type].join(",")}
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>

              {/* Format kecil */}
              <p className="mt-4 text-xs text-gray-400">
                {type === "frame"
                  ? "Format: PNG / WEBP (harus transparan)"
                  : "Format: PNG / JPG / JPEG / WEBP"}
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