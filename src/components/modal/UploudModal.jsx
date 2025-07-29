import React from "react";
import { Camera, Upload, X } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onFileSelect, onCameraSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 mx-4 bg-white rounded-lg w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pilih Sumber Gambar</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onCameraSelect}
            className="flex items-center w-full gap-3 p-4 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
          >
            <Camera size={24} className="text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-blue-800">Ambil Foto</div>
              <div className="text-sm text-blue-600">Gunakan kamera untuk mengambil foto</div>
            </div>
          </button>
          
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="flex items-center w-full gap-3 p-4 transition-colors rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100"
          >
            <Upload size={24} className="text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-purple-800">Upload File</div>
              <div className="text-sm text-purple-600">Pilih gambar dari galeri</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;