// components/modal/ShareModal.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { X, Copy, Facebook, Twitter, Link2, Share2 } from "lucide-react";

const ShareModal = ({ isOpen, onClose, shareData }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const { title, url, description } = shareData;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      // Anda perlu mengirimkan openToast melalui props atau context
      if (window.openToast) {
        window.openToast("toast", true, t("main.link_copied"), "success");
      }
      onClose();
    });
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        onClose();
      } catch (error) {
        console.log("Share cancelled");
      }
    }
  };

  const handleSocialShare = (platform) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${title} ${url}`
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("main.share")}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-colors rounded-full hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {t("main.share_description")}
          </p>

          {/* Share Options */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Native Share */}
            {navigator.share && (
              <button
                onClick={handleShareNative}
                className="flex flex-col items-center p-3 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-2 bg-blue-100 rounded-full dark:bg-blue-900">
                  <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {t("main.share")}
                </span>
              </button>
            )}

            {/* Facebook */}
            <button
              onClick={() => handleSocialShare("facebook")}
              className="flex flex-col items-center p-3 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-2 bg-blue-100 rounded-full dark:bg-blue-900">
                <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Facebook
              </span>
            </button>

            {/* Twitter */}
            <button
              onClick={() => handleSocialShare("twitter")}
              className="flex flex-col items-center p-3 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-2 bg-blue-100 rounded-full dark:bg-blue-900">
                <Twitter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Twitter
              </span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center p-3 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-2 bg-green-100 rounded-full dark:bg-green-900">
                <Copy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {t("main.copy_link")}
              </span>
            </button>
          </div>

          {/* Link Preview */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded bg-primary-100 dark:bg-primary-900">
                <Link2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {title}
                </p>
                <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                  {url}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;