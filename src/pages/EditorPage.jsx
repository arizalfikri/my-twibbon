import React, { useEffect, useState } from "react";
import CardEditor from "../components/cards/CardEditor";
import useImageStore from "../helper/store/imagestore";
import { useNavigate } from "react-router-dom";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useTwibbonStore from "../helper/store/TwiboneUser";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function EditorPage() {
  const { image, frameImage } = useImageStore();
  const navigate = useNavigate();
  const { twibbonData } = useTwibbonStore();

  // Enhanced filter states
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    sepia: 0,
    grayscale: 0,
  });

  const [activeTab, setActiveTab] = useState("basic");

  // Update individual filter
  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      sepia: 0,
      grayscale: 0,
    });
  };

  useEffect(() => {
    if (!image) {
      navigate("/");
    }
  }, [image, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-full bg-gray-900 md:h-screen">
        <NavbarEditor title={twibbonData?.title} />

        {/* Mobile Layout */}
        <div className="flex flex-col flex-1 md:hidden">
          {/* CardEditor Area - Fixed Height with padding for fixed ControlPanel */}
          <div className="flex-1 min-h-0 ">
            <CardEditor frameImage={frameImage} filters={filters} />
          </div>

          {/* Mobile Filter Panel */}
          <div className="flex flex-col h-64 bg-gray-800 border-t border-gray-700 pb-[500px]">
            {/* Mobile Tabs - Dark */}
            <div className="flex flex-shrink-0 p-1 m-4 mb-2 bg-gray-700 rounded-lg">
              <button
                onClick={() => setActiveTab("presets")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "presets"
                    ? "bg-gray-600 text-white shadow-sm"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                🎨 Preset
              </button>
              <button
                onClick={() => setActiveTab("basic")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "basic"
                    ? "bg-gray-600 text-white shadow-sm"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                ⚙️ Dasar
              </button>
              <button
                onClick={() => setActiveTab("effects")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "effects"
                    ? "bg-gray-600 text-white shadow-sm"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                ✨ Efek
              </button>
            </div>

            {/* Mobile Content - Dark Mode */}
            <div className="flex-1 px-4 pb-4 ">
              {activeTab === "presets" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-200">Filter Preset</h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setFilters({
                          brightness: 120,
                          contrast: 110,
                          saturation: 130,
                          hue: 0,
                          blur: 0,
                          sepia: 0,
                          grayscale: 0,
                        })
                      }
                      className="flex items-center justify-center p-3 space-x-2 transition-all border rounded-lg border-yellow-600/50 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 hover:from-yellow-800/40 hover:to-orange-800/40"
                    >
                      <span>☀️</span>
                      <span className="text-sm font-medium text-gray-200">Cerah</span>
                    </button>
                    <button
                      onClick={() =>
                        setFilters({
                          brightness: 80,
                          contrast: 120,
                          saturation: 80,
                          hue: 0,
                          blur: 0,
                          sepia: 30,
                          grayscale: 0,
                        })
                      }
                      className="flex items-center justify-center p-3 space-x-2 transition-all border rounded-lg bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-600/50 hover:from-amber-800/40 hover:to-yellow-800/40"
                    >
                      <span>📷</span>
                      <span className="text-sm font-medium text-gray-200">Vintage</span>
                    </button>
                    <button
                      onClick={() =>
                        setFilters({
                          brightness: 90,
                          contrast: 110,
                          saturation: 150,
                          hue: -10,
                          blur: 0,
                          sepia: 0,
                          grayscale: 0,
                        })
                      }
                      className="flex items-center justify-center p-3 space-x-2 transition-all border rounded-lg border-pink-600/50 bg-gradient-to-br from-pink-900/30 to-purple-900/30 hover:from-pink-800/40 hover:to-purple-800/40"
                    >
                      <span>🌈</span>
                      <span className="text-sm font-medium text-gray-200">Vivid</span>
                    </button>
                    <button
                      onClick={() =>
                        setFilters({
                          brightness: 100,
                          contrast: 100,
                          saturation: 0,
                          hue: 0,
                          blur: 0,
                          sepia: 0,
                          grayscale: 100,
                        })
                      }
                      className="flex items-center justify-center p-3 space-x-2 transition-all border rounded-lg border-gray-600/50 bg-gradient-to-br from-gray-800/30 to-slate-800/30 hover:from-gray-700/40 hover:to-slate-700/40"
                    >
                      <span>⚫</span>
                      <span className="text-sm font-medium text-gray-200">B&W</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "basic" && (
                <div className="space-y-4">
                  {/* Brightness Control - Dark */}
                  <div className="p-3 border rounded-lg border-yellow-600/30 bg-yellow-900/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-200">
                          ☀️ Kecerahan
                        </span>
                        <span className="px-2 py-1 text-sm font-bold text-yellow-300 rounded bg-yellow-800/50">
                          {filters.brightness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.brightness}
                        onChange={(e) =>
                          updateFilter("brightness", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-yellow"
                      />
                    </div>
                  </div>

                  {/* Contrast Control - Dark */}
                  <div className="p-3 border rounded-lg border-purple-600/30 bg-purple-900/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-200">
                          🔳 Kontras
                        </span>
                        <span className="px-2 py-1 text-sm font-bold text-purple-300 rounded bg-purple-800/50">
                          {filters.contrast}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.contrast}
                        onChange={(e) =>
                          updateFilter("contrast", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                      />
                    </div>
                  </div>

                  {/* Saturation Control - Dark */}
                  <div className="p-3 border rounded-lg border-pink-600/30 bg-pink-900/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-200">
                          🎨 Saturasi
                        </span>
                        <span className="px-2 py-1 text-sm font-bold text-pink-300 rounded bg-pink-800/50">
                          {filters.saturation}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.saturation}
                        onChange={(e) =>
                          updateFilter("saturation", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-pink"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "effects" && (
                <div className="space-y-4">
                  {/* Hue Control - Dark */}
                  <div className="p-3 border rounded-lg border-indigo-600/30 bg-indigo-900/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-200">
                          🌀 Rona Warna
                        </span>
                        <span className="px-2 py-1 text-sm font-bold text-indigo-300 rounded bg-indigo-800/50">
                          {filters.hue}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={filters.hue}
                        onChange={(e) =>
                          updateFilter("hue", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-indigo"
                      />
                    </div>
                  </div>

                  {/* Sepia - Dark */}
                  <div className="p-3 border rounded-lg bg-amber-900/20 border-amber-600/30">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-200">
                          🍂 Sepia
                        </span>
                        <span className="px-2 py-1 text-sm font-bold rounded text-amber-300 bg-amber-800/50">
                          {filters.sepia}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.sepia}
                        onChange={(e) =>
                          updateFilter("sepia", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-amber"
                      />
                    </div>
                  </div>

                  {/* Grayscale - Dark */}
                  <div className="p-3 border rounded-lg bg-slate-800/20 border-slate-600/30">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-200">
                          ⬜ Grayscale
                        </span>
                        <span className="px-2 py-1 text-sm font-bold rounded text-slate-300 bg-slate-700/50">
                          {filters.grayscale}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.grayscale}
                        onChange={(e) =>
                          updateFilter("grayscale", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-slate"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout  */}
        <div className="justify-between hidden max-w-full p-6 mx-auto gap-80 md:grid md:grid-cols-2">
          <div className="">
            <CardEditor frameImage={frameImage} filters={filters} />
          </div>

          {/* Enhanced Settings Panel - Dark */}
          <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-gray-200">
                🎨 Filter & Pengaturan
              </h2>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Reset
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[600px] custom-scrollbar">
              {/* Preset Filters - Dark */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-200">
                  Filter Preset
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setFilters({
                        brightness: 120,
                        contrast: 110,
                        saturation: 130,
                        hue: 0,
                        blur: 0,
                        sepia: 0,
                        grayscale: 0,
                      })
                    }
                    className="flex items-center p-4 space-x-3 transition-all border-2 rounded-lg border-yellow-600/50 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 hover:from-yellow-800/40 hover:to-orange-800/40 hover:border-yellow-500/70"
                  >
                    <span className="text-2xl">☀️</span>
                    <span className="font-medium text-gray-200">Cerah</span>
                  </button>
                  <button
                    onClick={() =>
                      setFilters({
                        brightness: 80,
                        contrast: 120,
                        saturation: 80,
                        hue: 0,
                        blur: 0,
                        sepia: 30,
                        grayscale: 0,
                      })
                    }
                    className="flex items-center p-4 space-x-3 transition-all border-2 rounded-lg bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-600/50 hover:from-amber-800/40 hover:to-yellow-800/40 hover:border-amber-500/70"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="font-medium text-gray-200">Vintage</span>
                  </button>
                  <button
                    onClick={() =>
                      setFilters({
                        brightness: 90,
                        contrast: 110,
                        saturation: 150,
                        hue: -10,
                        blur: 0,
                        sepia: 0,
                        grayscale: 0,
                      })
                    }
                    className="flex items-center p-4 space-x-3 transition-all border-2 rounded-lg border-pink-600/50 bg-gradient-to-br from-pink-900/30 to-purple-900/30 hover:from-pink-800/40 hover:to-purple-800/40 hover:border-pink-500/70"
                  >
                    <span className="text-2xl">🌈</span>
                    <span className="font-medium text-gray-200">Vivid</span>
                  </button>
                  <button
                    onClick={() =>
                      setFilters({
                        brightness: 100,
                        contrast: 100,
                        saturation: 0,
                        hue: 0,
                        blur: 0,
                        sepia: 0,
                        grayscale: 100,
                      })
                    }
                    className="flex items-center p-4 space-x-3 transition-all border-2 rounded-lg border-gray-600/50 bg-gradient-to-br from-gray-800/30 to-slate-800/30 hover:from-gray-700/40 hover:to-slate-700/40 hover:border-gray-500/70"
                  >
                    <span className="text-2xl">⚫</span>
                    <span className="font-medium text-gray-200">B&W</span>
                  </button>
                </div>
              </div>

              {/* Basic Controls - Dark */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-200">
                  Kontrol Dasar
                </h3>
                <div className="space-y-4">
                  {/* Brightness Control - Dark */}
                  <div className="p-4 border rounded-lg border-yellow-600/30 bg-yellow-900/20">
                    <h4 className="mb-3 font-medium text-gray-200">
                      ☀️ Brightness
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Kecerahan</span>
                        <span className="px-2 py-1 text-sm font-medium text-yellow-300 rounded bg-yellow-800/50">
                          {filters.brightness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.brightness}
                        onChange={(e) =>
                          updateFilter("brightness", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-yellow"
                      />
                    </div>
                  </div>

                  {/* Contrast Control - Dark */}
                  <div className="p-4 border rounded-lg border-purple-600/30 bg-purple-900/20">
                    <h4 className="mb-3 font-medium text-gray-200">
                      🔳 Contrast
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Kontras</span>
                        <span className="px-2 py-1 text-sm font-medium text-purple-300 rounded bg-purple-800/50">
                          {filters.contrast}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.contrast}
                        onChange={(e) =>
                          updateFilter("contrast", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                      />
                    </div>
                  </div>

                  {/* Saturation Control - Dark */}
                  <div className="p-4 border rounded-lg border-pink-600/30 bg-pink-900/20">
                    <h4 className="mb-3 font-medium text-gray-200">
                      🎨 Saturation
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Saturasi</span>
                        <span className="px-2 py-1 text-sm font-medium text-pink-300 rounded bg-pink-800/50">
                          {filters.saturation}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.saturation}
                        onChange={(e) =>
                          updateFilter("saturation", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-pink"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Controls - Dark */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-200">
                  Kontrol Lanjut
                </h3>
                <div className="space-y-4">
                  {/* Hue Control - Dark */}
                  <div className="p-4 border rounded-lg border-indigo-600/30 bg-indigo-900/20">
                    <h4 className="mb-3 font-medium text-gray-200">🌀 Hue</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          Rona Warna
                        </span>
                        <span className="px-2 py-1 text-sm font-medium text-indigo-300 rounded bg-indigo-800/50">
                          {filters.hue}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={filters.hue}
                        onChange={(e) =>
                          updateFilter("hue", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-indigo"
                      />
                    </div>
                  </div>

                  {/* Effect Controls - Dark */}
                  <div className="p-4 border rounded-lg bg-amber-900/20 border-amber-600/30">
                    <h4 className="mb-3 font-medium text-gray-200">✨ Efek</h4>

                    {/* Sepia - Dark */}
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">🍂 Sepia</span>
                        <span className="px-2 py-1 text-sm font-medium rounded text-amber-300 bg-amber-800/50">
                          {filters.sepia}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.sepia}
                        onChange={(e) =>
                          updateFilter("sepia", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-amber"
                      />
                    </div>

                    {/* Grayscale - Dark */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          ⬜ Grayscale
                        </span>
                        <span className="px-2 py-1 text-sm font-medium rounded text-slate-300 bg-slate-700/50">
                          {filters.grayscale}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.grayscale}
                        onChange={(e) =>
                          updateFilter("grayscale", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-slate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </QueryClientProvider>
  );
}

export default EditorPage;