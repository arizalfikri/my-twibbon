import { Heart, ImageOff, Palette, Plus, Search } from "lucide-react";
import React from "react";


function EmptyTwibbon() {
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
            Sepertinya belum ada kreasi twibone yang tersedia saat ini. Jadilah
            yang pertama untuk membuat dan membagikan karya kreatif Anda!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <button
            className="bg-gradient-to-r from-[#4C0D68] to-[#6B1E7A] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
            onClick={() => navigate("/create")}
          >
            <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            Buat Twibone Pertama
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
}

export default EmptyTwibbon;
