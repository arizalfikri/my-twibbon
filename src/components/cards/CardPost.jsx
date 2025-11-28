import React from "react";
import { Trash2, Share2, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

function CardPost({
  post,
  onDelete,
  onShare,
  onCardClick,
  showActions = true,
}) {
  const { t } = useTranslation();
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Handle card click
  const handleCardClick = (e) => {
    if (onCardClick) {
      onCardClick(post);
    }
  };

  // Handle share click
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(post);
    }
  };

  // Handle delete click
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(post.id);
    }
  };

  return (
    <div className="block overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:shadow-lg group">
      {/* Post Image */}
      <div className="relative aspect-[1/1]" onClick={handleCardClick}>
        <img
          src={`${import.meta.env.VITE_FILE_URL}${post.image_url}`}
          alt={post.caption || "Post image"}
          className="object-cover w-full h-full transition-transform duration-300 "
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.jpg";
          }}
        />
      </div>

      <div className="p-3 sm:p-4" onClick={handleCardClick}>
        {/* Title */}
        <div className="flex items-start justify-between mb-2 h-[40px]">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-[#8B3A9C] transition-colors text-sm sm:text-base">
            {post?.event_twibbon?.title || post.caption || "Untitled"}
          </h3>
        </div>

        {/* Date */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{formatDate(post.createdAt)}</span>
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
    </div>
  );
}

export default CardPost;
