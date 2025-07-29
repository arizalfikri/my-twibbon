import React, { useEffect, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import CardEditor from "../components/cards/CardEditor";
import useImageStore from "../helper/store/imagestore";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../components/modal/modalLogin";

function Result() {
  const navigate = useNavigate();
  const { resultImage, image } = useImageStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State untuk status login
  const [caption, setCaption] = useState('');

  const handleRestart = () => {
    navigate("/");
  };

  // Check login status - bisa dari localStorage, context, atau API
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!image) {
      navigate("/");
    }
  }, [image, navigate]);

  const handlePostClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      handlePost();
    }
  };

  const handlePost = async () => {
    try {
      console.log('Posting to Gypem:', {
        image: resultImage,
        caption: caption
      });

      alert('Berhasil diposting ke Gypem!');
      setCaption(''); // Reset caption
    } catch (error) {
      console.error('Post error:', error);
      alert('Gagal memposting. Coba lagi.');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    // Langsung post setelah login sukses
    handlePost();
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    // Logic untuk buka modal register atau navigate ke halaman register
    console.log('Switch to register modal');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarEditor />
      <div className="items-center justify-center gap-6 p-6 mx-auto md:grid md:grid-cols-2 max-w-7xl">
        {/* Result photo section */}
        <div className="md:col-span-1">
          <div className="relative w-full max-w-xl mx-auto">
            <div className="relative w-full">
              <img
                src={resultImage}
                alt="Hasil Twibbon"
                className="object-contain w-full h-auto rounded-lg shadow"
              />
            </div>
          </div>

          {/* Download link - always below image */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Foto belum terunduh?{" "}
              <a
                href={resultImage}
                download="twibbon-result.png"
                className="font-semibold text-purple-600 hover:underline"
              >
                Unduh Ulang
              </a>
            </span>
          </div>
        </div>

        {/* Desktop Control Panel - positioned on the right */}
        <div className="hidden p-6 bg-white border border-gray-200 rounded-lg shadow-sm md:block">
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
            Posting Foto ini Ke Gypem
          </h2>
          <div className="space-y-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows="6"
              className="w-full p-3 border border-gray-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Tulis caption untuk foto Anda..."
            ></textarea>
            <button 
              onClick={handlePostClick}
              className="w-full px-4 py-2 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              {isLoggedIn ? 'Post ke Gypem' : 'Masuk & Post ke Gypem'}
            </button>
            <button
              onClick={handleRestart}
              className="w-full px-4 py-3 font-medium text-center text-gray-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-600"
            >
              Buat Lagi
            </button>
          </div>
        </div>

        {/* Mobile Control Panel - Positioned naturally at bottom */}
        <div className="p-4 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm md:hidden">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold text-center text-gray-800">
              Posting Foto ini Ke Gypem
            </h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows="3"
              className="w-full p-3 mb-3 border border-gray-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Tulis caption..."
            ></textarea>
          </div>

          <div className="grid w-full grid-cols-4 gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center col-span-2 px-4 py-3 font-medium text-center text-gray-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-600"
            >
              Buat Lagi
            </button>
            <button 
              onClick={handlePostClick}
              className="flex items-center justify-center col-span-2 gap-2 px-4 py-3 font-medium text-center text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              {isLoggedIn ? 'Post' : 'Masuk & Post'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Login */}
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default Result;