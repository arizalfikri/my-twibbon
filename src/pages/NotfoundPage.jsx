import React from "react";
import { Home, Search, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />
      
      {/* Main 404 Content */}
      <div className="flex items-center justify-center flex-1 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* 404 Hero Section */}
          <div className="relative mb-12">
            {/* Background decoration */}
            <div className="absolute inset-0 rounded-full bg-primary-400/20 dark:bg-primary-500/30 blur-3xl"></div>
            
            <div className="relative">
              {/* Large 404 Text */}
              <div className="mb-8">
                <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 leading-none">
                  404
                </h1>
              </div>

              {/* Error Message */}
              <div className="mb-12 space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
                  {t("notfound.title", "Halaman Tidak Ditemukan")}
                </h2>
                <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-400">
                  {t("notfound.description", "Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-center gap-4 mb-16 sm:flex-row">
                <Link to="/">
                  <button className="bg-primary-400 dark:bg-primary-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-500 dark:hover:bg-primary-600 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center">
                    <Home className="w-5 h-5" />
                    {t("notfound.back_home", "Kembali ke Beranda")}
                  </button>
                </Link>
                
                <Link to="/explore">
                  <button className="border-2 border-primary-400 dark:border-primary-500 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-400 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center">
                    <Search className="w-5 h-5" />
                    {t("notfound.explore", "Jelajahi Twibbon")}
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Helpful Links Section */}
          <div className="p-8 bg-white border border-gray-100 shadow-xl dark:bg-gray-800 rounded-3xl md:p-12 dark:border-gray-700">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
              {t("notfound.helpful_links", "Tautan Berguna")}
            </h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Home Link */}
              <Link to="/" className="group">
                <div className="p-6 transition-all duration-300 transform bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-primary-400 dark:hover:bg-primary-500 hover:text-white hover:scale-105">
                  <Home className="w-8 h-8 mx-auto mb-4 text-primary-600 dark:text-primary-400 group-hover:text-white" />
                  <h4 className="mb-2 text-lg font-semibold">
                    {t("notfound.home_title", "Beranda")}
                  </h4>
                  <p className="text-sm opacity-75">
                    {t("notfound.home_desc", "Kembali ke halaman utama")}
                  </p>
                </div>
              </Link>

              {/* Explore Link */}
              <Link to="/explore" className="group">
                <div className="p-6 transition-all duration-300 transform bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-primary-400 dark:hover:bg-primary-500 hover:text-white hover:scale-105">
                  <Search className="w-8 h-8 mx-auto mb-4 text-primary-600 dark:text-primary-400 group-hover:text-white" />
                  <h4 className="mb-2 text-lg font-semibold">
                    {t("notfound.explore_title", "Jelajahi")}
                  </h4>
                  <p className="text-sm opacity-75">
                    {t("notfound.explore_desc", "Temukan twibbon menarik")}
                  </p>
                </div>
              </Link>

              {/* Create Link */}
              <Link to="/create" className="group">
                <div className="p-6 transition-all duration-300 transform bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-primary-400 dark:hover:bg-primary-500 hover:text-white hover:scale-105">
                  <Sparkles className="w-8 h-8 mx-auto mb-4 text-primary-600 dark:text-primary-400 group-hover:text-white" />
                  <h4 className="mb-2 text-lg font-semibold">
                    {t("notfound.create_title", "Buat Twibbon")}
                  </h4>
                  <p className="text-sm opacity-75">
                    {t("notfound.create_desc", "Mulai membuat twibbon baru")}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Additional Help Text */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t("notfound.help_text", "Jika Anda yakin ini adalah kesalahan, silakan")} 
              <a href="mailto:support@example.com" className="ml-1 text-primary-600 dark:text-primary-400 hover:underline">
                {t("notfound.contact_support", "hubungi dukungan")}
              </a>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}