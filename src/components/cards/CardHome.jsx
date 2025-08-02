import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, User } from "lucide-react";
import PropTypes from "prop-types";

const CardHome = ({ twibon, isGrid = true }) => {
  return (
    <Link
      to={`/main/${twibon.slug}`}
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
};

CardHome.propTypes = {
  twibon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    category: PropTypes.string,
    author: PropTypes.string,
    User: PropTypes.number,
    image: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
    slug: PropTypes.string,
    isTrending: PropTypes.bool,
  }).isRequired,
  isGrid: PropTypes.bool,
};

export default CardHome;
