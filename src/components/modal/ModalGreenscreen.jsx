import React from "react";
import { createPortal } from "react-dom";
import { Sparkles, User } from "lucide-react";

function ModalGreenscreen({ isOpen, isProcessing, forceRender = false }) {
  // If modal isn't open (and not forced) we shouldn't render anything
  if (!isOpen && !forceRender) return null;

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm ">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex gap-3 items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30">
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Auto Remove Background
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menghapus background foto secara otomatis...
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Animation Section */}
          <div className="p-4 mb-6 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700/50 dark:border-gray-600">
            <div className="flex justify-between items-center">
              {/* Before - With Background */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2 w-16 h-16">
                  <div className="absolute inset-0 rounded-lg bg-primary-400"></div>
                  <div className="flex absolute inset-1 justify-center items-center bg-white rounded-full dark:bg-gray-800">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Sebelum
                </span>
              </div>

              {/* Animated Arrow */}
              <div className="flex justify-center items-center">
                <svg
                  className="w-6 h-6 animate-pulse text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>

              {/* After - Transparent Background */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2 w-16 h-16">
                  {/* Checkerboard background untuk transparan */}
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                        linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                        linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                      `,
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                    }}
                  ></div>
                  <div className="flex absolute inset-1 justify-center items-center bg-white rounded-full border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>

                  {/* Animated scanning effect */}
                  <div className="overflow-hidden absolute inset-0 rounded-lg">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-primary-400 animate-scan shadow-lg shadow-primary-400/50"></div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Sesudah
                </span>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="flex flex-col justify-center items-center p-4">
            <div className="mb-4 w-12 h-12 rounded-full border-4 animate-spin border-primary-500 border-t-transparent"></div>
            <p className="text-center text-gray-700 dark:text-gray-300">
              {isProcessing 
                ? "Sedang menghapus background..." 
                : "Mempersiapkan proses..."}
            </p>
            <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              Proses memerlukan waktu beberapa detik
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal into document.body so fixed positioning isn't affected by
  // parent stacking contexts or transforms (fixes desktop EditorPage clipping)
  if (typeof document !== "undefined") {
    return createPortal(modal, document.body);
  }

  return modal; // fallback for non-DOM environments
}

export default ModalGreenscreen;