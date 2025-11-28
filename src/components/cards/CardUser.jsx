import React from "react";
import { Link } from "react-router-dom";

function CardUser({ User }) {
  return (
    <Link to={`/user/${User?.username}`}>
      <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        {/* Gambar Akun (Kiri) */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-lg font-bold text-white">
              {User?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>

        {/* Konten (Kanan) */}
        <div className="flex-1 min-w-0">
          {/* Nama User */}
          <h3 className="text-lg font-semibold text-gray-900 truncate dark:text-white">
            {User?.name || "Unknown User"}
          </h3>

          {/* Supporter Count */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Supporter:
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              0
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CardUser;
