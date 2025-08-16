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
    grayscale: 0
  });

  const [activeTab, setActiveTab] = useState('basic');

  // Update individual filter
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
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
      grayscale: 0
    });
  };

  useEffect(() => {
    if (!image) {
      navigate("/");
    }
  }, [image, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-fit bg-gray-50">
        <NavbarEditor title={twibbonData?.title}/>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="h-[calc(100vh-64px-320px)] flex flex-col">
            <CardEditor frameImage={frameImage} filters={filters} />
          </div>
          
          {/* Mobile Filter Panel */}
          <div className="p-4 bg-white border-t border-gray-200">
            {/* Mobile Tabs */}
            <div className="flex p-1 mb-4 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'presets' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                🎨 Preset
              </button>
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'basic' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                ⚙️ Dasar
              </button>
              <button
                onClick={() => setActiveTab('effects')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'effects' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                ✨ Efek
              </button>
            </div>

            {/* Mobile Content */}
            <div className="overflow-y-auto max-h-64">
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800">Filter Preset</h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFilters({ brightness: 120, contrast: 110, saturation: 130, hue: 0, blur: 0, sepia: 0, grayscale: 0 })}
                      className="flex items-center justify-center p-3 space-x-2 transition-all border border-yellow-200 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100"
                    >
                      <span>☀️</span>
                      <span className="text-sm font-medium">Cerah</span>
                    </button>
                    <button
                      onClick={() => setFilters({ brightness: 80, contrast: 120, saturation: 80, hue: 0, blur: 0, sepia: 30, grayscale: 0 })}
                      className="flex items-center justify-center p-3 space-x-2 transition-all border rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:from-amber-100 hover:to-yellow-100"
                    >
                      <span>📷</span>
                      <span className="text-sm font-medium">Vintage</span>
                    </button>
                    <button
                      onClick={() => setFilters({ brightness: 90, contrast: 110, saturation: 150, hue: -10, blur: 0, sepia: 0, grayscale: 0 })}
                      className="flex items-center justify-center p-3 space-x-2 transition-all border border-pink-200 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100"
                    >
                      <span>🌈</span>
                      <span className="text-sm font-medium">Vivid</span>
                    </button>
                    <button
                      onClick={() => setFilters({ brightness: 100, contrast: 100, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100 })}
                      className="flex items-center justify-center p-3 space-x-2 transition-all border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100"
                    >
                      <span>⚫</span>
                      <span className="text-sm font-medium">B&W</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'basic' && (
                <div className="space-y-4">
                  {/* Brightness Control */}
                  <div className="p-3 border border-yellow-100 rounded-lg bg-yellow-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">☀️ Kecerahan</span>
                        <span className="px-2 py-1 text-sm font-bold text-yellow-700 bg-yellow-100 rounded">{filters.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.brightness}
                        onChange={(e) => updateFilter('brightness', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Contrast Control */}
                  <div className="p-3 border border-purple-100 rounded-lg bg-purple-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">🔳 Kontras</span>
                        <span className="px-2 py-1 text-sm font-bold text-purple-700 bg-purple-100 rounded">{filters.contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.contrast}
                        onChange={(e) => updateFilter('contrast', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Saturation Control */}
                  <div className="p-3 border border-pink-100 rounded-lg bg-pink-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">🎨 Saturasi</span>
                        <span className="px-2 py-1 text-sm font-bold text-pink-700 bg-pink-100 rounded">{filters.saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.saturation}
                        onChange={(e) => updateFilter('saturation', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'effects' && (
                <div className="space-y-4">
                  {/* Hue Control */}
                  <div className="p-3 border border-indigo-100 rounded-lg bg-indigo-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">🌀 Rona Warna</span>
                        <span className="px-2 py-1 text-sm font-bold text-indigo-700 bg-indigo-100 rounded">{filters.hue}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={filters.hue}
                        onChange={(e) => updateFilter('hue', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  

                  {/* Sepia */}
                  <div className="p-3 border rounded-lg bg-amber-50 border-amber-100">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">🍂 Sepia</span>
                        <span className="px-2 py-1 text-sm font-bold rounded text-amber-700 bg-amber-100">{filters.sepia}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.sepia}
                        onChange={(e) => updateFilter('sepia', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Grayscale */}
                  <div className="p-3 border rounded-lg bg-slate-50 border-slate-100">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">⬜ Grayscale</span>
                        <span className="px-2 py-1 text-sm font-bold rounded text-slate-700 bg-slate-100">{filters.grayscale}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.grayscale}
                        onChange={(e) => updateFilter('grayscale', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden gap-6 p-6 mx-auto md:grid md:grid-cols-2 max-w-7xl">
          <div className="">
            <CardEditor frameImage={frameImage} filters={filters} />
          </div>
          
          {/* Enhanced Settings Panel */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">🎨 Filter & Pengaturan</h2>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Reset
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[600px]">
              {/* Preset Filters */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-800">Filter Preset</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFilters({ brightness: 120, contrast: 110, saturation: 130, hue: 0, blur: 0, sepia: 0, grayscale: 0 })}
                    className="flex items-center p-4 space-x-3 transition-all border-2 border-yellow-200 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 hover:border-yellow-300"
                  >
                    <span className="text-2xl">☀️</span>
                    <span className="font-medium text-gray-700">Cerah</span>
                  </button>
                  <button
                    onClick={() => setFilters({ brightness: 80, contrast: 120, saturation: 80, hue: 0, blur: 0, sepia: 30, grayscale: 0 })}
                    className="flex items-center p-4 space-x-3 transition-all border-2 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-300"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="font-medium text-gray-700">Vintage</span>
                  </button>
                  <button
                    onClick={() => setFilters({ brightness: 90, contrast: 110, saturation: 150, hue: -10, blur: 0, sepia: 0, grayscale: 0 })}
                    className="flex items-center p-4 space-x-3 transition-all border-2 border-pink-200 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 hover:border-pink-300"
                  >
                    <span className="text-2xl">🌈</span>
                    <span className="font-medium text-gray-700">Vivid</span>
                  </button>
                  <button
                    onClick={() => setFilters({ brightness: 100, contrast: 100, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100 })}
                    className="flex items-center p-4 space-x-3 transition-all border-2 border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300"
                  >
                    <span className="text-2xl">⚫</span>
                    <span className="font-medium text-gray-700">B&W</span>
                  </button>
                </div>
              </div>

              {/* Basic Controls */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-800">Kontrol Dasar</h3>
                <div className="space-y-4">
                  {/* Brightness Control */}
                  <div className="p-4 border border-yellow-100 rounded-lg bg-yellow-50">
                    <h4 className="mb-3 font-medium text-gray-700">☀️ Brightness</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Kecerahan</span>
                        <span className="px-2 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded">{filters.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.brightness}
                        onChange={(e) => updateFilter('brightness', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Contrast Control */}
                  <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
                    <h4 className="mb-3 font-medium text-gray-700">🔳 Contrast</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Kontras</span>
                        <span className="px-2 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded">{filters.contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.contrast}
                        onChange={(e) => updateFilter('contrast', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Saturation Control */}
                  <div className="p-4 border border-pink-100 rounded-lg bg-pink-50">
                    <h4 className="mb-3 font-medium text-gray-700">🎨 Saturation</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Saturasi</span>
                        <span className="px-2 py-1 text-sm font-medium text-pink-700 bg-pink-100 rounded">{filters.saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.saturation}
                        onChange={(e) => updateFilter('saturation', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Controls */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-800">Kontrol Lanjut</h3>
                <div className="space-y-4">
                  {/* Hue Control */}
                  <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50">
                    <h4 className="mb-3 font-medium text-gray-700">🌀 Hue</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rona Warna</span>
                        <span className="px-2 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded">{filters.hue}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={filters.hue}
                        onChange={(e) => updateFilter('hue', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

            
                  {/* Effect Controls */}
                  <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
                    <h4 className="mb-3 font-medium text-gray-700">✨ Efek</h4>
                    
                    {/* Sepia */}
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">🍂 Sepia</span>
                        <span className="px-2 py-1 text-sm font-medium rounded text-amber-700 bg-amber-100">{filters.sepia}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.sepia}
                        onChange={(e) => updateFilter('sepia', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Grayscale */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">⬜ Grayscale</span>
                        <span className="px-2 py-1 text-sm font-medium rounded text-slate-700 bg-slate-100">{filters.grayscale}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.grayscale}
                        onChange={(e) => updateFilter('grayscale', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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