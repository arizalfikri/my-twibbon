import React, { useState } from "react";
import { Trash2, Share2, MoreVertical, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

function CardPost({
  post,
  onDelete,
  onShare,
  onCardClick,
  showActions = true,
}) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase();
  };

  // Handle card click (but not when clicking action buttons)
  const handleCardClick = (e) => {
    // Prevent modal opening when clicking on action buttons
    if (e.target.closest(".action-button")) {
      return;
    }
    onCardClick(post);
  };

  // Handle menu toggle
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Handle delete click
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(post.id);
  };

  // Handle share click
  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onShare(post);
  };

  return (
    <div
      className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
      onClick={handleCardClick}
    >
      {/* Post Image */}
      <div className="relative aspect-square">
        <img
          src={`https://api-twibbon-dev.digiduindo.com${post.image_url}`}
          alt={post.caption || "Post image"}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.jpg";
          }}
        />

        {/* Actions Menu - Desktop */}
        {showActions && (
          <div className="absolute top-2 right-2">
            <div className="relative">
              <button
                onClick={handleMenuToggle}
                className="p-2 text-white transition-colors rounded-full action-button bg-black/50 hover:bg-black/70"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 z-20 w-40 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full dark:bg-gray-800 dark:border-gray-700">
                    <button
                      onClick={handleShareClick}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 rounded-t-lg action-button dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Share2 className="w-4 h-4" />
                      {t("main.share")}
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 rounded-b-lg action-button dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("main.delete")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        {post.caption && (
          <p className="mb-3 text-sm text-gray-900 dark:text-white line-clamp-2">
            {post?.event_twibbon?.title}
          </p>
        )}

        {/* Post Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {/* Mobile Actions Bar */}
      {showActions && (
        <div className="px-4 py-2 border-t border-gray-200 md:hidden dark:border-gray-700">
          <div className="flex justify-end gap-2">
            <button
              onClick={handleShareClick}
              className="p-2 text-gray-500 rounded action-button dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title={t("main.share")}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-500 rounded action-button dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              title={t("main.delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardPost;
