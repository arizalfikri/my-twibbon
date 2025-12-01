import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, TrendingUp, User, Image as ImageIcon } from "lucide-react";
import PropTypes from "prop-types";

const CardHome = ({ twibon, isSupport = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const cleanString = String(dateString).trim().replace(/^"|"$/g, "");
    const date = new Date(cleanString);
    if (isNaN(date.getTime())) {
      console.warn("Tanggal tidak valid:", dateString);
      return "";
    }
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const imageUrl = `${import.meta.env.VITE_FILE_URL}${twibon.image}`;

  return (
    <Link
      to={`/${twibon.slug}`}
      className="block overflow-hidden bg-white rounded-xl border-2 border-gray-200 shadow-md transition-all duration-300 cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-gray-900/20 group"
    >
      <div className="relative aspect-[1/1]">

        {/* Placeholder SVG jika masih loading atau gagal */}
        {(!isLoaded || isError) && (
          <div className="flex absolute inset-0 justify-center items-center bg-gray-200 dark:bg-gray-700">
            <ImageIcon className="w-12 h-12 text-gray-500 animate-pulse dark:text-gray-400" />
          </div>
        )}

        {!isError && (
          <img
            src={imageUrl}
            alt={twibon.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            style={{ display: isLoaded ? "block" : "none" }}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setIsError(true);
              setIsLoaded(true);
            }}
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-300">
          {twibon.title}
        </h3>

        <div className="flex justify-between items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
          <Link
            to={`/user/${twibon.username}`}
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer hover:underline"
          >
            by {twibon.author}
          </Link>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex gap-1 items-center">
            {twibon.isSupport ? (
              <>
                <User className="w-4 h-4" />
                <span>{twibon.supports} Supporters</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>{formatDate(twibon.date)}</span>
              </>
            )}
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
    username: PropTypes.string,
    image: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    date: PropTypes.string,
    isSupport: PropTypes.bool,
    supports: PropTypes.number,
  }).isRequired,
  isSupport: PropTypes.bool,
};

export default CardHome;
