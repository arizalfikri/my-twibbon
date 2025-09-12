import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 md:h-screen">
        <NavbarEditor title={twibbonData?.title} />

        {/* Mobile Layout */}
        <div className="flex flex-col flex-1 md:hidden">
          {/* CardEditor Area - Fixed Height with padding for fixed ControlPanel */}
          <div className="flex-1 min-h-0 ">
            <CardEditor frameImage={frameImage} filters={filters} />
          </div>

          {/* Mobile Filter Panel - Light/Dark */}
          <div className="flex flex-col h-64 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-[500px]">
            {/* Mobile Tabs - Light/Dark */}
            <div className="flex flex-shrink-0 p-1 m-4 mb-2 bg-gray-100 rounded-lg dark:bg-gray-700">
              <button
                onClick={() => setActiveTab("presets")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "presets"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                🎨 Preset
              </button>
              <button
                onClick={() => setActiveTab("basic")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "basic"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                ⚙️ {t('editor.basic')}
              </button>
              <button
                onClick={() => setActiveTab("effects")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "effects"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                ✨ {t('editor.effects')}
              </button>
            </div>

            {/* Mobile Content - Light/Dark Mode */}
            <div className="flex-1 px-4 pb-4 ">
              {activeTab === "presets" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-200">
                      {t('editor.filter_preset')}
                    </h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {t('editor.reset')}
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
                      className="flex items-center justify-center p-3 space-x-2 transition-all border border-yellow-300 rounded-lg dark:border-yellow-600/50 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 hover:from-yellow-200 hover:to-orange-200 dark:hover:from-yellow-800/40 dark:hover:to-orange-800/40"
                    >
                      <span>☀️</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {t('editor.bright')}
                      </span>
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
                      className="flex items-center justify-center p-3 space-x-2 transition-all border rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-300 dark:border-amber-600/50 hover:from-amber-200 hover:to-yellow-200 dark:hover:from-amber-800/40 dark:hover:to-yellow-800/40"
                    >
                      <span>📷</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {t('editor.vintage')}
                      </span>
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
                      className="flex items-center justify-center p-3 space-x-2 transition-all border border-pink-300 rounded-lg dark:border-pink-600/50 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 hover:from-pink-200 hover:to-purple-200 dark:hover:from-pink-800/40 dark:hover:to-purple-800/40"
                    >
                      <span>🌈</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {t('editor.vivid')}
                      </span>
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
                      className="flex items-center justify-center p-3 space-x-2 transition-all border border-gray-300 rounded-lg dark:border-gray-600/50 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/30 dark:to-slate-800/30 hover:from-gray-200 hover:to-slate-200 dark:hover:from-gray-700/40 dark:hover:to-slate-700/40"
                    >
                      <span>⚫</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {t('editor.bw')}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "basic" && (
                <div className="space-y-4">
                  {/* Brightness Control - Light/Dark */}
                  <div className="p-3 border border-yellow-200 rounded-lg dark:border-yellow-600/30 bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          ☀️ {t('editor.brightness')}
                        </span>
                        <span className="px-2 py-1 text-sm font-bold text-yellow-700 bg-yellow-200 rounded dark:text-yellow-300 dark:bg-yellow-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-yellow"
                      />
                    </div>
                  </div>

                  {/* Contrast Control - Light/Dark */}
                  <div className="p-3 border border-purple-200 rounded-lg dark:border-purple-600/30 bg-purple-50 dark:bg-purple-900/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          🔳 {t('editor.contrast')}
                        </span>
                        <span className="px-2 py-1 text-sm font-bold text-purple-700 bg-purple-200 rounded dark:text-purple-300 dark:bg-purple-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-purple"
                      />
                    </div>
                  </div>

                  {/* Saturation Control - Light/Dark */}
                  <div className="p-3 border border-pink-200 rounded-lg dark:border-pink-600/30 bg-pink-50 dark:bg-pink-900/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          🎨 {t('editor.saturation')}
                        </span>
                        <span className="px-2 py-1 text-sm font-bold text-pink-700 bg-pink-200 rounded dark:text-pink-300 dark:bg-pink-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-pink"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "effects" && (
                <div className="space-y-4">
                  {/* Hue Control - Light/Dark */}
                  <div className="p-3 border border-indigo-200 rounded-lg dark:border-indigo-600/30 bg-indigo-50 dark:bg-indigo-900/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          🌀 {t('editor.hue')}
                        </span>
                        <span className="px-2 py-1 text-sm font-bold text-indigo-700 bg-indigo-200 rounded dark:text-indigo-300 dark:bg-indigo-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-indigo"
                      />
                    </div>
                  </div>

                  {/* Sepia - Light/Dark */}
                  <div className="p-3 border rounded-lg bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-600/30">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          🍂 {t('editor.sepia')}
                        </span>
                        <span className="px-2 py-1 text-sm font-bold rounded text-amber-700 dark:text-amber-300 bg-amber-200 dark:bg-amber-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-amber"
                      />
                    </div>
                  </div>

                  {/* Grayscale - Light/Dark */}
                  <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-600/30">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          ⬜ {t('editor.grayscale')}
                        </span>
                        <span className="px-2 py-1 text-sm font-bold rounded text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-slate"
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

          {/* Enhanced Settings Panel - Light/Dark */}
          <div className="bg-white border border-gray-200 shadow-lg dark:border-gray-700 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                🎨 {t('editor.filter_settings')}
              </h2>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {t('editor.reset')}
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[600px]  bg-white dark:bg-gray-900">
              {/* Preset Filters - Light/Dark */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-200">
                  {t('editor.filter_preset')}
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
                    className="flex items-center p-4 space-x-3 transition-all border-2 border-yellow-300 rounded-lg dark:border-yellow-600/50 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 hover:from-yellow-200 hover:to-orange-200 dark:hover:from-yellow-800/40 dark:hover:to-orange-800/40 hover:border-yellow-400 dark:hover:border-yellow-500/70"
                  >
                    <span className="text-2xl">☀️</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {t('editor.bright')}
                    </span>
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
                    className="flex items-center p-4 space-x-3 transition-all border-2 rounded-lg border-amber-300 dark:border-amber-600/50 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 hover:from-amber-200 hover:to-yellow-200 dark:hover:from-amber-800/40 dark:hover:to-yellow-800/40 hover:border-amber-400 dark:hover:border-amber-500/70"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {t('editor.vintage')}
                    </span>
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
                    className="flex items-center p-4 space-x-3 transition-all border-2 border-pink-300 rounded-lg dark:border-pink-600/50 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 hover:from-pink-200 hover:to-purple-200 dark:hover:from-pink-800/40 dark:hover:to-purple-800/40 hover:border-pink-400 dark:hover:border-pink-500/70"
                  >
                    <span className="text-2xl">🌈</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {t('editor.vivid')}
                    </span>
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
                    className="flex items-center p-4 space-x-3 transition-all border-2 border-gray-300 rounded-lg dark:border-gray-600/50 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/30 dark:to-slate-800/30 hover:from-gray-200 hover:to-slate-200 dark:hover:from-gray-700/40 dark:hover:to-slate-700/40 hover:border-gray-400 dark:hover:border-gray-500/70"
                  >
                    <span className="text-2xl">⚫</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {t('editor.bw')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Basic Controls - Light/Dark */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-200">
                  {t('editor.basic_controls')}
                </h3>
                <div className="space-y-4">
                  {/* Brightness Control - Light/Dark */}
                  <div className="p-4 border border-yellow-200 rounded-lg dark:border-yellow-600/30 bg-yellow-50 dark:bg-yellow-900/20">
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-200">
                      ☀️ {t('editor.brightness')}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {t('editor.brightness_desc')}
                        </span>
                        <span className="px-2 py-1 text-sm font-medium text-yellow-700 bg-yellow-200 rounded dark:text-yellow-300 dark:bg-yellow-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-yellow"
                      />
                    </div>
                  </div>

                  {/* Contrast Control - Light/Dark */}
                  <div className="p-4 border border-purple-200 rounded-lg dark:border-purple-600/30 bg-purple-50 dark:bg-purple-900/20">
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-200">
                      🔳 {t('editor.contrast')}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {t('editor.contrast_desc')}
                        </span>
                        <span className="px-2 py-1 text-sm font-medium text-purple-700 bg-purple-200 rounded dark:text-purple-300 dark:bg-purple-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-purple"
                      />
                    </div>
                  </div>

                  {/* Saturation Control - Light/Dark */}
                  <div className="p-4 border border-pink-200 rounded-lg dark:border-pink-600/30 bg-pink-50 dark:bg-pink-900/20">
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-200">
                      🎨 {t('editor.saturation')}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {t('editor.saturation_desc')}
                        </span>
                        <span className="px-2 py-1 text-sm font-medium text-pink-700 bg-pink-200 rounded dark:text-pink-300 dark:bg-pink-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-pink"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Controls - Light/Dark */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-200">
                  {t('editor.advanced_controls')}
                </h3>
                <div className="space-y-4">
                  {/* Hue Control - Light/Dark */}
                  <div className="p-4 border border-indigo-200 rounded-lg dark:border-indigo-600/30 bg-indigo-50 dark:bg-indigo-900/20">
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-200">
                      🌀 {t('editor.hue')}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {t('editor.hue_desc')}
                        </span>
                        <span className="px-2 py-1 text-sm font-medium text-indigo-700 bg-indigo-200 rounded dark:text-indigo-300 dark:bg-indigo-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-indigo"
                      />
                    </div>
                  </div>

                  {/* Effect Controls - Light/Dark */}
                  <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-600/30">
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-200">
                      ✨ {t('editor.effects')}
                    </h4>

                    {/* Sepia - Light/Dark */}
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          🍂 {t('editor.sepia')}
                        </span>
                        <span className="px-2 py-1 text-sm font-medium rounded text-amber-700 dark:text-amber-300 bg-amber-200 dark:bg-amber-800/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-amber"
                      />
                    </div>

                    {/* Grayscale - Light/Dark */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          ⬜ {t('editor.grayscale')}
                        </span>
                        <span className="px-2 py-1 text-sm font-medium rounded text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700/50">
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-slate"
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