import React from "react";
import GoodExample1 from "../../assets/images/ExampleUpload/GoodExample1.jpg";
import BadExample1 from "../../assets/images/ExampleUpload/BadExample1.jpg";

function ExampleModal({ isOpen, onClose, onContinue }) {
  if (!isOpen) return null;

  const goodPhotos = [GoodExample1, GoodExample1, GoodExample1, GoodExample1];
  const badPhotos = [BadExample1, BadExample1, BadExample1, BadExample1];

  return (
    <div
      className="
        fixed inset-0 z-[100] flex items-end justify-center p-4 
        bg-black/50 backdrop-blur-sm
        md:items-center md:justify-center
      "
    >
      {/* FULL SCREEN MOBILE + NORMAL DESKTOP */}
      <div
        className="
          w-full bg-white dark:bg-gray-800 shadow-xl p-6
          
          rounded-t-2xl max-h-[90vh] overflow-y-auto
          fixed bottom-0

          md:static md:rounded-xl md:max-w-md md:max-h-none
        "
      >
        {/* CLOSE BUTTON (mobile style) */}
        <button
          className="absolute text-gray-500 top-3 right-3 md:hidden"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Follow this guideline for the best results!
        </h2>

        {/* GOOD EXAMPLES */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 mb-2 font-semibold text-green-600">
            <span>✔</span> Good photo examples:
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
            Close-up selfie, portrait photo, clear face
          </p>
        </div>

        {/* BAD EXAMPLES */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 mb-2 font-semibold text-red-600">
            <span>✖</span> Photos to avoid:
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
            Full body photo, group photo, photo from the back
          </p>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end w-full gap-3">
          <button
            onClick={onContinue}
            className="w-full px-4 py-2 text-white rounded-lg bg-primary-400 hover:bg-primary-600"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExampleModal;
