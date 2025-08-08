import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Filter,
  Grid,
  List,
  Plus,
  ImageOff,
  Search,
  Palette,
  Heart,
} from "lucide-react";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import CardHome from "../components/cards/CardHome";
import { useGET } from "../services/api.js";

const categories = ["Semua"]; // sementara cuma ada 'Semua'

function TwiboneHomepage() {
  const { data, isLoading } = useGET("twibbons");

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid");

  // 🔹 Set default: mobile list, laptop grid
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setViewMode("list"); // Mobile & tablet
      } else {
        setViewMode("grid"); // Laptop & desktop
      }
    };

    checkScreenSize(); // Cek saat pertama kali render
    window.addEventListener("resize", checkScreenSize); // Update kalau resize

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const twibbonData = data?.data || [];
  const filteredTwibbons = twibbonData.filter(() => true);
  console.log("twibbonData:", twibbonData);

  const renderEmptyState = () => {
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
            <div className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full top-4 -left-4 animate-ping">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">
              Belum Ada Twibone Tersedia
            </h3>
            <p className="leading-relaxed text-gray-600">
              Sepertinya belum ada kreasi twibone yang tersedia saat ini.
              Jadilah yang pertama untuk membuat dan membagikan karya kreatif Anda!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <button className="bg-gradient-to-r from-[#4C0D68] to-[#6B1E7A] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group">
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              Buat Twibone Pertama
            </button>
            <button className="flex items-center gap-2 px-6 py-3 font-semibold text-purple-700 transition-all duration-300 border-2 border-purple-200 rounded-full hover:bg-purple-50">
              <Search className="w-4 h-4" />
              Cari Inspirasi
            </button>
          </div>

          <div className="flex items-center justify-center pt-6 space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 delay-100 bg-pink-300 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 delay-200 bg-yellow-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-gradient-to-br from-[#4C0D68] to-[#6B1E7A] text-white py-16">
        <div className="max-w-screen-xl px-4 mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 mr-2 text-yellow-400" />
            <h1 className="text-4xl font-bold md:text-6xl">Gypem Twibone</h1>
          </div>
          <p className="mb-8 text-xl text-purple-100 md:text-2xl">
            Buat dan bagikan foto twibon untuk momen spesial Anda
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="bg-yellow-400 text-[#4C0D68] px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Mulai Membuat
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#4C0D68] transition-colors">
              Jelajahi Twibone
            </button>
          </div>
        </div>
      </section>

      <main className="px-4 py-8 mx-auto max-w-screen-2xl">
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Jelajahi Twibone Populer
            </h2>
            <div className="flex items-center gap-4">
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
              <button className="flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#4C0D68] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Twibbon Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredTwibbons.length === 0
            ? renderEmptyState()
            : filteredTwibbons.map((twibon) => (
                <CardHome
                  key={twibon.id}
                  twibon={{
                    id: twibon.id,
                    title: twibon.title || "Tanpa Judul",
                    author: "Gypem",
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

        {filteredTwibbons.length > 0 && (
          <div className="mt-12 text-center">
            <button className="bg-[#4C0D68] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6B1E7A] transition-colors">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default TwiboneHomepage;
