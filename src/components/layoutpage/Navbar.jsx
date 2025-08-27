import {
  Search,
  HelpCircle,
  Plus,
  Menu,
  X,
  User,
  ArrowRightFromLine,
  UserPlus,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import LogoGypem from "../../assets/images/gypem_logo_putih.png";
import { useNavigate, Link, useLocation, useSearchParams } from "react-router-dom";
import { useGlobalStore } from "../../helper/store/global.store";
import ModalLogout from "../modal/ModalLogout";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { email, token, fullname } = useGlobalStore();

  // Sync search query with URL params when on explore page
  useEffect(() => {
    if (location.pathname === '/explore') {
      const searchFromUrl = searchParams.get("search");
      if (searchFromUrl) {
        setSearchQuery(decodeURIComponent(searchFromUrl));
      } else {
        setSearchQuery("");
      }
    }
  }, [searchParams, location.pathname]);

  // Handle logout button click - show modal instead of direct logout
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsMobileMenuOpen(false);
    setIsSidebarOpen(false);
  };

  // Handle search functionality for mobile (form submit)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use simpler encoding for mobile to avoid %20
      const cleanQuery = searchQuery.trim().replace(/\s+/g, ' ');
      navigate(`/explore?search=${cleanQuery}`);
      setIsMobileMenuOpen(false);
    } else if (location.pathname === '/explore') {
      setSearchParams({});
      setIsMobileMenuOpen(false);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If on explore page and desktop, update URL in real-time with proper encoding
    if (location.pathname === '/explore' && window.innerWidth >= 768) {
      if (value.trim()) {
        setSearchParams({ search: value.trim() });
      } else {
        setSearchParams({});
      }
    }
  };

  // Handle search key press for mobile
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Handle desktop search submit (when user presses enter)
  const handleDesktopSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use simpler encoding to avoid %20 display
      const cleanQuery = searchQuery.trim().replace(/\s+/g, ' ');
      navigate(`/explore?search=${cleanQuery}`);
    } else if (location.pathname === '/explore') {
      // Clear search params if empty and already on explore page
      setSearchParams({});
    }
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("");
    if (location.pathname === '/explore') {
      setSearchParams({});
    }
  };

  return (
    <>
      <nav className="bg-[#4C0D68] text-white py-3 relative z-50">
        <div className="px-4 mx-auto max-w-screen-2xl">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-12 h-12 rounded">
                <img
                  src={LogoGypem}
                  alt="Logo Gypem"
                  className="object-contain w-20 h-20"
                />
              </div>
              <span className="text-lg font-semibold">Gypem Twibone</span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="flex-1 hidden max-w-md mx-8 md:flex">
              <form onSubmit={handleDesktopSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari twibone..."
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
                {/* Clear button - hanya muncul jika ada search query */}
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

            {/* Desktop Right Section */}
            <div className="items-center hidden space-x-2 md:flex">
             
              <Link
                to="/create"
                className="bg-yellow-400 text-[#4C0D68] px-4 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-yellow-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden capitalize lg:inline">
                  Tambah Twibone
                </span>
                <span className="lg:hidden">Mulai</span>
              </Link>
              <button
                className="p-2 hover:bg-[#6B1E7A] rounded-full transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-[#6B1E7A] rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 space-y-4 md:hidden">
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Cari twibone..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full bg-[#6B1E7A] border border-[#8B2E9B] rounded-full px-4 py-2 pl-10 pr-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute text-gray-300 transform -translate-y-1/2 left-3 top-1/2 hover:text-white"
                >
                  <Search className="w-4 h-4" />
                </button>
                {/* Clear button untuk mobile */}
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

              {/* Mobile Menu Items */}
              <div className="flex flex-col space-y-2">
                
                <Link
                  to="/create"
                  className="bg-yellow-400 text-[#4C0D68] px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-yellow-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="capitalize">Tambah Twibone</span>
                </Link>
              </div>

              {/* Mobile Auth Buttons - Directly in mobile menu */}
              <div className="space-y-2 pt-4 border-t border-[#6B1E7A] text-center">
                <h4 className="mb-2 text-sm font-medium text-gray-300">Akun</h4>

                {/* Mobile Login Button */}
                {token ? (
                  <div className="px-4 space-y-3">
                    <Link to="/DetailProfile" className="grid grid-cols-[auto_1fr] gap-3 items-center bg-[#F4EBFF] px-4 py-3 rounded-lg">
                      <div className="bg-[#4C0D68] p-2 rounded-full w-10 h-10 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#4C0D68]">
                          {fullname}
                        </p>
                        <p className="text-xs text-gray-600">{email}</p>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogoutClick}
                      className="w-full px-4 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/SignIn")}
                    className="w-full bg-white text-[#4C0D68] px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-[#4C0D68] text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-[#6B1E7A] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-6">
          {/* Authentication Section */}
          <div className="mb-8 space-y-4">
            <h3 className="mb-4 text-sm font-medium tracking-wide text-gray-800 uppercase">
              Akun
            </h3>

            {/* Login Button */}
            {token && (
              <Link to="/DetailProfile" className="grid grid-cols-[auto_1fr] gap-4 items-center bg-[#F4EBFF] px-4 py-3 rounded-lg">
                <div className="bg-[#4C0D68] p-2 rounded-full w-10 h-10 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#4C0D68]">{fullname}</p>
                  <p className="text-xs text-gray-600">{email}</p>
                </div>
              </Link>
            )}

            {!token && (
              <button
                className="w-full bg-[#4C0D68] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-[#6B1E7A] transition-colors"
                onClick={() => navigate("/SignIn")}
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="mb-6 border-t border-gray-200"></div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <img
              src={LogoGypem}
              alt="Gypem Logo"
              className="object-contain w-8 h-8"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">Gypem Twibone</p>
              <p className="text-xs text-gray-500">
                © 2024 All rights reserved
              </p>
            </div>
          </div>

          {/* Logout Button in Sidebar Footer */}
          {token && (
            <button
              onClick={handleLogoutClick}
              className="w-full px-4 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
            )}
          </div>
        </div>

        {/* ModalLogout Component */}
        <ModalLogout
          isOpen={isLogoutModalOpen} 
          onClose={() => setIsLogoutModalOpen(false)} 
        />
      </>
    );
  }

  export default Navbar;