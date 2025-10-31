import {
  Search,
  Plus,
  Menu,
  X,
  User,
  Moon,
  Compass,
  Crown,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import LogoGypem from "../../assets/images/gypem_logo_putih.png";
import {
  useNavigate,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useGlobalStore } from "../../helper/store/global.store";
import ModalLogout from "../modal/ModalLogout";
import { useThemeStore } from "../../helper/store/theme.store";
import { useTranslation } from "react-i18next";
import FLAGID from "../../assets/images/indonesiaflag.png";
import FLAGEN from "../../assets/images/amerikaflag.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileSearchMode, setIsMobileSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { email, token, fullname, role } = useGlobalStore();
  const { theme, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();
  
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
      <nav className="bg-[#4C0D68] text-white py-5 relative z-40 dark:bg-gray-900 dark:border-b dark:border-gray-600">
        <div className="max-w-screen-lg px-4 mx-auto">
          <div className="flex items-center justify-between">
            {isMobileSearchMode ? (
              <div className="flex items-center w-full space-x-3 md:hidden">
                <form onSubmit={handleSearch} className="relative flex-1">
                  <input
                    type="text"
                    placeholder={t("search_placeholder")}
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                    autoFocus
                    className="w-full bg-[#6B1E7A] border border-[#8B2E9B] rounded-full px-4 py-2 pl-10 pr-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute text-gray-300 transform -translate-y-1/2 left-3 top-1/2 hover:text-white"
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
                  <div className="flex items-center justify-center w-12 h-12 rounded">
                    <img
                      src={LogoGypem}
                      alt="Logo Gypem"
                      className="object-contain w-20 h-20"
                    />
                  </div>
                  <span className="text-lg font-semibold">Gypem Twibbon</span>
                </Link>

                {/* Desktop Search */}
                <div className="flex-1 hidden max-w-md mx-8 md:flex">
                  <form
                    onSubmit={handleDesktopSearch}
                    className="relative w-full"
                  >
                    <input
                      type="text"
                      placeholder={t("search_placeholder")}
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="w-full bg-[#6B1E7A] border border-[#8B2E9B] rounded-full px-4 py-2 pl-10 pr-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="absolute text-gray-300 transform -translate-y-1/2 left-3 top-1/2 hover:text-white"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute text-gray-300 transform -translate-y-1/2 right-3 top-1/2 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </form>
                </div>

                {/* Desktop Right */}
                <div className="items-center hidden space-x-2 md:flex">
                  <Link
                    to="/create"
                    className="bg-yellow-400 text-[#4C0D68] px-4 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-yellow-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden capitalize lg:inline">
                      {t("add_twibone")}
                    </span>
                    <span className="lg:hidden ">{t("add")}</span>
                  </Link>
                  <button onClick={toggleLanguage}>
                    <img
                      src={i18n.language.startsWith("id") ? FLAGID : FLAGEN}
                      alt={i18n.language}
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                  <button
                    className="p-2 hover:bg-[#6B1E7A] rounded-full transition-colors"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Right */}
                <div className="flex items-center space-x-2 md:hidden">
                  <button
                    onClick={handleMobileSearchToggle}
                    className="p-2 hover:bg-[#6B1E7A] rounded-full transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button onClick={toggleLanguage}>
                    <img
                      src={i18n.language.startsWith("id") ? FLAGID : FLAGEN}
                      alt={i18n.language}
                      className="w-6 h-6 rounded-full"
                    />
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-[#6B1E7A] rounded-full transition-colors"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
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
        <div className="bg-[#4C0D68] text-white p-4 flex items-center justify-between dark:bg-gray-700">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-[#6B1E7A] rounded-full transition-colors dark:hover:bg-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content - scrollable */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Account */}
          <div className="mb-8 space-y-4">
            <h3 className="mb-4 text-sm font-medium tracking-wide text-gray-800 uppercase dark:text-gray-200">
              {t("account")}
            </h3>

            {token && fullname && role ? (
              <Link
                to="/DetailProfile"
                className="grid grid-cols-[auto_1fr] gap-4 items-center bg-[#F4EBFF] px-4 py-3 rounded-lg dark:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="bg-[#4C0D68] p-2 rounded-full w-10 h-10 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#4C0D68] dark:text-white">
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
                  className="w-full bg-[#4C0D68] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-[#6B1E7A] transition-colors"
                  onClick={() => {
                    navigate("/SignIn");
                    setIsSidebarOpen(false);
                  }}
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
                <button
                  className="w-full bg-yellow-400 text-[#4C0D68] px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-yellow-300 transition-colors"
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
            <li>
              <Link
                to="/explore"
                className="flex gap-2 px-4 py-2 text-gray-700 transition rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Compass className="w-5 h-5" /> Explore
              </Link>
            </li>
            <li>
              <Link
                to="/membership"
                className="flex gap-2 px-4 py-2 text-gray-700 transition rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Crown className="w-5 h-5" /> Membership
              </Link>
            </li>
            <li>
              <Link
                to="/create"
                className="bg-yellow-400 text-[#4C0D68] px-4 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-yellow-300 transition-colors md:hidden mb-5"
              >
                <Plus className="w-4 h-4" />
                <span>{t("add_twibone")}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto space-y-4 border-t border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
          {/* Theme Toggle */}
          <div className="mb-6 space-y-4">
            <h3 className="mb-4 text-sm font-medium tracking-wide text-gray-800 uppercase dark:text-gray-200">
              {t("theme")}
            </h3>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full p-3 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
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
              src={LogoGypem}
              alt="Gypem Logo"
              className="object-contain w-8 h-8"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                Gypem Twibone
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                © 2024 All rights reserved
              </p>
            </div>
          </div>

          {token && fullname && role && (
            <button
              onClick={handleLogoutClick}
              className="w-full px-4 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
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
    </>
  );
}

export default Navbar;
