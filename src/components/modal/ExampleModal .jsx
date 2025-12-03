import React from "react";
import GoodExample1 from "../../assets/images/ExampleUpload/GoodExample1.jpg";

function ExampleModal({ isOpen, onClose, onContinue }) {
  if (!isOpen) return null;

  const goodPhotos = [
    GoodExample1,
    "https://images.unsplash.com/photo-1595152772835-219674b2a8a6",
    "https://images.unsplash.com/photo-1589652717521-10c0d092dea9",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
  ];

  const badPhotos = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // landscape
    "https://images.unsplash.com/photo-1525182008055-f88b95ff7980", // empty room
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // blurry
    "https://images.unsplash.com/photo-1500534623283-312aade485b7"  // sky bg
  ];

  return (
    <div
      className="
        fixed inset-0 z-[100] flex items-end justify-center p-4 
        bg-black/50 backdrop-blur-sm
        md:items-center md:justify-center
      "
    >
      <div
        className="
          w-full bg-white dark:bg-gray-800 shadow-xl p-6
          rounded-t-2xl max-h-[90vh] overflow-y-auto
          fixed bottom-0
          md:static md:rounded-xl md:max-w-md md:max-h-none
        "
      >
        <button
          className="absolute top-3 right-3 text-gray-500 md:hidden"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Ikuti panduan ini untuk hasil terbaik!
        </h2>

        {/* GOOD EXAMPLES */}
        <div className="mb-6">
          <h3 className="flex gap-2 items-center mb-2 font-semibold text-green-600">
            <span>✔</span> Contoh foto yang benar:
          </h3>

          <div className="grid grid-cols-4 gap-2 mb-2">
            {goodPhotos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Good"
                className="rounded-lg object-cover w-full h-[70px]"
              />
            ))}
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300">
            Foto close-up, wajah jelas, pencahayaan baik
          </p>
        </div>

        {/* BAD EXAMPLES */}
        <div className="mb-6">
          <h3 className="flex gap-2 items-center mb-2 font-semibold text-red-600">
            <span>✖</span> Hindari menggunakan foto berikut:
          </h3>

          <div className="grid grid-cols-4 gap-2 mb-2">
            {badPhotos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Bad"
                className="rounded-lg object-cover w-full h-[70px]"
              />
            ))}
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300">
            Foto badan penuh, foto pemandangan/background saja, atau foto blur
          </p>
        </div>

        <div className="flex gap-3 justify-end w-full">
          <button
            onClick={onContinue}
            className="px-4 py-2 w-full text-white rounded-lg bg-primary-400 hover:bg-primary-600"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExampleModal;
