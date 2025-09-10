import { MoreHorizontal, Share2 } from "lucide-react";
import PropTypes from "prop-types";
import { Menu, MenuItem, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

export default function CardResult({ src, onClick, onClickMore, onShare }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare();
    }
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    if (onClickMore) {
      onClickMore();
    }
  };

  const handleCardClick = (e) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group aspect-square"
      onClick={handleCardClick}
    >
      {/* Image */}
      <img
        src={src}
        alt="Result"
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 bg-black bg-opacity-30 ${
          isMobile
            ? showMobileActions
              ? "opacity-100"
              : "opacity-0"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />

      {/* Mobile Actions - Selalu terlihat di mobile */}

      {/* Desktop Dropdown Menu */}
      {!isMobile && (
        <div className="absolute top-2 right-2">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button
              onClick={handleMoreClick}
              className="flex items-center justify-center p-2 transition-all duration-300 bg-white rounded-full shadow-md opacity-0 w-9 h-9 bg-opacity-90 backdrop-blur-sm group-hover:opacity-100 hover:bg-opacity-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-95"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-800" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-30 w-40 mt-2 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none">
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleShareClick}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:bg-gray-100`}
                      >
                        <Share2 className="flex-shrink-0 w-4 h-4 mr-3" />
                        <span className="truncate">Bagikan</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )}

      {/* Mobile Hint Text */}
      {isMobile && !showMobileActions && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="px-2 py-1 text-xs text-white transition-opacity duration-200 bg-black bg-opacity-50 rounded opacity-0 backdrop-blur-sm group-active:opacity-100">
            Tap untuk aksi, tap lagi untuk detail
          </div>
        </div>
      )}
    </div>
  );
}

CardResult.propTypes = {
  src: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onClickMore: PropTypes.func,
  onShare: PropTypes.func,
};
