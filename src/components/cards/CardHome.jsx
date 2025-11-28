import React from "react";
import { Link } from "react-router-dom";
import { Calendar, TrendingUp, User } from "lucide-react";
import PropTypes from "prop-types";

const CardHome = ({ twibon, isSupport = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Buang whitespace & quote tidak perlu
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

  const handleAuthorClick = (e) => {
    e.stopPropagation(); // Mencegah event bubbling ke parent Link
  };

  return (
    <Link
      to={`/${twibon.slug}`}
      className={`block bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 cursor-pointer group`}
    >
      <div className={`relative aspect-[1/1]`}>
        <img
          src={`${import.meta.env.VITE_FILE_URL}${twibon.image}`}
          alt={twibon.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg'; // Fallback image
          }}
        />
      </div>

      <div className={`p-4`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 transition-colors dark:text-gray-100 line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-300">
            {twibon.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
          {/* Ganti Link dengan span yang bisa diklik */}
          <span 
            className="cursor-pointer hover:underline"
            onClick={handleAuthorClick}
          >
            by {twibon.author}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
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
    User: PropTypes.number,
    image: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
    isTrending: PropTypes.bool,
    slug: PropTypes.string.isRequired,
    date: PropTypes.string,
    isSupport: PropTypes.bool,
    supports: PropTypes.number,
  }).isRequired,
  isSupport: PropTypes.bool,
};

export default CardHome;