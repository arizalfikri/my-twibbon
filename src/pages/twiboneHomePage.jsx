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
  const filteredTwibbons = twibbonData.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white ">
      <Navbar />

      {/* Header Section with Diagonal Scrolling Photos - TIDAK DIUBAH */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-400 via-primary-300 to-primary-300    dark:from-primary-600 dark:via-primary-500 dark:to-primary-700 text-white h-[440px] md:h-[640px] ">
        <div className="relative z-20 grid h-full max-w-screen-lg px-4 mx-auto">
          <div className="relative grid items-center h-full gap-8 md:grid-cols-2 lg:gap-16">
            {/* Left Column - Text Content */}
            <div className="items-center justify-center space-y-4 text-center md:text-left md:space-y-6">
              <div className="flex items-center justify-center mb-4 md:justify-start">
                <Sparkles className="w-6 h-6 mr-2 text-yellow-300 sm:w-7 sm:h-7 md:w-8 md:h-8 animate-pulse" />
                <h1 className="text-3xl font-bold sm:text-4xl md:text-2xl lg:text-4xl">
                  {t("title")}
                </h1>
              </div>
              <p className="flex items-center justify-center text-lg text-blue-50 sm:text-xl md:text-lg ">
                {t("homepage.hero_subtitle")}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row md:items-start md:justify-start lg:ps-0">
                <Link
                  to="/create"
                  className="bg-yellow-400 dark:bg-yellow-500 text-primary-600 dark:text-primary-700 px-6 py-3 sm:px-8 sm:py-4 md:px-5 md:py-2.5 rounded-full font-bold text-base sm:text-lg md:text-base hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-all hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t("homepage.start_creating")}
                </Link>

                <Link
                  to="/explore"
                  className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 md:px-5 md:py-2.5 rounded-full font-semibold text-base sm:text-lg md:text-base  hover:bg-white hover:text-primary-500 dark:hover:bg-gray-100 dark:hover:text-primary-600 transition-all hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {t("homepage.explore_twibone")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-40 md:top-0 md:h-full md:-right-96">
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
                  <div className="flex-shrink-0 w-32 h-32 overflow-hidden shadow-xl md:h-40 md:w-40 lg:h-48 lg:w-48 bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl">
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
                  <div className="flex-shrink-0 w-32 h-32 overflow-hidden shadow-xl md:h-40 md:w-40 lg:h-48 lg:w-48 bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl">
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
                  <div className="flex-shrink-0 w-32 h-32 overflow-hidden shadow-xl md:h-40 md:w-40 lg:h-48 lg:w-48 bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl">
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

        <div className="absolute inset-0 z-10 pointer-events-none md:hidden bg-gradient-to-b from-primary-500/100 via-primary-500/100 to-transparent lg:from-primary-500/60 lg:via-transparent lg:to-transparent dark:from-primary-600/100 dark:via-primary-600/100 dark:lg:from-primary-600/60"></div>
        <div className="absolute inset-0 z-10 hidden pointer-events-none nmd:block bg-gradient-to-b from-primary-500/100 via-primary-500/95 to-transparent lg:from-primary-500/40 lg:via-transparent lg:to-transparent dark:from-primary-600/100 dark:via-primary-600/95 dark:lg:from-primary-600/40"></div>
      </section>

      <main className="max-w-screen-lg px-4 py-8 mx-auto">
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("homepage.popular_twibone")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isLoading
                  ? t("homepage.loading_latest")
                  : t("homepage.showing_count", {
                      filtered: filteredTwibbons.length,
                      total: pagination.total || "0",
                    })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-primary-400 dark:bg-primary-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-primary-400 dark:bg-primary-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <Link
                to="/explore"
                className="flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("homepage.view_all")}
                </span>
              </Link>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary-400 dark:bg-primary-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {t("homepage.category_all")}
              </button>
            ))}
          </div>
        </div>

        {/* Twibbon Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
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

        {/* View More Section */}
        {filteredTwibbons.length > 0 &&
          totalTwibbons > filteredTwibbons.length && (
            <div className="mt-12 text-center">
              <div className="p-8 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-2xl">
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {t("homepage.more_twibone_available", {
                    count: totalTwibbons - filteredTwibbons.length,
                  })}
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  {t("homepage.explore_collection")}
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white transition-all rounded-full shadow-md bg-primary-400 dark:bg-primary-500 hover:bg-primary-500 dark:hover:bg-primary-600 hover:scale-105"
                >
                  {t("homepage.explore_all_twibone")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}

        {/* Enhanced Tutorial Section */}
        <section className="py-20 mt-16 bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 dark:from-gray-800 dark:to-primary-900/30 rounded-3xl">
          <div className="max-w-screen-xl px-6 mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                {t("homepage.tutorial_title")}
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                {t("homepage.tutorial_subtitle")}
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="relative group">
                <div className="absolute inset-0 transition-transform transform bg-gradient-to-r from-primary-400 to-primary-500 dark:from-primary-500 dark:to-primary-600 rounded-2xl rotate-1 group-hover:rotate-2"></div>
                <div className="relative p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-2xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-primary-400 to-primary-500 dark:from-primary-500 dark:to-primary-600">
                    <Search className="w-8 h-8" />
                  </div>
                  <div className="absolute px-3 py-1 text-sm font-bold text-white rounded-full top-4 right-4 bg-primary-500 dark:bg-primary-600">
                    {t("homepage.step")} 1
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                    {t("homepage.step1_title")}
                  </h3>
                  <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                    {t("homepage.step1_description")}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                    <CheckCircle className="w-4 h-4" />
                    {t("homepage.step1_feature")}
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="absolute inset-0 transition-transform transform bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500 rounded-2xl -rotate-1 group-hover:-rotate-2"></div>
                <div className="relative p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-2xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="absolute px-3 py-1 text-sm font-bold text-white rounded-full top-4 right-4 bg-primary-500 dark:bg-primary-600">
                    {t("homepage.step")} 2
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                    {t("homepage.step2_title")}
                  </h3>
                  <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                    {t("homepage.step2_description")}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                    <CheckCircle className="w-4 h-4" />
                    {t("homepage.step2_feature")}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="absolute inset-0 transition-transform transform bg-gradient-to-r from-primary-400 to-primary-500 dark:from-primary-500 dark:to-primary-600 rounded-2xl rotate-1 group-hover:rotate-2"></div>
                <div className="relative p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-2xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-primary-400 to-primary-500 dark:from-primary-500 dark:to-primary-600">
                    <Share2 className="w-8 h-8" />
                  </div>
                  <div className="absolute px-3 py-1 text-sm font-bold text-white rounded-full top-4 right-4 bg-primary-500 dark:bg-primary-600">
                    {t("homepage.step")} 3
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                    {t("homepage.step3_title")}
                  </h3>
                  <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                    {t("homepage.step3_description")}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                    <CheckCircle className="w-4 h-4" />
                    {t("homepage.step3_feature")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 mt-20 text-center">
          <div className="w-full mx-auto">
            <div className="p-12 text-white shadow-xl bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 dark:from-primary-500 dark:via-primary-600 dark:to-primary-500 rounded-3xl">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-300 animate-pulse" />
              <h2 className="mb-4 text-3xl font-bold">
                {t("homepage.cta_title")}
              </h2>
              <p className="mb-8 text-xl text-blue-50">
                {t("homepage.cta_subtitle")}
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link to="/create">
                  <button className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold transition-all bg-yellow-400 rounded-full shadow-lg dark:bg-yellow-500 text-primary-600 dark:text-primary-700 hover:bg-yellow-300 dark:hover:bg-yellow-400 hover:scale-105">
                    <Plus className="w-5 h-5" />
                    {t("homepage.start_now")}
                  </button>
                </Link>
                <Link to="/explore">
                  <button className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all border-2 border-white rounded-full hover:bg-white hover:text-primary-500 dark:hover:bg-gray-100 dark:hover:text-primary-600 hover:scale-105">
                    <Search className="w-5 h-5" />
                    {t("homepage.view_templates")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default TwiboneHomepage;