import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, User, Edit2, MoreVertical, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const CardProfile = ({ twibon, isGrid = true, onEdit, onDelete }) => {
  const {t}=useTranslation()
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(twibon);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(twibon);
    }
    setShowDeleteMenu(false);
  };

  const toggleDeleteMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteMenu(!showDeleteMenu);
  };

  return (
    <Link
      to={`/${twibon.slug}`}
      className={`block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        isGrid ? "" : "flex flex-col sm:flex-row"
      }`}
    >
      <div
        className={`relative ${
          isGrid
            ? "aspect-[1/1]"
            : "aspect-[16/9] sm:aspect-[1/1] sm:w-48 sm:flex-shrink-0"
        }`}
      >
        <img
          src={`${import.meta.env.VITE_FILE_URL}${twibon.image}`}
          alt={twibon.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className={`p-3 sm:p-4 ${isGrid ? "" : "flex-1"} `}>
        <div className="flex items-start justify-between mb-2 h-[40px]">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-[#8B3A9C] transition-colors text-sm sm:text-base">
            {twibon.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          <span>by {twibon.author}</span>
        </div>

        <div className="flex items-center justify-between mb-3 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{twibon.supports}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-start gap-2 pt-2 border-t border-gray-300 dark:border-gray-600 sm:flex-row sm:pt-3 ">
          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-primary-500 hover:text-white rounded-lg transition-all duration-200 ${
              isGrid ? "w-full" : "w-full sm:w-28"
            }`}
            title="Edit"
          >
            <Edit2 className="w-3 h-3 dark:text-white" />
            <span className="dark:text-white">Edit</span>
          </button>

          {/* Delete Menu Button */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={toggleDeleteMenu}
              className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 w-full sm:w-auto h-full"
              title="More options"
            >
              <MoreVertical className="w-3 h-3 dark:text-white" />
              <span className="sm:hidden">More</span>
            </button>

            {/* Delete Dropdown Menu */}
            {showDeleteMenu && (
              <div className="absolute right-0 bottom-full mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px] w-full sm:w-auto">
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full h-full gap-2 px-3 py-2 text-xs text-left text-red-600 rounded-lg sm:text-sm hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="dark:text-white">{t("main.delete")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showDeleteMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteMenu(false);
          }}
        />
      )}
    </Link>
  );
};

CardProfile.propTypes = {
  twibon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    category: PropTypes.string,
    author: PropTypes.string,
    User: PropTypes.number,
    image: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
    isTrending: PropTypes.bool,
  }).isRequired,
  isGrid: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default CardProfile;
