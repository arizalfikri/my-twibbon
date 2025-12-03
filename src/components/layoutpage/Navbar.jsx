import {
  Search,
  Plus,
  Menu,
  X,
  User,
  Moon,
  Compass,
  Crown,
  ReceiptText,
  BarChart3,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import logoIcon from "../../assets/images/logo/Logo_Icon.png";
import logo from "../../assets/images/logo/Logo_putih.png";

import {
  useNavigate,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useGlobalStore } from "../../helper/store/global.store";
import { useSubscriptionStore } from "../../helper/store/subscription.store";
import ModalLogout from "../modal/ModalLogout";
import { useThemeStore } from "../../helper/store/theme.store";
import { useTranslation } from "react-i18next";
import FLAGID from "../../assets/images/indonesiaflag.png";
import FLAGEN from "../../assets/images/amerikaflag.png";
import ModalTwibbonChoice from "../modal/ModalTwibbonChoise";
import { useGET } from "../../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileSearchMode, setIsMobileSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { email, token, fullname, role } = useGlobalStore();
  const { hasActiveContributor, setSubscriptions, isLoaded } =
    useSubscriptionStore();
  const { theme, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  // Fetch subscription data only when user is logged in
  const { data: subscriptionData } = useGET("/detail-subscription", {
    enabled: !!token && !isLoaded, // Only fetch if token exists and not already loaded
  });

  // Update subscription store when data is fetched
  useEffect(() => {
    if (subscriptionData?.data) {
      setSubscriptions(subscriptionData.data);
    }
  }, [subscriptionData, setSubscriptions]);

  useEffect(() => {
    if (!email && localStorage.getItem("email")) {
      useGlobalStore.setState({
        email: localStorage.getItem("email"),
        fullname: localStorage.getItem("fullname"),
        role: localStorage.getItem("role"),
        token: localStorage.getItem("token"),
      });
    }
  }, []);

  useEffect(() => {
    if (location.pathname === "/explore") {
      const searchFromUrl = searchParams.get("search");
      if (searchFromUrl) {
        setSearchQuery(decodeURIComponent(searchFromUrl));
      } else {
        setSearchQuery("");
      }
    }
  }, [searchParams, location.pathname]);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsSidebarOpen(false);
  };

  const handleMobileSearchToggle = () => {
    setIsMobileSearchMode(!isMobileSearchMode);
    if (isMobileSearchMode) {
      setSearchQuery("");
    }
  };

  const handleCancelSearch = () => {
    setIsMobileSearchMode(false);
    setSearchQuery("");
    if (location.pathname === "/explore") {
      setSearchParams({});
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const cleanQuery = searchQuery.trim().replace(/\s+/g, " ");
      navigate(`/explore?search=${cleanQuery}`);
      setIsMobileSearchMode(false);
    } else if (location.pathname === "/explore") {
      setSearchParams({});
      setIsMobileSearchMode(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (location.pathname === "/explore" && window.innerWidth >= 768) {
      if (value.trim()) {
        setSearchParams({ search: value.trim() });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleDesktopSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const cleanQuery = searchQuery.trim().replace(/\s+/g, " ");
      navigate(`/explore?search=${cleanQuery}`);
    } else if (location.pathname === "/explore") {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (location.pathname === "/explore") {
      setSearchParams({});
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "id" ? "en" : "id";
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 py-4 text-white bg-primary-600 dark:bg-gray-900 dark:border-b dark:border-gray-600">
        <div className="container">
          <div className="flex justify-between items-center">
            {isMobileSearchMode ? (
              <div className="flex items-center space-x-3 w-full md:hidden">
                <form onSubmit={handleSearch} className="relative flex-1">
                  <input
                    type="text"
                    placeholder={t("search_placeholder")}
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                    autoFocus
                    className="px-4 py-2 pr-4 pl-10 w-full placeholder-gray-300 text-white rounded-full border bg-primary-500 border-primary-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 text-gray-300 transform -translate-y-1/2 hover:text-white"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
                <button
                  onClick={handleCancelSearch}
                  className="text-white whitespace-nowrap hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                  <div className="flex justify-center items-center w-32 h-10 md:w-56">
                    <img
                      src={logo}
                      alt="Logo"
                      className="object-contain h-fit"
                    />
                  </div>
                </Link>

                {/* Desktop Search */}
                <div className="hidden flex-1 mx-8 max-w-md md:flex">
                  <form
                    onSubmit={handleDesktopSearch}
                    className="relative w-full"
                  >
                    <input
                      type="text"
                      placeholder={t("search_placeholder")}
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="px-4 py-2 pr-10 pl-10 w-full placeholder-gray-500 text-gray-500 bg-white rounded-full border border-primary-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="absolute left-3 top-1/2 text-gray-300 transform -translate-y-1/2 hover:text-white"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 text-gray-300 transform -translate-y-1/2 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </form>
                </div>

                {/* Desktop Right */}
                <div className="hidden items-center space-x-2 md:flex">
                  <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center px-4 py-2 mx-1 space-x-2 font-semibold text-white rounded-full transition-colors bg-primary-300 hover:bg-primary-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden capitalize lg:inline">
                      {t("add_twibone")}
                    </span>
                    <span className="lg:hidden">{t("add")}</span>
                  </button>

                  {/* <button onClick={toggleLanguage}>
                    <img
                      src={i18n.language.startsWith("id") ? FLAGID : FLAGEN}
                      alt={i18n.language}
                      className="w-8 h-8 rounded-full"
                    />
                  </button> */}
                  <button
                    className="p-2 rounded-full transition-colors hover:bg-primary-700"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Right */}
                <div className="flex items-center space-x-2 md:hidden">
                  <button
                    onClick={handleMobileSearchToggle}
                    className="p-2 rounded-full transition-colors hover:bg-primary-700"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  {/*  <button onClick={toggleLanguage}>
                    <img
                      src={i18n.language.startsWith("id") ? FLAGID : FLAGEN}
                      alt={i18n.language}
                      className="w-6 h-6 rounded-full"
                    />
                  </button> */}
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-full transition-colors hover:bg-primary-700"
                  >
                    <Menu className="w-5 h-5" />
                  </button>{" "}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm transition-all duration-300 bg-black/20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full md:w-80 w-screen bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 dark:bg-gray-800 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 text-white bg-primary-400 dark:bg-gray-700">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full transition-colors hover:bg-primary-600 dark:hover:bg-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content - scrollable */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Account */}
          <div className="mb-8 space-y-4">
            <h3 className="mb-4 text-sm font-medium tracking-wide text-gray-800 uppercase dark:text-gray-200">
              {t("account")}
            </h3>

            {token && fullname && role ? (
              <Link
                to="/DetailProfile"
                className="grid grid-cols-[auto_1fr] gap-4 items-center bg-primary-100 px-4 py-3 rounded-lg dark:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex justify-center items-center p-2 w-10 h-10 rounded-full bg-primary-500">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-600 dark:text-white">
                    {fullname}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {email}
                  </p>
                </div>
              </Link>
            ) : (
              <>
                <button
                  className="flex justify-center items-center px-6 py-3 space-x-2 w-full font-semibold text-white rounded-lg transition-colors bg-primary-500 hover:bg-primary-600"
                  onClick={() => {
                    navigate("/SignIn");
                    setIsSidebarOpen(false);
                  }}
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
                <button
                  className="flex justify-center items-center px-6 py-3 space-x-2 w-full font-semibold text-black bg-yellow-400 rounded-lg transition-colors hover:bg-yellow-300"
                  onClick={() => {
                    navigate("/SignUp");
                    setIsSidebarOpen(false);
                  }}
                >
                  <User className="w-5 h-5" />
                  <span>Sign Up </span>
                </button>
              </>
            )}
          </div>

          <div className="mb-6 border-t border-gray-200 dark:border-gray-600"></div>

          {/* Navigation */}
          <ul className="space-y-3">
            {token && fullname && role && hasActiveContributor && (
              <li>
                <Link
                  to="/analytics"
                  className="flex gap-2 px-4 py-2 text-gray-700 rounded-lg transition dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <BarChart3 className="w-5 h-5" /> Analytics
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/explore"
                className="flex gap-2 px-4 py-2 text-gray-700 rounded-lg transition dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Compass className="w-5 h-5" /> Explore
              </Link>
            </li>
            <Link
              to="/membership"
              className="flex gap-2 px-4 py-2 text-gray-700 rounded-lg transition dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Crown className="w-5 h-5" /> Membership
            </Link>
            {token && fullname && role && (
              <li>
                <Link
                  to="/history"
                  className="flex gap-2 px-4 py-2 text-gray-700 rounded-lg transition dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <ReceiptText className="w-5 h-5" /> History Transaksi
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={() => {
                  setOpenModal(true);
                  setIsSidebarOpen(false);
                }}
                className="flex items-center px-4 py-2 mb-5 space-x-2 w-full font-semibold text-white rounded-full transition-colors bg-primary-300 hover:bg-primary-600 md:hidden"
              >
                <Plus className="w-4 h-4" />
                <span>{t("add_twibone")}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto space-y-4 bg-gray-50 border-t border-gray-200 dark:border-gray-600 dark:bg-gray-700">
          {/* Theme Toggle */}
          <div className="mb-6 space-y-4">
            <h3 className="mb-4 text-sm font-medium tracking-wide text-gray-800 uppercase dark:text-gray-200">
              {t("theme")}
            </h3>
            <button
              onClick={toggleTheme}
              className="flex justify-between items-center p-3 w-full rounded-lg border border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="font-medium">{t("dark_mode")} </span>
              </div>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  theme === "dark" ? "bg-yellow-400" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </button>
          </div>

          <div className="mb-6 border-t border-gray-200 dark:border-gray-600"></div>

          <div className="flex items-center space-x-2">
            <img
              src={logoIcon}
              alt=" Logo"
              className="object-contain w-8 h-8"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                MyTwibbon
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          </div>

          {token && fullname && role && (
            <button
              onClick={handleLogoutClick}
              className="px-4 py-2 w-full text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
            >
              {t("logout_label")}
            </button>
          )}
        </div>
      </div>

      <ModalLogout
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
      <ModalTwibbonChoice
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

export default Navbar;
