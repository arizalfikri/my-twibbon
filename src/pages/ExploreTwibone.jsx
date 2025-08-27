import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Filter,
  Grid,
  List,
  Search,
  ImageOff,
  Palette,
  Heart,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import CardHome from "../components/cards/CardHome";
import { useGET } from "../services/api.js";
import { useLocation, useSearchParams } from "react-router-dom";

function ExploreTwibone() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const searchFromUrl = searchParams.get("search") || "";
  
  const displaySearchQuery = searchFromUrl ? decodeURIComponent(searchFromUrl).trim() : "";

  const { data, isLoading, refetch } = useGET(
    searchFromUrl ? `twibbons?q=${encodeURIComponent(searchFromUrl)}` : "twibbons"
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

  // Sort logic (API handles search, we only handle sorting)
  const sortedTwibbons = [...twibbonData].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "popular":
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  // Update search query and URL
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      // Use cleaner URL params without excessive encoding
      const cleanValue = value.trim().replace(/\s+/g, ' ');
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
            <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
              <div className="w-16 h-16 border-4 border-purple-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800">
                Memuat Twibone...
              </h3>
              <p className="leading-relaxed text-gray-600">
                Sedang mengambil koleksi twibone untuk Anda.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (searchFromUrl && sortedTwibbons.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-8 py-20 col-span-full">
          <div className="max-w-md space-y-6 text-center">
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                <Search className="w-16 h-16 text-blue-400" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800">
                Tidak Ditemukan
              </h3>
              <p className="leading-relaxed text-gray-600">
                Tidak ada twibone yang cocok dengan pencarian "{displaySearchQuery}".
                Coba kata kunci lain atau hapus filter.
              </p>
            </div>
            <button
              onClick={clearSearch}
              className="px-6 py-3 font-semibold text-purple-700 transition-all duration-300 border-2 border-purple-200 rounded-full hover:bg-purple-50"
            >
              Hapus Pencarian
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center px-8 py-20 col-span-full">
        <div className="max-w-md space-y-6 text-center">
          <div className="relative">
            <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
              <ImageOff className="w-16 h-16 text-purple-400" />
            </div>
            <div className="absolute flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full -top-2 -right-2 animate-bounce">
              <Palette className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="absolute flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full -bottom-2 -left-2 animate-pulse">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">
              Belum Ada Twibone Tersedia
            </h3>
            <p className="leading-relaxed text-gray-600">
              Sepertinya belum ada twibone yang tersedia saat ini. Jadilah yang
              pertama untuk membuat dan membagikan karya kreatif Anda!
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="px-4 py-8 mx-auto max-w-screen-2xl">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative md:hidden">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Cari twibone..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4C0D68] focus:border-transparent"
                />
                {/* Clear button untuk mobile search */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="items-center hidden gap-8 mb-4 md:flex">
                <p className="text-xl font-bold text-gray-600">
                  {isLoading
                    ? "Memuat..."
                    : searchFromUrl
                    ? `Menampilkan ${sortedTwibbons.length} hasil untuk "${displaySearchQuery}"`
                    : `Menampilkan ${sortedTwibbons.length} twibone`}
                </p>
                {searchFromUrl && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-purple-600 hover:text-purple-800"
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
                      ? "bg-[#4C0D68] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-[#4C0D68] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <p className="text-gray-600">
              {isLoading
                ? "Memuat..."
                : searchFromUrl
                ? `Menampilkan ${sortedTwibbons.length} hasil untuk "${displaySearchQuery}"`
                : `Menampilkan ${sortedTwibbons.length} twibone`}
            </p>
            {searchFromUrl && (
              <button
                onClick={clearSearch}
                className="text-sm text-purple-600 hover:text-purple-800"
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
          {sortedTwibbons.length === 0
            ? renderEmptyState()
            : sortedTwibbons.map((twibon) => (
                <CardHome
                  key={twibon.id}
                  twibon={{
                    id: twibon.id,
                    title: twibon.title || "Tanpa Judul",
                    author: twibon?.contributor?.fullname||"Gypem",
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
        {sortedTwibbons.length > 0 && sortedTwibbons.length >= 20 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => refetch()}
              className="bg-[#4C0D68] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6B1E7A] transition-colors"
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