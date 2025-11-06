import { Heart, ImageOff, Palette, Plus, Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function EmptyTwibbon() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 col-span-full">
      <div className="max-w-md space-y-6 text-center">
        <div className="relative">
          <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-pink-100 dark:from-primary-900 dark:to-pink-900">
            <ImageOff className="w-16 h-16 text-primary-400 dark:text-primary-300" />
          </div>
          <div className="absolute flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full dark:bg-yellow-900 -top-2 -right-2 animate-bounce">
            <Palette className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
          </div>
          <div className="absolute flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full dark:bg-pink-900 -bottom-2 -left-2 animate-pulse">
            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-300" />
          </div>
          <div className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900 top-4 -left-4 animate-ping">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Belum Ada Twibone Tersedia
          </h3>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            Sepertinya belum ada kreasi twibone yang tersedia saat ini. Jadilah
            yang pertama untuk membuat dan membagikan karya kreatif Anda!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <button
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 hover:shadow-lg group"
            onClick={() => navigate("/create")}
          >
            <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            Buat Twibone Pertama
          </button>
        </div>

        <div className="flex items-center justify-center pt-6 space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary-300 dark:bg-primary-600 animate-pulse"></div>
            <div className="w-3 h-3 delay-100 bg-pink-300 rounded-full dark:bg-pink-600 animate-pulse"></div>
            <div className="w-3 h-3 delay-200 bg-yellow-300 rounded-full dark:bg-yellow-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyTwibbon;
  