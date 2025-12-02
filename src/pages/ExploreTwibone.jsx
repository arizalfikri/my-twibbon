import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import CardHome from "../components/cards/CardHome";
import CardUser from "../components/cards/CardUser";
import SmoothDropdown from "../components/buttons/SmoothDropdown.jsx";

import { useGET } from "../services/api.js";
import { useSearchParams } from "react-router-dom";
import EmptyTwibbon from "../components/common/EmptyTwibbon.jsx";
import { useTranslation } from "react-i18next";

function ExploreTwibone() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState("twibbon");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [allTwibbons, setAllTwibbons] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchFromUrl = searchParams.get("search") || "";
  const sortFromUrl = searchParams.get("sort") || "newest";
  const observerTarget = useRef(null);

  const displaySearchQuery = searchFromUrl
    ? decodeURIComponent(searchFromUrl).trim()
    : "";

  // API URL construction
  const getApiUrl = useCallback(() => {
    const baseParams =
      selectedTab === "twibbon"
        ? `twibbons?page=${currentPage}&sort=${sortBy}${
            typeFilter ? `&type=${typeFilter}` : ""
          }`
        : `users?page=${currentPage}`;

    return searchFromUrl
      ? baseParams.replace("?", `?q=${encodeURIComponent(searchFromUrl)}&`)
      : baseParams;
  }, [selectedTab, currentPage, sortBy, typeFilter, searchFromUrl]);

  const { data, isLoading, refetch } = useGET(getApiUrl());

  // Reset state when filters change
  useEffect(() => {
    setCurrentPage(1);
    selectedTab === "twibbon" ? setAllTwibbons([]) : setAllUsers([]);
  }, [searchFromUrl, sortBy, selectedTab, typeFilter]);

  // Initialize from URL parameters
  useEffect(() => {
    if (
      sortFromUrl &&
      (sortFromUrl === "popular" || sortFromUrl === "newest")
    ) {
      setSortBy(sortFromUrl);
    }
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl) setTypeFilter(typeFromUrl);
  }, []);

  // Update data from API response
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      const newData = data.data;
      const pagination = data.pagination;

      if (currentPage === 1) {
        selectedTab === "twibbon"
          ? setAllTwibbons(newData)
          : setAllUsers(newData);
      } else {
        selectedTab === "twibbon"
          ? setAllTwibbons((prev) => [...prev, ...newData])
          : setAllUsers((prev) => [...prev, ...newData]);
      }

      setHasNextPage(pagination?.has_next || false);
    }
    setIsLoadingMore(false);
  }, [data, currentPage, selectedTab]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isLoading &&
          !isLoadingMore
        ) {
          setIsLoadingMore(true);
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isLoading, isLoadingMore]);

  // Search and filter handlers
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const params = { sort: sortBy };
    if (typeFilter) params.type = typeFilter;
    if (value.trim()) params.search = value.trim().replace(/\s+/g, " ");
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateUrlParams({ sort: newSort });
  };

  const handleTypeFilterChange = (newType) => {
    setTypeFilter(newType || null);
    updateUrlParams({ type: newType || "" });
  };

  const updateUrlParams = (updates) => {
    const params = { ...updates };
    if (searchFromUrl) params.search = searchFromUrl;
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchParams({ sort: sortBy });
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
    setAllTwibbons([]);
    setAllUsers([]);
    setSearchQuery("");
    setSearchParams({ sort: sortBy });
  };

  const renderEmptyState = () => {
    if (isLoading && currentPage === 1) {
      return <LoadingState selectedTab={selectedTab} t={t} />;
    }

    if (searchFromUrl && currentData.length === 0) {
      return (
        <SearchEmptyState
          selectedTab={selectedTab}
          displaySearchQuery={displaySearchQuery}
          clearSearch={clearSearch}
          t={t}
        />
      );
    }

    return <EmptyTwibbon />;
  };

  const renderLoadingMore = () => {
    if (!isLoadingMore) return null;
    return <LoadingMoreIndicator t={t} />;
  };

  const currentData = selectedTab === "twibbon" ? allTwibbons : allUsers;
  const gridCols =
    selectedTab === "twibbon"
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <TabButtons
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
            />

            {selectedTab === "twibbon" && (
              <FilterSection
                sortBy={sortBy}
                typeFilter={typeFilter}
                onSortChange={handleSortChange}
                onTypeFilterChange={handleTypeFilterChange}
                t={t}
              />
            )}
          </div>
        </div>
      </div>

      <main className="container px-4 py-8 mx-auto">
        <div className={`grid gap-6 ${gridCols}`}>
          {currentData.length === 0 && isLoading && currentPage === 1
            ? renderEmptyState()
            : currentData.length === 0 && searchFromUrl
            ? renderEmptyState()
            : currentData.length > 0
            ? selectedTab === "twibbon"
              ? allTwibbons.map((twibon) => (
                  <CardHome
                    key={twibon.id}
                    twibon={{
                      id: twibon.id,
                      title: twibon.title || t("explore.untitled"),
                      author: twibon?.contributor?.fullname || "Gypem",
                      supports: twibon?.supports || 0,
                      slug: twibon.slug_event_twibbon,
                      image: twibon.thumbnail,
                      date: twibon.createdAt,
                      username: twibon?.contributor?.username || "",
                      isSupport: sortBy === "popular",
                    }}
                  />
                ))
              : allUsers.map((user) => <CardUser key={user.id} User={user} />)
            : !isLoading && <EmptyTwibbon />}

          {renderLoadingMore()}
        </div>

        {hasNextPage && currentData.length > 0 && (
          <div ref={observerTarget} className="h-10" />
        )}

        {!hasNextPage && currentData.length > 0 && !isLoadingMore && (
          <EndOfResultsMessage t={t} />
        )}
      </main>

      <Footer />
    </div>
  );
}

// Extracted Components
const TabButtons = ({ selectedTab, onTabChange }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = (tab) => {
    if (isTransitioning || selectedTab === tab) return;
    setIsTransitioning(true);
    onTabChange(tab);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
      {["twibbon", "creator"].map((tab) => (
        <button
          key={tab}
          onClick={() => handleClick(tab)}
          disabled={isTransitioning}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selectedTab === tab
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {tab === "twibbon" ? "Twibbons" : "Creators"}
        </button>
      ))}
    </div>
  );
};

const FilterSection = ({
  sortBy,
  typeFilter,
  onSortChange,
  onTypeFilterChange,
  t,
}) => (
  <div className="flex flex-col gap-4 md:flex md:flex-row md:items-center md:justify-end">
    <div className="w-auto">
      <SmoothDropdown
        value={sortBy}
        onChange={onSortChange}
        options={[
          { value: "newest", label: t("explore.sort_newest") || "Terbaru" },
          { value: "popular", label: t("explore.sort_popular") || "Populer" },
        ]}
      />
    </div>

    <div className="w-auto">
      <SmoothDropdown
        value={typeFilter || ""}
        onChange={onTypeFilterChange}
        options={[
          { value: "", label: t("explore.filter_all") || "Semua" },
          {
            value: "background",
            label: t("explore.filter_background") || "Background",
          },
          { value: "frame", label: t("explore.filter_frame") || "Frame" },
        ]}
      />
    </div>
  </div>
)


const LoadingState = ({ selectedTab, t }) => (
  <div className="flex flex-col col-span-full justify-center items-center px-8 py-20">
    <div className="space-y-6 max-w-md text-center">
      <div className="flex justify-center items-center mx-auto w-32 h-32 bg-gradient-to-br to-pink-100 rounded-full from-primary-100 dark:from-primary-900/30 dark:to-pink-900/30">
        <div className="w-16 h-16 rounded-full border-4 animate-spin border-primary-400 dark:border-primary-500 border-t-transparent"></div>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {selectedTab === "twibbon"
            ? t("explore.loading_twibone")
            : t("explore.loading_creators")}
        </h3>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          {selectedTab === "twibbon"
            ? t("explore.loading_collection")
            : t("explore.loading_users")}
        </p>
      </div>
    </div>
  </div>
);

const SearchEmptyState = ({
  selectedTab,
  displaySearchQuery,
  clearSearch,
  t,
}) => (
  <div className="flex flex-col col-span-full justify-center items-center px-8 py-20">
    <div className="space-y-6 max-w-md text-center">
      <div className="relative">
        <div className="flex justify-center items-center mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 rounded-full to-primary-100 dark:from-blue-900/30 dark:to-primary-900/30">
          <Search className="w-16 h-16 text-blue-400 dark:text-blue-500" />
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t("explore.not_found")}
        </h3>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          {selectedTab === "twibbon"
            ? t("explore.no_results", { query: displaySearchQuery })
            : t("explore.no_users", { query: displaySearchQuery })}
        </p>
      </div>
      <button
        onClick={clearSearch}
        className="px-6 py-3 font-semibold rounded-full border-2 transition-all duration-300 text-primary-700 border-primary-200 dark:text-primary-400 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
      >
        {t("explore.clear_search")}
      </button>
    </div>
  </div>
);

const LoadingMoreIndicator = ({ t }) => (
  <div className="flex col-span-full justify-center items-center py-8">
    <div className="flex gap-3 items-center">
      <div className="w-8 h-8 rounded-full border-4 animate-spin border-primary-400 dark:border-primary-500 border-t-transparent"></div>
      <span className="text-gray-600 dark:text-gray-400">
        {t("explore.loading_more") || "Loading more..."}
      </span>
    </div>
  </div>
);

const EndOfResultsMessage = ({ t }) => (
  <div className="py-8 text-center">
    <p className="text-gray-500 dark:text-gray-400">
      {t("explore.end_of_results") || "You've reached the end of the results"}
    </p>
  </div>
);

export default ExploreTwibone;
