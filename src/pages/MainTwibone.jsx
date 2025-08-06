import React, { useEffect, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import { User, Share2, Bell, ImageOff, Users } from "lucide-react";
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

function MainTwibone() {
  const { image, setImage, setFrameImage, frameImage } = useImageStore();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: twibbon, isLoading, refetch } = useGET(`twibbon/${slug}`);

  const [cards, setCards] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    refetch();
  }, [slug]);

  useEffect(() => {
    if (twibbon?.data) {
      useTwibbonStore.getState().setTwibbonData(twibbon.data);
      // populate cards
      const baseURL = "https://api-twibbon-dev.digiduindo.com";
      const userCards = twibbon.data.user_twibbons.map((utw) => ({
        id: utw.id,
        image: `${baseURL}${utw.image_url}`,
        description: utw.caption || "",
        title: twibbon.data.title,
        status: "",
        eventTitle: twibbon.data.title,
        creator: utw.user_id,
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

  if (isLoading) return <LoadingPage />;

  const renderCards = () => {
    const slots = [];
    const displayCards = cards.slice(0, 9);
    displayCards.forEach((card) => {
      slots.push(
        <div key={card.id} className="w-full aspect-square">
          <CardResult
            src={card.image}
            onClick={() => handleCardClick(card.id)}
          />
        </div>
      );
    });
    for (let i = displayCards.length; i < 9; i++) {
      slots.push(
        <div
          key={`empty-${i}`}
          className="w-full bg-gray-200 rounded-lg aspect-square"
        />
      );
    }
    return slots;
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Icon */}
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
              <ImageOff className="w-10 h-10 text-gray-400" />
            </div>
            <div className="absolute flex items-center justify-center w-8 h-8 rounded-full -bottom-1 -right-1 bg-cyan-100">
              <Users className="w-4 h-4 text-cyan-500" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Belum Ada Yang Di Post
            </h3>
            <p className="max-w-sm text-sm text-gray-500">
              Jadilah yang pertama untuk membuat dan membagikan twibbon Anda!
              Upload foto dan buat karya yang menarik.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex mt-6 space-x-2">
            <div className="w-2 h-2 rounded-full bg-cyan-200 animate-pulse"></div>
            <div className="w-2 h-2 delay-100 rounded-full bg-cyan-300 animate-pulse"></div>
            <div className="w-2 h-2 delay-200 rounded-full bg-cyan-400 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <header className="px-4 py-3 m-5 bg-white">
        <div className="grid items-center grid-cols-1 lg:grid-cols-3">
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-medium capitalize truncate">
              {twibbon?.data?.title || "Belum Ada Title"}
            </h1>
            <p className="text-sm text-gray-400">
              {twibbon?.data?.contributor?.fullname}
            </p>
          </div>
          <div className="flex items-center justify-start mt-2 space-x-2 lg:justify-center">
            <User className="w-5 h-5" />
            <div>
              <span className="text-sm">Pendukung</span>
              <div className="text-xs text-gray-400">{cards.length}</div>
            </div>
          </div>
          <div className="items-center justify-end hidden space-x-4 lg:flex">
            {/* Link (clickable only on input area) */}
            <div className="flex overflow-hidden bg-gray-100 border border-gray-300 rounded-lg">
              <span className="px-3 py-2 text-sm text-gray-500 bg-gray-200 select-none">
                twibbongypem.com/
              </span>
              <input
                type="text"
                readOnly
                value={
                  twibbon?.data?.link?.split("http://twibbongypem.com/")[1] || "campaign-link"
                }
                onClick={() =>
                  navigator.clipboard.writeText(twibbon?.data?.link)
                }
                className="px-3 py-2 text-sm text-gray-800 bg-transparent focus:outline-none w-[160px] truncate cursor-pointer"
                title="Klik untuk salin link"
              />
            </div>

            {/* Notification Bell (optional) */}
            <button className="p-2 transition-colors rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div
          className="flex items-center justify-center p-4"
          style={{ backgroundImage: `url(${Bg1})` }}
        >
          <CardEditor frameImage={frameImage} />
        </div>

        <div className="justify-center h-full p-4 overflow-y-auto bg-white">
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
      />

      <Footer />
    </div>
  );
}

export default MainTwibone;
