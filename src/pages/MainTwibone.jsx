import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/layoutpage/Navbar";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import {
  User,
  Share2,
  Bell,
  ImageOff,
  Users,
  Maximize2,
  X,
} from "lucide-react";
import CardEditor from "../components/cards/CardEditor";
import CardResult from "../components/cards/CardResult";
import Bg1 from "../assets/images/background_hero.png";
import Footer from "../components/layoutpage/Footer";
import { useNavigate, useParams } from "react-router-dom";
import useImageStore from "../helper/store/imagestore";
import DetailResult from "../components/modal/DetailResult";
import { useGET } from "../services/api";
import LoadingPage from "../components/layoutpage/LoadingPage";
import useTwibbonStore from "../helper/store/TwiboneUser";
import { useModalStore } from "../helper/store/modal.store";

function MainTwibone() {
  const { t } = useTranslation();
  const { image, setImage, setFrameImage, frameImage } = useImageStore();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: twibbon, isLoading, refetch } = useGET(`twibbon/${slug}`);
  const { openToast } = useModalStore();

  const [cards, setCards] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    refetch();
  }, [slug]);

  useEffect(() => {
    setShowDetailModal(false);
    setSelectedCard(null);
  }, []);

  useEffect(() => {
    if (twibbon?.data) {
      useTwibbonStore.getState().setTwibbonData(twibbon.data);
      const baseURL = "https://api-twibbon-dev.digiduindo.com";
      const userCards = twibbon.data.user_twibbons.map((utw) => ({
        id: utw.id,
        image: `${baseURL}${utw.image_url}`,
        description: utw.caption || "",
        title: twibbon.data.title,
        status: "",
        eventTitle: twibbon.data.title,
        creator: utw.user_id,
        user_twibbon_id: utw.id,
      }));
      setCards(userCards);
    }
  }, [twibbon]);

  useEffect(() => {
    if (twibbon?.data?.template_twibbon) {
      const imageURL = `https://api-twibbon-dev.digiduindo.com${twibbon.data.template_twibbon}`;
      setFrameImage(imageURL);
    }
  }, [twibbon]);

  useState(() => {
    if (image) {
      setImage(null);
    }
  }, [image, navigate]);

  const handleCardClick = (cardId) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setShowDetailModal(true);
    }
  };

  // Fungsi untuk menangani share
  const handleShare = async (card) => {
    try {
      // Data untuk di-share
      const shareData = {
        url: window.location.href,
      };

      // Cek apakah browser support Web Share API
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        // Fallback untuk browser yang tidak support Web Share API
        await handleFallbackShare(card);
      }
    } catch (error) {
      console.log("Error sharing:", error);
      // Jika native share gagal, gunakan fallback
      await handleFallbackShare(card);
    }
  };

  // Fallback share method
  const handleFallbackShare = async (card) => {
    try {
      // Copy link ke clipboard
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);

      // Bisa ditambahkan toast notification di sini
      alert(t('main.link_copied'));

      // Atau bisa membuka dialog share manual
      // showShareDialog(card);
    } catch (error) {
      console.log("Error copying to clipboard:", error);
      // Last fallback - buka dialog share social media
      openSocialShare(card);
    }
  };

  // Share ke social media
  const openSocialShare = (card) => {
    const shareUrl = window.location.href;
    const shareText = encodeURIComponent(
      card.description || t('main.share_text', { title: card.title })
    );

    // Contoh share ke WhatsApp
    const whatsappUrl = `https://wa.me/?text=${shareText}%20${encodeURIComponent(
      shareUrl
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) return <LoadingPage />;

  const renderCards = (showAll = false) => {
    const slots = [];
    const displayCards = showAll ? cards : cards.slice(0, 9);

    displayCards.forEach((card) => {
      slots.push(
        <div key={card.id} className="w-full aspect-square">
          <CardResult
            src={card.image}
            onClick={() => handleCardClick(card.id)}
            onShare={() => handleShare(card)}
          />
        </div>
      );
    });

    // Jika tidak showAll, tambahkan placeholder untuk slot kosong
    if (!showAll) {
      for (let i = displayCards.length; i < 9; i++) {
        slots.push(
          <div
            key={`empty-${i}`}
            className="w-full bg-gray-200 rounded-lg aspect-square dark:bg-gray-700"
          />
        );
      }
    }

    return slots;
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Icon */}
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-800">
              <ImageOff className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="absolute flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full dark:bg-purple-900 -bottom-1 -right-1">
              <Users className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {t('main.no_posts_yet')}
            </h3>
            <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {t('main.be_first_to_post')}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex mt-6 space-x-2">
            <div className="w-2 h-2 bg-purple-200 rounded-full dark:bg-purple-600 animate-pulse"></div>
            <div className="w-2 h-2 delay-100 bg-purple-300 rounded-full dark:bg-purple-500 animate-pulse"></div>
            <div className="w-2 h-2 delay-200 bg-purple-400 rounded-full dark:bg-purple-400 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderFullscreenModal = () => {
    if (!isFullscreen) return null;

    return (
      <div className="fixed inset-0 z-40 bg-white dark:bg-gray-900">
        <NavbarEditor
          title={twibbon?.data?.title || t('main.no_title')}
          disableModalExit={true}
          onExit={() => setIsFullscreen(false)}
        />

        {/* Content area */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto p-6">
          <div className="mx-auto">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-8">
              {renderCards(true)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white">
      <Navbar />
      <header className="px-4 py-3 m-5 bg-white dark:bg-gray-900 dark:text-white">
        <div className="grid items-center grid-cols-1 lg:grid-cols-3">
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-medium capitalize truncate">
              {twibbon?.data?.title || t('main.no_title')}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-400">
              {twibbon?.data?.contributor?.fullname}
            </p>
          </div>
          <div className="flex items-center justify-start mt-2 space-x-2 lg:justify-center">
            <User className="w-5 h-5 dark:text-gray-300" />
            <div>
              <span className="text-sm">{t('main.supporters')}</span>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {cards.length}
              </div>
            </div>
          </div>
          <div className="items-center justify-end hidden space-x-4 lg:flex">
            <div className="flex overflow-hidden bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600">
              <span className="px-3 py-2 text-sm text-gray-500 bg-gray-200 select-none dark:bg-gray-700 dark:text-gray-300">
                TwibbonGypem/
              </span>
              <input
                type="text"
                readOnly
                value={twibbon?.data?.link?.replace(/^https?:\/\/[^/]+\//, "")}
                onClick={() => {
                  navigator.clipboard.writeText(twibbon?.data?.link);
                  openToast("toast", true, t('main.copy_success'), "success");
                }}
                className="px-3 py-2 text-sm text-gray-800 bg-transparent dark:text-gray-200 focus:outline-none w-[160px] truncate cursor-pointer"
                title={twibbon?.data?.link}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div
          className="relative flex items-center justify-center p-4"
          style={{
            backgroundImage: `url(${Bg1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay khusus dark mode */}
          <div className="absolute inset-0 hidden bg-black/60 dark:block"></div>

          {/* Konten */}
          <div className="relative z-10">
            <CardEditor frameImage={frameImage} />
          </div>
        </div>

        <div className="relative justify-center h-full p-4 overflow-y-auto bg-white dark:bg-gray-900">
          {cards.length > 9 && (
            <button
              onClick={toggleFullscreen}
              className="absolute z-10 flex items-center justify-center p-3 text-white transition-colors duration-200 bg-purple-600 rounded-full shadow-lg opacity-85 top-4 right-4 hover:bg-purple-700 hover:opacity-100"
              aria-label={t('main.view_all_images')}
              title={t('main.view_all_images')}
            >
              <Maximize2 size={20} />
            </button>
          )}

          {cards.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 h-fit">{renderCards()}</div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>

      <DetailResult
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        cardData={selectedCard}
        id_user_twibbons={selectedCard?.user_twibbon_id}
      />

      {/* Fullscreen Modal */}
      {renderFullscreenModal()}

      <Footer />
    </div>
  );
}

export default MainTwibone;