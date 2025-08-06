import React, { useEffect, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import { User, Share2, Bell } from "lucide-react";
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

  return (
    <div>
      <Navbar />
      <header className="px-4 py-3 m-5 bg-white">
        <div className="grid items-center grid-cols-1 lg:grid-cols-3">
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-medium capitalize truncate">
              {twibbon?.data?.title || "Belum Ada Title"}
            </h1>
            <p className="text-sm text-gray-400">{twibbon?.data?.contributor?.fullname}</p>
          </div>
          <div className="flex items-center justify-start mt-2 space-x-2 lg:justify-center">
            <User className="w-5 h-5" />
            <div>
              <span className="text-sm">Pendukung</span>
              <div className="text-xs text-gray-400">{cards.length}</div>
            </div>
          </div>
          <div className="items-center justify-end hidden space-x-4 lg:flex">
            <button
              className="flex items-center gap-2 p-2 border rounded-full"
              onClick={() => navigator.clipboard.writeText(twibbon.data.link)}
            >
              <span className="text-sm truncate max-w-[180px] text-gray-400">
                {twibbon.data.link}
              </span>
              <Share2 className="w-5 h-5 text-cyan-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
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

        <div className="justify-center h-full p-4 overflow-y-auto bg-white ">
          <div className="grid grid-cols-3 gap-4 h-fit">{renderCards()}</div>
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
