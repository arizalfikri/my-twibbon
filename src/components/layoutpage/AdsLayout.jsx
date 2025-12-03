import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGET } from "../../services/api";
import { useAdsStore } from "../../helper/store/ads.store";

export default function AdsLayout() {
  const { data } = useGET(`/ads`);
  const setAds = useAdsStore((s) => s.setAds);

  // Fetch ads on mount and store in global store
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      setAds(data.data);
    }
  }, [data, setAds]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* BAGIAN ATAS */}
      <AdsHeader />

      {/* Semua halaman tampil di sini */}
      <Outlet />
    </div>
  );
}

function AdsHeader() {
  const ads = useAdsStore((s) => s.ads);
  const [currentAds, setCurrentAds] = useState([]);

  // Function to get 2 random ads
  const getRandomAds = (adsArray) => {
    if (!adsArray || adsArray.length === 0) return [];
    if (adsArray.length <= 1) return adsArray;

    const shuffled = [...adsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 1);
  };

  // Initialize and rotate ads every 5 seconds
  useEffect(() => {
    if (ads && ads.length > 0) {
      setCurrentAds(getRandomAds(ads));

      const interval = setInterval(() => {
        setCurrentAds(getRandomAds(ads));
      }, 5000); // 5 seconds

      return () => clearInterval(interval);
    }
  }, [ads]);

  // Hide ads header if no ads available
  if (!ads || ads.length === 0) return null;

  return (
    <div className="h-[33vh] w-full dark:bg-gray-800 bg-white flex items-center justify-center relative">
      <div className="flex gap-4 justify-center items-center p-4 md:h-full w-fit">
        {currentAds.map((ad) => (
          <div
            key={ad.id}
            className="overflow-hidden flex-1 w-full h-full bg-contain rounded-2xl shadow-lg transition-shadow cursor-pointer hover:shadow-xl"
            onClick={() => {
              if (ad.link) {
                window.open(ad.link, "_blank");
              }
            }}
          >
            <img
              src={`${import.meta.env.VITE_FILE_URL}${ad.image_url}`}
              alt={ad.title}
              className="object-contain w-full h-full rounded-2xl"
            />
          </div>
        ))}
      </div>
<Link to="/membership">
  <div className="flex absolute -bottom-3 right-5 z-0 justify-center items-center w-24 h-10 text-sm font-semibold text-white bg-gradient-to-r rounded-xl border shadow-lg transition-all cursor-pointer select-none from-primary-600 to-primary-800 shadow-primary-300/40 border-white/10 hover:scale-105 hover:brightness-110 hover:shadow-primary-400/50"
  >
    Hapus Iklan
  </div>
</Link>

    </div>
  );
}
