import React, { useRef, useState, useCallback, useEffect } from "react";
import { X, RotateCcw, Download, Camera } from "lucide-react";
import Webcam from "react-webcam";
import { useTranslation } from "react-i18next";

const CameraCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  const { t } = useTranslation();
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const switchCamera = () => {
    setFacingMode((prevState) =>
      prevState === "user" ? "environment" : "user"
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white bg-black ">
        <h3 className="text-lg font-semibold">
          {capturedImage ? "Preview Foto" : "Ambil Foto"}
        </h3>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <X size={24} />
        </button>
      </div>

      {/* Camera/Preview Area */}
      <div className="flex items-center justify-center flex-1 bg-black">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="object-contain max-w-full max-h-full"
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="object-contain max-w-full max-h-[70vh]"
          />
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black">
        {/* Kontrol untuk ambil ulang / gunakan foto */}
        {capturedImage ? (
          <div className="flex justify-center gap-4 p-6 bg-black">
            <button
              onClick={retakePhoto}
              className="flex items-center gap-2 px-6 py-3 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              <RotateCcw size={20} />
              {t("camera.retake")}
            </button>
            <button
              onClick={confirmPhoto}
              className="flex items-center gap-2 px-6 py-3 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Download size={20} />
              {t("camera.usePhoto")}
            </button>
          </div>
        ) : (
          <>
            {/* Tombol kamera di bawah (mobile) */}
            <div className="flex items-center justify-center gap-4 p-6 bg-black md:hidden">
              <button
                onClick={switchCamera}
                className="p-3 text-white transition-colors bg-gray-600 rounded-full hover:bg-gray-700"
                title={t("camera.switchCamera")}
              >
                <RotateCcw size={20} />
              </button>

              <button
                onClick={capturePhoto}
                className="flex items-center justify-center w-16 h-16 transition-colors bg-white rounded-full hover:bg-gray-200"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white border-4 border-gray-400 rounded-full">
                  <Camera />
                </div>
              </button>
            </div>

            {/* Tombol kamera di kanan bawah (desktop) */}
            <div className="fixed z-50 flex-col hidden gap-4 md:flex bottom-80 right-6">
              <button
                onClick={capturePhoto}
                className="flex items-center justify-center w-16 h-16 transition-colors bg-white rounded-full hover:bg-gray-200"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white border-4 border-gray-400 rounded-full">
                  <Camera />
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
