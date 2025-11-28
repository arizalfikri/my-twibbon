import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CardEditor from "../components/cards/CardEditor";
import useImageStore from "../helper/store/imagestore";
import { useNavigate, useParams } from "react-router-dom";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useTwibbonStore from "../helper/store/TwiboneUser";
import ControlPanel from "../components/ui/ControlPanel";
import * as htmlToImage from "html-to-image";
import { useGET } from "../services/api";
import LoadingPage from "../components/layoutpage/LoadingPage";
import NotFound from "./NotfoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

function EditorPage() {
  const { t } = useTranslation();
  const { image, setImage, setFrameImage, frameImage } = useImageStore();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { twibbonData } = useTwibbonStore();
  const { data } = useGET("/detail-subscription");
  const SubscribeData = data?.data;
  const editorRef = useRef(null);

  const {
    data: twibbon,
    isLoading: isTwibbonLoading,
    error: twibbonError,
  } = useGET(!image && slug ? `twibbon/${slug}?page=1&perPage=20` : null);

  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    sepia: 0,
    grayscale: 0,
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [twibbonLoaded, setTwibbonLoaded] = useState(false);

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

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
    if (!image && slug && twibbon?.data && !isTwibbonLoading && !twibbonLoaded) {
      useTwibbonStore.getState().setTwibbonData(twibbon.data);
      if (twibbon.data?.template_twibbon) {
        const imageURL = `${import.meta.env.VITE_FILE_URL}${
          twibbon.data.template_twibbon
        }`;
        setFrameImage(imageURL);
      }
      setTwibbonLoaded(true);
    }
  }, [twibbon?.data?.id, isTwibbonLoading, twibbonLoaded, image, slug, setFrameImage]);

  useEffect(() => {
    if (!image && !slug) {
      navigate("/");
    }
  }, [slug, navigate, image]);

  useEffect(() => {
    if (!image && slug && isTwibbonLoading === false && !twibbon?.data && twibbonLoaded) {
      navigate("/");
    }
  }, [isTwibbonLoading, twibbon?.data, twibbonLoaded, navigate, slug, image]);

  if (!image && slug && isTwibbonLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <LoadingPage />
      </QueryClientProvider>
    );
  }

  if (!image && slug && !isTwibbonLoading && (!twibbon?.data || twibbonError)) {
    return (
      <QueryClientProvider client={queryClient}>
        <NotFound />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavbarEditor title={twibbonData?.title} twibbon={frameImage} />

      <div className="flex flex-col items-center justify-between min-h-screen bg-white dark:bg-gray-900 md:max-h-screen md:overflow-hidden">
        {/* Mobile Layout */}
        <div className="flex flex-col flex-1 w-full md:hidden">
          <div className="flex items-center justify-center flex-1 min-h-0 p-4 bg-gray-50 dark:bg-gray-900">
            <div ref={editorRef} className="w-full max-w-md">
              <CardEditor
                frameImage={frameImage}
                filters={filters}
                event_twibbon_id={twibbonData?.id}
                SubscribeData={SubscribeData}
                templateType={twibbonData?.type || "frame"}
                watermarkRequired={twibbonData?.watermark || false}
                isSubscribed={SubscribeData?.[0]?.status === "ACTIVE"}
              />
            </div>
          </div>

          {/* Mobile Filter Panel */}
          <div className="flex flex-col pb-20 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-80">
            <div className="flex flex-shrink-0 p-1 m-3 mb-2 bg-gray-100 rounded-lg dark:bg-gray-700">
              <button
                onClick={() => setActiveTab("presets")}
                disabled={!image}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === "presets"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                🎨 Preset
              </button>
              <button
                onClick={() => setActiveTab("basic")}
                disabled={!image}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === "basic"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                ⚙️ {t("editor.basic")}
              </button>
              <button
                onClick={() => setActiveTab("effects")}
                disabled={!image}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === "effects"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                ✨ {t("editor.effects")}
              </button>
            </div>

            <div
              className="flex-1 px-3 pb-3 overflow-y-auto"
              style={{
                opacity: image ? 1 : 0.5,
                pointerEvents: image ? "auto" : "none",
              }}
            >
              {activeTab === "presets" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {t("editor.filter_preset")}
                    </h3>
                    <button
                      onClick={resetFilters}
                      disabled={!image}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 disabled:opacity-50"
                    >
                      {t("editor.reset")}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
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
                      disabled={!image}
                      className="flex items-center justify-center p-2 space-x-1.5 text-xs border border-yellow-300 rounded-lg dark:border-yellow-600/50 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 disabled:opacity-50"
                    >
                      <span className="text-base">☀️</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">
                        {t("editor.bright")}
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
                      disabled={!image}
                      className="flex items-center justify-center p-2 space-x-1.5 text-xs border rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-300 dark:border-amber-600/50 disabled:opacity-50"
                    >
                      <span className="text-base">📷</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">
                        {t("editor.vintage")}
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
                      disabled={!image}
                      className="flex items-center justify-center p-2 space-x-1.5 text-xs border border-pink-300 rounded-lg dark:border-pink-600/50 bg-gradient-to-br from-pink-100 to-primary-100 dark:from-pink-900/30 dark:to-primary-900/30 disabled:opacity-50"
                    >
                      <span className="text-base">🌈</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">
                        {t("editor.vivid")}
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
                      disabled={!image}
                      className="flex items-center justify-center p-2 space-x-1.5 text-xs border border-gray-300 rounded-lg dark:border-gray-600/50 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/30 dark:to-slate-800/30 disabled:opacity-50"
                    >
                      <span className="text-base">⚫</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">
                        {t("editor.bw")}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "basic" && (
                <div className="space-y-2.5">
                  <div className="p-2.5 border border-yellow-200 rounded-lg dark:border-yellow-600/30 bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                          ☀️ {t("editor.brightness")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-bold text-yellow-700 bg-yellow-200 rounded dark:text-yellow-300 dark:bg-yellow-800/50">
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
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="p-2.5 border rounded-lg border-primary-200 dark:border-primary-600/30 bg-primary-50 dark:bg-primary-900/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                          🔳 {t("editor.contrast")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-bold rounded text-primary-700 bg-primary-200 dark:text-primary-300 dark:bg-primary-800/50">
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
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="p-2.5 border border-pink-200 rounded-lg dark:border-pink-600/30 bg-pink-50 dark:bg-pink-900/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                          🎨 {t("editor.saturation")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-bold text-pink-700 bg-pink-200 rounded dark:text-pink-300 dark:bg-pink-800/50">
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
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "effects" && (
                <div className="space-y-2.5">
                  <div className="p-2.5 border border-indigo-200 rounded-lg dark:border-indigo-600/30 bg-indigo-50 dark:bg-indigo-900/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                          🌀 {t("editor.hue")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-200 rounded dark:text-indigo-300 dark:bg-indigo-800/50">
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
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="p-2.5 border rounded-lg bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-600/30">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                          🍂 {t("editor.sepia")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-bold rounded text-amber-700 dark:text-amber-300 bg-amber-200 dark:bg-amber-800/50">
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
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-600/30">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                          ⬜ {t("editor.grayscale")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-bold rounded text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700/50">
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
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_320px] container p-6 gap-6 mx-auto w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-[550px]">
              <CardEditor
                frameImage={frameImage}
                filters={filters}
                event_twibbon_id={twibbonData?.id}
                SubscribeData={SubscribeData}
                templateType={twibbonData?.type || "frame"}
                watermarkRequired={twibbonData?.watermark || false}
                isSubscribed={SubscribeData?.[0]?.status === "ACTIVE"}
              />
            </div>
          </div>

          {/* Desktop Filter Panel - Compact */}
          <div
            className="bg-white border border-gray-200 shadow-lg dark:border-gray-700 dark:bg-gray-800 rounded-xl overflow-y-auto max-h-[calc(100vh-8rem)] p-5"
            style={{
              opacity: image ? 1 : 0.5,
              pointerEvents: image ? "auto" : "none",
            }}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-200">
                🎨 {t("editor.filter_settings")}
              </h2>
              <button
                onClick={resetFilters}
                disabled={!image}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {t("editor.reset")}
              </button>
            </div>

            <div className="space-y-5">
              {/* Presets */}
              <div>
                <h3 className="mb-2.5 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {t("editor.filter_preset")}
                </h3>
                <div className="grid grid-cols-2 gap-2">
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
                    className="flex items-center p-2.5 space-x-2 border-2 border-yellow-300 rounded-lg dark:border-yellow-600/50 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 hover:border-yellow-400"
                  >
                    <span className="text-lg">☀️</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                      {t("editor.bright")}
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
                    className="flex items-center p-2.5 space-x-2 border-2 rounded-lg border-amber-300 dark:border-amber-600/50 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 hover:border-amber-400"
                  >
                    <span className="text-lg">📷</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                      {t("editor.vintage")}
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
                    className="flex items-center p-2.5 space-x-2 border-2 border-pink-300 rounded-lg dark:border-pink-600/50 bg-gradient-to-br from-pink-100 to-primary-100 dark:from-pink-900/30 dark:to-primary-900/30 hover:border-pink-400"
                  >
                    <span className="text-lg">🌈</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                      {t("editor.vivid")}
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
                    className="flex items-center p-2.5 space-x-2 border-2 border-gray-300 rounded-lg dark:border-gray-600/50 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/30 dark:to-slate-800/30 hover:border-gray-400"
                  >
                    <span className="text-lg">⚫</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                      {t("editor.bw")}
                    </span>
                  </button>
                </div>
              </div>

              {/* Basic Controls */}
              <div>
                <h3 className="mb-2.5 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {t("editor.basic_controls")}
                </h3>
                <div className="space-y-2.5">
                  <div className="p-2.5 border border-yellow-200 rounded-lg dark:border-yellow-600/30 bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="mb-2 text-xs font-medium text-gray-900 dark:text-gray-200">
                      ☀️ {t("editor.brightness")}
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {t("editor.brightness_desc")}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs font-medium text-yellow-700 bg-yellow-200 rounded dark:text-yellow-300 dark:bg-yellow-800/50">
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
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>

                  <div className="p-2.5 border rounded-lg border-primary-200 dark:border-primary-600/30 bg-primary-50 dark:bg-primary-900/20">
                    <div className="mb-2 text-xs font-medium text-gray-900 dark:text-gray-200">
                      🔳 {t("editor.contrast")}
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {t("editor.contrast_desc")}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs font-medium rounded text-primary-700 bg-primary-200 dark:text-primary-300 dark:bg-primary-800/50">
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
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>

                  <div className="p-2.5 border border-pink-200 rounded-lg dark:border-pink-600/30 bg-pink-50 dark:bg-pink-900/20">
                    <div className="mb-2 text-xs font-medium text-gray-900 dark:text-gray-200">
                      🎨 {t("editor.saturation")}
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {t("editor.saturation_desc")}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs font-medium text-pink-700 bg-pink-200 rounded dark:text-pink-300 dark:bg-pink-800/50">
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
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Controls */}
              <div>
                <h3 className="mb-2.5 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {t("editor.advanced_controls")}
                </h3>
                <div className="space-y-2.5">
                  <div className="p-2.5 border border-indigo-200 rounded-lg dark:border-indigo-600/30 bg-indigo-50 dark:bg-indigo-900/20">
                    <div className="mb-2 text-xs font-medium text-gray-900 dark:text-gray-200">
                      🌀 {t("editor.hue")}
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {t("editor.hue_desc")}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-200 rounded dark:text-indigo-300 dark:bg-indigo-800/50">
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
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>

                  <div className="p-2.5 border rounded-lg bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-600/30">
                    <div className="mb-2 text-xs font-medium text-gray-900 dark:text-gray-200">
                      ✨ {t("editor.effects")}
                    </div>
                    <div className="mb-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          🍂 {t("editor.sepia")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded text-amber-700 dark:text-amber-300 bg-amber-200 dark:bg-amber-800/50">
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
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          ⬜ {t("editor.grayscale")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700/50">
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
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
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
