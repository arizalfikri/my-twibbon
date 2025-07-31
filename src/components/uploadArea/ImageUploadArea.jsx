import React, { useState } from "react";
import {
  Upload,
  X,
  Image,
  Camera,
} from "lucide-react";
import { useModalStore } from "../../helper/store/modal.store";

function ImageUploadArea() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { openModal } = useModalStore();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      openModal("modalFileError", true);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      openModal("modalFileError", true);
    }
  };

  return (
    <div className="h-full p-6">
      <div className="flex flex-col h-full">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Upload Gambar
        </h3>

        <div
          className={`flex-1 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : uploadedImage
              ? "border-green-400 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
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
                className="object-contain max-w-full mb-4 rounded-lg shadow-md max-h-64"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setUploadedImage(null)}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <X size={16} />
                  <span>Hapus</span>
                </button>
                <label className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600">
                  <Camera size={16} />
                  <span>Ganti</span>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-lg font-medium text-gray-600">
                Drag & drop gambar di sini
              </p>
              <p className="mb-6 text-sm text-gray-500">
                atau klik untuk memilih file
              </p>
              <label className="inline-flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
                <Image size={20} />
                <span>Pilih Gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="mt-4 text-xs text-gray-400">
                Format yang didukung: JPG, PNG (Max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadArea;