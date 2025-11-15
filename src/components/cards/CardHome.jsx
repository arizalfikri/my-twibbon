import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, User } from "lucide-react";
import PropTypes from "prop-types";

const CardHome = ({ twibon, isGrid = true }) => {
  return (
    <Link
      to={`/${twibon.slug}`}
      className={`block bg-white dark:bg-gray-800 rounded-xl shadow-md\ border-2  border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 cursor-pointer group   `}
    >
      <div
        className={`relative aspect-[1/1] `}
      >
        <img
          src={`${import.meta.env.VITE_FILE_URL}${twibon.image}`}
          alt={twibon.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute flex gap-2 top-3 left-3">
          {twibon.isNew && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full dark:bg-green-600">
              Baru
            </span>
          )}
          {twibon.isTrending && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full dark:bg-red-600">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>
      </div>

      <div className={`p-4 ${isGrid ? "" : "flex-1"}`}>
        <div className="flex items-start justify-between mb-2 h-[48px]">
          <h3 className="font-semibold text-gray-900 transition-colors dark:text-gray-100 line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-300">
            {twibon.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
          <span>by {twibon.author}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{twibon?.supports} Supporters</span>
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
    isTrending: PropTypes.bool,
  }).isRequired,
  isGrid: PropTypes.bool,
};

export default CardHome;
