import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Grid,
  List,
  Plus,
  Search,
  ArrowRight,
  Upload,
  Share2,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import CardHome from "../components/cards/CardHome";
import { useGET } from "../services/api.js";

const categories = ["Semua"];

import ASOE from "../assets/images/ASOE-Scroll.webp";
import Earth from "../assets/images/Earth-Scroll.png";
import Fk from "../assets/images/fk-Scroll.png";
import IIS from "../assets/images/IIS-Scroll.webp";
import IYPES from "../assets/images/IYPES-Scroll.webp";
import Kartini from "../assets/images/Kartini-Scroll.png";
import Language from "../assets/images/Language-scroll.png";
import LOF6 from "../assets/images/LOF6-Scroll.webp";
import Pahlawan from "../assets/images/Pahlawan-Scroll.png";
import Pelajar from "../assets/images/Pelajar-Scroll.png";
import Pelajar2 from "../assets/images/Pelajar2-Scroll.png";
import PMI from "../assets/images/PMI-Scroll.png";
import Reading from "../assets/images/Reading-Scroll.png";
import S2O from "../assets/images/S2O-Scroll.png";

const samplePhotos = [
  [ASOE, Earth, Fk, IIS, IYPES, ASOE, Earth, Fk, IIS, IYPES],
  [
    Kartini,
    Language,
    LOF6,
    Pahlawan,
    Pelajar,
    Kartini,
    Language,
    LOF6,
    Pahlawan,
    Pelajar,
  ],
  [Pelajar2, PMI, Reading, S2O, ASOE, Pelajar2, PMI, Reading, S2O, ASOE],
];

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

import { Autoplay, FreeMode } from "swiper/modules";
import EmptyTwibbon from "../components/common/EmptyTwibbon.jsx";
import { useTranslation } from "react-i18next";
import FAQSection from "../components/sections/FAQSection.jsx";
import CTASection from "../components/sections/CTASection.jsx";
import TUTORIALSection from "../components/sections/TUTORIALSection.jsx";
import CreatorSection from "../components/sections/CREATORSection.jsx";
function TwiboneHomepage() {
  const { data, isLoading } = useGET("twibbons");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState("grid");

  const { t } = useTranslation();

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setViewMode("list");
      } else {
        setViewMode("grid");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const twibbonData = data?.data || [];
  const pagination = data?.pagination || [];

  const totalTwibbons = pagination.total || twibbonData.length;
  const filteredTwibbons = twibbonData.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white ">
      <Navbar />

      {/* Header Section with Diagonal Scrolling Photos - TIDAK DIUBAH */}
      <section
        className="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
 from-primary-300 via-primary-300 to-primary-600    dark:from-primary-600 dark:via-primary-500 dark:to-primary-700 text-white h-[440px] md:h-[640px] "
      >
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-[1] pointer-events-none">
          <svg
            width="100%"
            height="100%"
            id="svg"
            viewBox="0 0 1440 390"
            xmlns="http://www.w3.org/2000/svg"
            class="transition duration-300 ease-in-out delay-150"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="5%" stop-color="#facc15"></stop>
                <stop offset="95%" stop-color="#ff6700"></stop>
              </linearGradient>
            </defs>
            <path
              d="M 0,400 L 0,100 C 129.27272727272728,91.377990430622 258.54545454545456,82.75598086124401 340,108 C 421.45454545454544,133.244019138756 455.0909090909091,192.35406698564597 529,209 C 602.9090909090909,225.64593301435403 717.0909090909091,199.82775119617222 828,226 C 938.9090909090909,252.17224880382778 1046.5454545454545,330.3349282296651 1148,368 C 1249.4545454545455,405.6650717703349 1344.7272727272727,402.83253588516743 1440,400 L 1440,400 L 0,400 Z"
              stroke="none"
              stroke-width="0"
              fill="url(#gradient)"
              fill-opacity="0.53"
              class="transition-all duration-300 ease-in-out delay-150 path-0"
            ></path>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="5%" stop-color="#facc15"></stop>
                <stop offset="95%" stop-color="#ff6700"></stop>
              </linearGradient>
            </defs>
            <path
              d="M 0,400 L 0,233 C 117.15789473684208,211.99521531100478 234.31578947368416,190.99043062200957 316,205 C 397.68421052631584,219.00956937799043 443.8947368421053,268.03349282296654 546,298 C 648.1052631578947,327.96650717703346 806.1052631578947,338.8755980861244 912,376 C 1017.8947368421053,413.1244019138756 1071.6842105263158,476.46411483253587 1151,507 C 1230.3157894736842,537.5358851674641 1335.157894736842,535.2679425837321 1440,533 L 1440,400 L 0,400 Z"
              stroke="none"
              stroke-width="0"
              fill="url(#gradient)"
              fill-opacity="1"
              class="transition-all duration-300 ease-in-out delay-150 path-1"
            ></path>
          </svg>
        </div>
        <div className="container relative z-30 grid h-full px-4 mx-auto">
          <div className="relative grid items-center h-full gap-8 md:grid-cols-2 lg:gap-16">
            {/* Left Column - Text Content */}
            <div className="items-center justify-center space-y-4 text-center md:text-left md:space-y-6">
              <div className="flex items-center justify-center mb-4 md:justify-start">
                <h1 className="text-3xl font-bold sm:text-4xl md:text-2xl lg:text-5xl font-outfit">
                  Tunjukkan Gayamu, Sebarkan Semangatmu.{" "}
                </h1>
              </div>
              <p className="flex items-center justify-center text-lg text-blue-50 sm:text-xl md:text-lg md:items-start md:justify-start ">
                {t("homepage.hero_subtitle")}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row md:items-start md:justify-start lg:ps-0">
                <Link
                  to="/create"
                  className="bg-primary-400 border-primary-400 hover:border-primary-600 border text-white px-6 py-3 sm:px-8 sm:py-4 md:px-5 md:py-2.5 rounded-full font-bold text-base sm:text-lg md:text-base hover:bg-primary-600 transition-allshadow-lg inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t("homepage.start_creating")}
                </Link>

                <Link
                  to="/explore"
                  className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 md:px-5 md:py-2.5 rounded-full font-semibold text-base sm:text-lg md:text-base  hover:bg-white hover:text-primary-500 dark:hover:bg-gray-100 dark:hover:text-primary-600 transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {t("homepage.explore_twibone")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 z-20 w-full h-40 md:top-0 md:h-full md:-right-96">
          <div className="absolute inset-0 rotate-[-110deg] md:origin-center w-[120%] h-[120%]  md:left-[-10%] md:top-[-20%] left-[-40%]  top-[-30%] ">
            {/* Row 1 */}
            <Swiper
              modules={[Autoplay, FreeMode]}
              slidesPerView="auto"
              spaceBetween={20}
              loop={true}
              grabCursor={false}
              centeredSlides={false}
              allowTouchMove={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: false,
              }}
              style={{
                "--swiper-wrapper-transition-timing-function": "linear",
              }}
              speed={6000}
              className="w-full mb-10"
            >
              {[...samplePhotos[0], ...samplePhotos[0]].map((photo, index) => (
                <SwiperSlide key={`row1-${index}`} className="!w-auto">
                  <div className="flex-shrink-0 w-32 h-32 overflow-hidden shadow-xl md:h-40 md:w-40 lg:h-56 lg:w-56 bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl">
                    <div
                      className="w-full h-full transition-transform duration-300 rotate-90 bg-center bg-cover border-[6px] border-white hover:scale-110 rounded-xl"
                      style={{ backgroundImage: `url(${photo})` }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Row 2 */}
            <Swiper
              modules={[Autoplay, FreeMode]}
              slidesPerView="auto"
              spaceBetween={20}
              loop={true}
              grabCursor={false}
              centeredSlides={false}
              allowTouchMove={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
              }}
              style={{
                "--swiper-wrapper-transition-timing-function": "linear",
              }}
              speed={7000}
              className="w-full mb-10"
            >
              {[...samplePhotos[1], ...samplePhotos[1]].map((photo, index) => (
                <SwiperSlide key={`row2-${index}`} className="!w-auto">
                  <div className="flex-shrink-0 w-32 h-32 overflow-hidden shadow-xl md:h-40 md:w-40 lg:h-52 lg:w-52 bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl">
                    <div
                      className="w-full h-full transition-transform duration-300 rotate-90 bg-center bg-cover border-[6px] border-white hover:scale-110 rounded-xl"
                      style={{ backgroundImage: `url(${photo})` }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Row 3 */}
            <Swiper
              modules={[Autoplay, FreeMode]}
              slidesPerView="auto"
              spaceBetween={20}
              loop={true}
              grabCursor={false}
              centeredSlides={false}
              allowTouchMove={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: false,
              }}
              style={{
                "--swiper-wrapper-transition-timing-function": "linear",
              }}
              speed={5000}
              className="w-full"
            >
              {[...samplePhotos[2], ...samplePhotos[2]].map((photo, index) => (
                <SwiperSlide key={`row3-${index}`} className="!w-auto">
                  <div className="flex-shrink-0 w-32 h-32 overflow-hidden shadow-xl md:h-40 md:w-40 lg:h-56 lg:w-56 bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl">
                    <div
                      className="w-full h-full transition-transform duration-300 rotate-90 bg-center bg-cover border-[6px] border-white hover:scale-110 rounded-xl"
                      style={{ backgroundImage: `url(${photo})` }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none md:hidden bg-gradient-to-b from-primary-500/100 via-primary-500/100 to-transparent lg:from-primary-500/60 lg:via-transparent lg:to-transparent dark:from-primary-600/100 dark:via-primary-600/100 dark:lg:from-primary-600/60"></div>
        <div className="absolute inset-0 z-20 hidden pointer-events-none nmd:block bg-gradient-to-b from-primary-500/100 via-primary-500/95 to-transparent lg:from-primary-500/40 lg:via-transparent lg:to-transparent dark:from-primary-600/100 dark:via-primary-600/95 dark:lg:from-primary-600/40"></div>
      </section>

      <main className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("homepage.twibbon_title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("homepage.twibbon_Subtitle")}
              </p>
            </div>

            <Link
              to="/explore"
              className="flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="hidden sm:inline">{t("homepage.view_all")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        {/* Twibbon Grid/List */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {isLoading ? (
            <p className="text-center col-span-full">{t("homepage.loading")}</p>
          ) : filteredTwibbons.length === 0 ? (
            <EmptyTwibbon />
          ) : (
            filteredTwibbons.map((twibbon) => (
              <CardHome
                key={twibbon.id}
                twibon={{
                  id: twibbon.id,
                  title: twibbon.title || t("homepage.untitled"),
                  author: twibbon?.contributor?.fullname || "Gypem",
                  supports: twibbon.supports || 0,
                  slug: twibbon.slug_event_twibbon,
                  image: twibbon.template_twibbon,
                  isNew: false,
                  isTrending: false,
                }}
                isGrid={viewMode === "grid"}
              />
            ))
          )}
        </div>
        <TUTORIALSection />
        <CTASection />
        <FAQSection />
        <CreatorSection />
      </main>
      <Footer />
    </div>
  );
}

export default TwiboneHomepage;
