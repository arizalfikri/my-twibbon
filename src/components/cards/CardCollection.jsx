import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, User } from "lucide-react";
import PropTypes from "prop-types";

const CardCollections = ({ twibon }) => {
  return (
    <Link
      to={`/${twibon.slug}`}
      className={` bg-white dark:bg-gray-800 rounded-xl shadow-md\ border-2  border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 cursor-pointer group `}
    >
      <div
        className={`relative 
         spect-[1/1]
        `}
      >
        {console.log(`https://api-twibbon-dev.digiduindo.com${twibon.image}`)}

        <img
          src={`https://api-twibbon-dev.digiduindo.com${twibon.image}`}
          alt={twibon.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className={`p-4 `}>
        <div className="flex items-start justify-between mb-2 h-[48px]">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-[#4C0D68] dark:group-hover:text-[#f2b0ff] transition-colors">
            {twibon.title}
          </h3>
        </div>


        
      </div>
    </Link>
  );
};

CardCollections.propTypes = {
  twibon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    category: PropTypes.string,
    author: PropTypes.string,
    User: PropTypes.number,
    image: PropTypes.string.isRequired,
  }),
};

export default CardCollections;
