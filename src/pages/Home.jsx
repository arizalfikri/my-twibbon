import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import { User, Share2, Bell } from "lucide-react";
import CardEditor from "../components/cards/CardEditor";
import CardResult from "../components/cards/CardResult";
import frameImage from "../assets/images/frame.png";
import frameImage1 from "../assets/images/frame3.png";

import Bg1 from "../assets/images/background_hero.png";
import Footer from "../components/layoutpage/Footer";
import { useNavigate } from "react-router-dom";
import useImageStore from "../helper/store/imagestore";
import DetailResult from "../components/modal/DetailResult";

// Dummy data untuk kartu hasil
const dummyCards = [
  {
    id: 1,
    image: frameImage1,
    description:
      "Twibbon IMPACT FIKKIA - Design 1 yang sangat menarik jadi jangan lupa melakukan like subscribe dalll jadi aku juga #gypemjuara #gypemjay #mantap #gg #wibu #saya jadai saya sangat suka makan bakso sapi ayam sangat enak gaji we wok de tok sapi sigma skibidi sjadshkajhsaj xjhchkahkcdjsnq saaaskdjkladlkajdlskahjkxcnjhkjnghaskjdjasdghkjasdvbds msdkjshadjkhasdkjasdnmnbs dsakajhsdakjasdkcasamnasdkjhsdakjhsdakjkn",
    creator: "John Doe",
    createdAt: "2024-07-20",
  },
  {
    id: 2,
    image: frameImage1,
    description:
      "Twibbon IMPACT FIKKIA - Design 1 yang sangat menarik jadi jangan lupa melakukan like subscribe dalll jadi aku juga #gypemjuara #gypemjay #mantap #gg #wibu #saya jadai saya sangat suka makan bakso sapi ayam sangat enak gaji we wok de tok sapi sigma skibidi sjadshkajhsaj xjhchkahkcdjsnq saaaskdjkladlkajdlskahjkxcnjhkjnghaskjdjasdghkjasdvbds msdkjshadjkhasdkjasdnmnbs dsakajhsdakjasdkcasamnasdkjhsdakjhsdakjkn",
    creator: "Jane Smith",
    createdAt: "2024-07-21",
  },
  {
    id: 3,
    image: frameImage1,
    description: "Twibbon IMPACT FIKKIA - Design 3",
    creator: "Bob Johnson",
    createdAt: "2024-07-22",
  },
  {
    id: 4,
    image: frameImage1,
    description: "Twibbon IMPACT FIKKIA - Design 4",
    creator: "Alice Wilson",
    createdAt: "2024-07-23",
  },
  {
    id: 5,
    image: frameImage1,
    description: "Twibbon IMPACT FIKKIA - Design 5",
    creator: "Charlie Brown",
    createdAt: "2024-07-24",
  },
];

function Home() {
  const { image, setImage } = useImageStore();
  const navigate = useNavigate();
  const currentURL = window.location.href;

  // State untuk kartu
  const [cards, setCards] = useState(dummyCards);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useState(() => {
    if (image) {
      setImage(null);
    }
  }, [image, navigate]);

  // Handle card click
  const handleCardClick = (cardId) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setShowDetailModal(true);
    }
  };

  // Render 9 cards total (data + placeholder abu-abu)
  const renderCards = () => {
    const allCards = [];

    // Ambil maksimal 9 data teratas
    const displayCards = cards.slice(0, 9);

    // Render kartu dengan data
    displayCards.forEach((card) => {
      allCards.push(
        <div key={card.id} className="h-full">
          <CardResult
            src={card.image}
            description={card.description}
            creator={card.creator}
            createdAt={card.createdAt}
            onClick={() => handleCardClick(card.id)}
          />
        </div>
      );
    });

    // Jika data kurang dari 9, isi sisanya dengan kotak abu-abu
    const remainingSlots = 9 - displayCards.length;
    for (let i = 0; i < remainingSlots; i++) {
      allCards.push(
        <div key={`empty-${i}`} className="h-full">
          <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg shadow-md aspect-square"></div>
        </div>
      );
    }

    return allCards;
  };

  return (
    <div>
      <Navbar />
      <header className="px-4 py-3 m-5 text-black bg-white">
        <div className="grid items-center grid-cols-1 lg:grid-cols-3">
          {/* Left Side - Title */}
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-medium truncate">
              IMPACT FIKKIA Olympiade and Research 2024
            </h1>
            <p className="text-sm text-gray-400">Impact Fikkia</p>
          </div>

          {/* Center - User Info */}
          <div className="flex items-center justify-start mt-2 space-x-2 lg:justify-center lg:mt-0">
            <User className="w-5 h-5" />
            <div>
              <span className="text-sm">Pendukung</span>
              <div className="text-xs text-gray-400">113</div>
            </div>
          </div>

          {/* Right Side - URL and Actions */}
          <div className="items-center justify-end hidden space-x-4 lg:flex">
            <div className="flex items-center space-x-2">
              <button
                className="flex gap-5 p-2 transition-colors border border-gray-500 rounded-full hover:bg-gray-100"
                onClick={() => navigator.clipboard.writeText(currentURL)}
              >
                <div className="text-sm text-gray-400 truncate max-w-[180px]">
                  {currentURL}
                </div>
                <Share2 className="w-5 h-5 text-cyan-400" />
              </button>

              <button className="p-2 transition-colors rounded-full hover:bg-gray-800">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        {/* Kiri: Twibbon Editor */}
        <div
          className="flex items-center justify-center p-4 "
          style={{ backgroundImage: `url(${Bg1})` }}
        >
          <CardEditor />
        </div>

        {/* Kanan: Daftar hasil */}
        <div className="h-full p-4 overflow-y-auto bg-white border-gray-300">
          {/* Info jumlah hasil */}{" "}
          <div className="grid h-full grid-cols-3 gap-4">{renderCards()}</div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailResult
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        cardData={selectedCard}
      />

      <div className="flex px-3 py-4">
        <h1 className="my-4 text-xl font-medium sm:text-lg "></h1>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
