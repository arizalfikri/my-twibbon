import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Share2,
  Filter,
  Grid,
  List,
  Plus,
  User,
} from "lucide-react";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import frameImage from "../assets/images/frame2.png";
import frameImage1 from "../assets/images/frame3.png";

import { Link } from "react-router-dom";

const mockTwibbons = [
  {
    id: 1,
    title: "IMPACT FIKKIA Olympiade and Research 2024",
    category: "Nasional",
    author: "GypemTeam",

    User: 234,
    image: frameImage,
    isNew: true,
    isTrending: true,
  },
  {
    id: 2,
    title: "Selamat Hari Guru",
    category: "Online",
    author: "EduCreator",

    User: 187,
    image: frameImage1,
    isNew: false,
    isTrending: true,
  },
];

const categories = ["Online", "Nasional", "Offline"];

function TwiboneHomepage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid");

  const filteredTwibbons = mockTwibbons.filter((twibon) => {
    const matchesCategory =
      selectedCategory === "Semua" || twibon.category === selectedCategory;
    return matchesCategory;
  });

  const TwibonCard = ({ twibon, isGrid = true }) => (
    <Link
      to="/Main"
      className={`block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        isGrid ? "" : "flex"
      }`}
    >
      <div
        className={`relative ${isGrid ? "aspect-[1/1]" : "w-48 flex-shrink-0"}`}
      >
        <img
          src={twibon.image}
          alt={twibon.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute flex gap-2 top-3 left-3">
          {twibon.isNew && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
              Baru
            </span>
          )}
          {twibon.isTrending && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>
      </div>

      <div className={`p-4 ${isGrid ? "" : "flex-1"}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#4C0D68] transition-colors">
            {twibon.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <span>by {twibon.author}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{twibon.User}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
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

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-screen-2xl">
        {/* Categories and Filters */}
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

        {/* Twibon Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredTwibbons.map((twibon) => (
            <TwibonCard
              key={twibon.id}
              twibon={twibon}
              isGrid={viewMode === "grid"}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="bg-[#4C0D68] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6B1E7A] transition-colors">
            Muat Lebih Banyak
          </button>
        </div>
      </main>
    

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default TwiboneHomepage;
