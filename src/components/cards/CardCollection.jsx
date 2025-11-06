import React, { useState } from "react";
import { Trash2, Share2, MoreVertical } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CardCollections = ({ twibon, onDelete, onShare, showActions = true }) => {
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const navigate = useNavigate();

  // Translation texts (hardcoded since we can't use useTranslation)
  const t = (key) => {
    const translations = {
      "main.share": "Bagikan",
      "main.delete": "Hapus",
    };
    return translations[key] || key;
  };

  // Handle share click
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(twibon);
    }
  };

  // Handle delete click
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(twibon.id);
    }
    setShowDeleteMenu(false);
  };

  // Toggle delete menu
  const toggleDeleteMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteMenu(!showDeleteMenu);
  };

  // Handle card click
  const handleCardClick = () => {
    if (twibon.slug) {
      navigate(`/${twibon.slug}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="block overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:shadow-lg group"
    >
      {/* Image */}
      <div className="relative aspect-[1/1]">
        <img
          src={`${import.meta.env.VITE_FILE_URL}${twibon.image}`}
          alt={twibon.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.jpg";
          }}
        />
      </div>

      <div className="p-3 sm:p-4">
        {/* Title */}
        <div className="flex items-start justify-between mb-2 h-[40px]">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-[#8B3A9C] transition-colors text-sm sm:text-base">
            {twibon.title}
          </h3>
        </div>

        {/* Empty space for alignment */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          <div className="flex items-center gap-1">
            <span className="invisible">placeholder</span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col justify-start gap-2 pt-2 border-t border-gray-300 dark:border-gray-600 sm:flex-row sm:pt-3 ">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-primary-500 hover:text-white rounded-lg transition-all duration-200 w-full"
              title={t("main.share")}
            >
              <Share2 className="w-3 h-3 dark:text-white" />
              <span className="dark:text-white">{t("main.share")}</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 w-full sm:w-auto"
              title={t("main.delete")}
            >
              <Trash2 className="w-3 h-3 dark:text-white" />
              <span className="sm:hidden dark:text-white">
                {t("main.delete")}
              </span>
            </button>
          </div>
        )}
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
    </div>
  );
};

CardCollections.propTypes = {
  twibon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  onShare: PropTypes.func,
  showActions: PropTypes.bool,
};

export default CardCollections;
