import React, { useEffect, useState } from "react";
import {
  Grid,
  List,
  Search,
  X,
} from "lucide-react";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import CardHome from "../components/cards/CardHome";
import { useGET } from "../services/api.js";
import { useLocation, useSearchParams } from "react-router-dom";
import EmptyTwibbon from "../components/common/EmptyTwibbon.jsx";

function ExploreTwibone() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const searchFromUrl = searchParams.get("search") || "";

  const displaySearchQuery = searchFromUrl
    ? decodeURIComponent(searchFromUrl).trim()
    : "";

  const { data, isLoading, refetch } = useGET(
    searchFromUrl
      ? `twibbons?q=${encodeURIComponent(searchFromUrl)}`
      : "twibbons"
  );

  // Set default view mode sekali aja saat mount
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setViewMode("list");
    } else {
      setViewMode("grid");
    }
  }, []);

  // Handle URL search parameters
  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(displaySearchQuery);
    } else {
      setSearchQuery("");
    }
  }, [searchFromUrl, displaySearchQuery]);

  const twibbonData = data?.data || [];

  // Update search query and URL
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      // Use cleaner URL params without excessive encoding
      const cleanValue = value.trim().replace(/\s+/g, " ");
      setSearchParams({ search: cleanValue });
    } else {
      setSearchParams({});
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center px-8 py-20 col-span-full">
          <div className="max-w-md space-y-6 text-center">
            <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <div className="w-16 h-16 border-4 border-purple-400 rounded-full dark:border-purple-500 border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Memuat Twibone...
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Sedang mengambil koleksi twibone untuk Anda.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ✅ Jika ada search tapi tidak ada data → tampilkan empty state pencarian
    if (searchFromUrl && twibbonData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-8 py-20 col-span-full">
          <div className="max-w-md space-y-6 text-center">
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                <Search className="w-16 h-16 text-blue-400 dark:text-blue-500" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Tidak Ditemukan
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Tidak ada twibone yang cocok dengan pencarian "
                {displaySearchQuery}". Coba kata kunci lain atau hapus filter.
              </p>
            </div>
            <button
              onClick={clearSearch}
              className="px-6 py-3 font-semibold text-purple-700 transition-all duration-300 border-2 border-purple-200 rounded-full dark:text-purple-400 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              Hapus Pencarian
            </button>
          </div>
        </div>
      );
    }

    // ✅ Jika tidak ada search & kosong → pakai empty state dari Homepage
    return <EmptyTwibbon />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <main className="px-4 py-8 mx-auto max-w-screen-2xl">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative md:hidden">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 dark:text-gray-500 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Cari twibone..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#4C0D68] dark:focus:ring-[#8B3A9C] focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
                {/* Clear button untuk mobile search */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute text-gray-400 transform -translate-y-1/2 dark:text-gray-500 right-3 top-1/2 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="items-center hidden gap-8 mb-4 md:flex">
                <p className="text-xl font-bold text-gray-600 dark:text-gray-300">
                  {isLoading
                    ? "Memuat..."
                    : searchFromUrl
                    ? `Menampilkan ${twibbonData.length} hasil untuk "${displaySearchQuery}"`
                    : `Menampilkan ${twibbonData.length} twibone`}
                </p>
                {searchFromUrl && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                  >
                    Hapus pencarian
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#4C0D68] dark:bg-[#6B1E7A] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-[#4C0D68] dark:bg-[#6B1E7A] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4 md:hidden ">
            <p className="text-gray-600 dark:text-gray-300">
              {isLoading
                ? "Memuat..."
                : searchFromUrl
                ? `Menampilkan ${twibbonData.length} hasil untuk "${displaySearchQuery}"`
                : `Menampilkan ${twibbonData.length} twibone`}
            </p>
            {searchFromUrl && (
              <button
                onClick={clearSearch}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        </div>

        {/* Twibon Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
              : "space-y-4"
          }`}
        >
          {twibbonData.length === 0
            ? renderEmptyState()
            : twibbonData.map((twibon) => (
                <CardHome
                  key={twibon.id}
                  twibon={{
                    id: twibon.id,
                    title: twibon.title || "Tanpa Judul",
                    author: twibon?.contributor?.fullname || "Gypem",
                    User: 0,
                    slug: twibon.slug_event_twibbon,
                    image: twibon.template_twibbon,
                    isNew: false,
                    isTrending: false,
                  }}
                  isGrid={viewMode === "grid"}
                />
              ))}
        </div>

        {/* Load More Button - if you want pagination */}
        {twibbonData.length > 0 && twibbonData.length >= 20 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => refetch()}
              className="bg-[#4C0D68] dark:bg-[#6B1E7A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6B1E7A] dark:hover:bg-[#8B3A9C] transition-colors"
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ExploreTwibone;