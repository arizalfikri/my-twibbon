import React, { useEffect, useState, useRef, useCallback } from "react";
import { Grid, List, Search, X } from "lucide-react";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import CardHome from "../components/cards/CardHome";
import { useGET } from "../services/api.js";
import { useLocation, useSearchParams } from "react-router-dom";
import EmptyTwibbon from "../components/common/EmptyTwibbon.jsx";
import { useTranslation } from "react-i18next";

function ExploreTwibone() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [allTwibbons, setAllTwibbons] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchFromUrl = searchParams.get("search") || "";
  const observerTarget = useRef(null);

  const displaySearchQuery = searchFromUrl
    ? decodeURIComponent(searchFromUrl).trim()
    : "";

  // Construct URL dengan page
  const apiUrl = searchFromUrl
    ? `twibbons?q=${encodeURIComponent(searchFromUrl)}&page=${currentPage}`
    : `twibbons?page=${currentPage}`;

  const { data, isLoading, refetch } = useGET(apiUrl);

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

  // Reset pagination saat search berubah
  useEffect(() => {
    setCurrentPage(1);
    setAllTwibbons([]);
  }, [searchFromUrl]);

  // Update data saat response datang
  useEffect(() => {
    if (data?.data) {
      const newTwibbons = data.data;
      const pagination = data.pagination;

      if (currentPage === 1) {
        setAllTwibbons(newTwibbons);
      } else {
        setAllTwibbons(prev => [...prev, ...newTwibbons]);
      }

      setHasNextPage(pagination?.has_next || false);
      setIsLoadingMore(false);
    }
  }, [data, currentPage]);

  // Intersection Observer untuk infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading && !isLoadingMore) {
          setIsLoadingMore(true);
          setCurrentPage(prev => prev + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' 
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isLoading, isLoadingMore]);

  // Update search query and URL
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
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
    if (isLoading && currentPage === 1) {
      return (
        <div className="flex flex-col items-center justify-center px-8 py-20 col-span-full">
          <div className="max-w-md space-y-6 text-center">
            <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-pink-100 dark:from-primary-900/30 dark:to-pink-900/30">
              <div className="w-16 h-16 border-4 rounded-full border-primary-400 dark:border-primary-500 border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {t("explore.loading_twibone")}
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                {t("explore.loading_collection")}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Jika ada search tapi tidak ada data → tampilkan empty state pencarian
    if (searchFromUrl && allTwibbons.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-8 py-20 col-span-full">
          <div className="max-w-md space-y-6 text-center">
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30">
                <Search className="w-16 h-16 text-blue-400 dark:text-blue-500" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {t("explore.not_found")}
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                {t("explore.no_results", { query: displaySearchQuery })}
              </p>
            </div>
            <button
              onClick={clearSearch}
              className="px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-full text-primary-700 border-primary-200 dark:text-primary-400 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              {t("explore.clear_search")}
            </button>
          </div>
        </div>
      );
    }

    // Jika tidak ada search & kosong → pakai empty state dari Homepage
    return <EmptyTwibbon />;
  };

  const renderLoadingMore = () => {
    if (!isLoadingMore) return null;

    return (
      <div className="flex items-center justify-center py-8 col-span-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 rounded-full border-primary-400 dark:border-primary-500 border-t-transparent animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400">
            {t("explore.loading_more") || "Loading more..."}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <main className="max-w-screen-lg px-4 py-8 mx-auto">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative md:hidden">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 dark:text-gray-500 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#4C0D68] dark:focus:ring-[#8B3A9C] focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
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
                  {isLoading && currentPage === 1
                    ? t("explore.loading")
                    : searchFromUrl
                    ? t("explore.showing_search_results", {
                        count: allTwibbons.length,
                        query: displaySearchQuery,
                      })
                    : t("explore.showing_twibone", {
                        count: allTwibbons.length,
                      })}
                </p>
                {searchFromUrl && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    {t("explore.clear_search")}
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
                        ? "bg-primary-500 dark:bg-primary-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                         ? "bg-primary-500 dark:bg-primary-600 text-white shadow-md"
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
              {isLoading && currentPage === 1
                ? t("explore.loading")
                : searchFromUrl
                ? t("explore.showing_search_results", {
                    count: allTwibbons.length,
                    query: displaySearchQuery,
                  })
                : t("explore.showing_twibone", { count: allTwibbons.length })}
            </p>
            {searchFromUrl && (
              <button
                onClick={clearSearch}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
              >
                {t("explore.clear_search")}
              </button>
            )}
          </div>
        </div>

        {/* Twibon Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {allTwibbons.length === 0
            ? renderEmptyState()
            : allTwibbons.map((twibon) => (
                <CardHome
                  key={twibon.id}
                  twibon={{
                    id: twibon.id,
                    title: twibon.title || t("explore.untitled"),
                    author: twibon?.contributor?.fullname || "Gypem",
                    supports: twibon?.supports || 0,
                    slug: twibon.slug_event_twibbon,
                    image: twibon.template_twibbon,
                    isNew: false,
                    isTrending: false,
                  }}
                  isGrid={viewMode === "grid"}
                />
              ))}
          
          {/* Loading More Indicator */}
          {renderLoadingMore()}
        </div>

        {/* Intersection Observer Target - invisible element untuk trigger load more */}
        {hasNextPage && allTwibbons.length > 0 && (
          <div ref={observerTarget} className="h-10" />
        )}

        {/* End of Results Message */}
        {!hasNextPage && allTwibbons.length > 0 && !isLoadingMore && (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t("explore.end_of_results") || "You've reached the end of the results"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ExploreTwibone;