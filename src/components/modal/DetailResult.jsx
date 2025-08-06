import React, { useState } from "react";
import ModalAlert from "../../layout/ModalAlert";
import { X, MessageCircle, Send, ArrowLeft } from "lucide-react";

function DetailResult({ isOpen, onClose, cardData }) {
  const [comment, setComment] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [komentars, setKomentars] = useState([
    {
      id: 1,
      user: "Arbisan",
      comment: "Keren banget designnya!",
      time: "2 jam yang lalu",
    },
    {
      id: 2,
      user: "Kenzosan",
      comment: "Bagus sekali, semangat terus!",
      time: "5 jam yang lalu",
    },
    {
      id: 3,
      user: "Budi Santoso",
      comment: "Mantap jiwa! Keep up the good work bro",
      time: "1 hari yang lalu",
    },
    {
      id: 4,
      user: "Arbisan",
      comment: "Inspiratif sekali karyanya, sukses terus ya!",
      time: "2 hari yang lalu",
    },
    {
      id: 5,
      user: "Dewi",
      comment: "Wah luar biasa!",
      time: "3 hari yang lalu",
    },
  ]);

  if (!isOpen) return null;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newKomentar = {
        id: komentars.length + 1,
        user: "Current User",
        comment: comment.trim(),
        time: "Baru saja",
      };
      setKomentars([newKomentar, ...komentars]);
      setComment("");
    }
  };


  const data = cardData ;

  // Mobile full screen version
  const MobileVersion = () => (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* App Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Detail</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 px-2 overflow-y-auto">
        {/* Image */}
        <div className="px-10 w-fit h-fit">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-fit "
          />
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h2 className="mb-3 text-xl font-bold text-gray-800">
            {data.title}
          </h2>

          <div className="mb-4">
            <div className="text-sm text-gray-600">
              {showFullDescription
                ? data.description
                : data.description.slice(0, 150) + ""}
            </div>
            {data.description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {showFullDescription ? "Sembunyikan" : "Selengkapnya"}
              </button>
            )}
          </div>

          <div className="mb-4 text-sm text-blue-600">{data.status}</div>
          
          <div className="flex items-center mb-6 space-x-3 text-sm text-gray-500">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
              <span className="text-sm font-bold text-white">IF</span>
            </div>
            <div>
              <div className="font-medium text-gray-700">
                {data.eventTitle}
              </div>
              <div className="text-sm">@{data.creator}</div>
            </div>
          </div>

          {/* Komentar Section */}
          <div className="border-t border-gray-200">
            <div className="py-4">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                <MessageCircle className="w-5 h-5" /> Komentar
              </h3>

              {/* Form input komentar */}
              <form onSubmit={handleSubmitComment} className="flex mb-6 space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                  <span className="text-xs font-medium text-white">U</span>
                </div>
                <div className="flex flex-1 space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bagikan pesan kamu..."
                    className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Daftar komentar */}
              <div className="space-y-4">
                {komentars.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">Belum ada komentar</p>
                    <p className="text-sm text-gray-400">Mulai percakapan</p>
                  </div>
                ) : (
                  komentars.map((c) => (
                    <div key={c.id} className="flex space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                        <span className="text-xs font-medium text-gray-600">
                          {c.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="px-3 py-2 bg-gray-100 rounded-lg">
                          <div className="text-sm font-medium text-gray-800">
                            {c.user}
                          </div>
                          <div className="text-sm text-gray-700">
                            {c.comment}
                          </div>
                        </div>
                        <div className="mt-1 ml-3 text-xs text-gray-500">
                          {c.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop modal version
  const DesktopVersion = () => (
    <ModalAlert onClose={onClose}>
      <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl" style={{ height: '90vh' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute z-10 p-2 transition-colors bg-white rounded-full shadow-md top-4 right-4 hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex h-full">
          {/* Image side */}
          <div className="flex items-center justify-center p-4 bg-gray-100 lg:w-1/2">
            <div className="relative w-full max-w-md lg:max-w-full">
              <img
                src={data.image}
                alt={data.title}
                className="object-cover w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Content side */}
          <div className="flex flex-col lg:w-1/2">
            {/* Header & Description */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="mb-2 text-xl font-bold text-gray-800">
                {data.title}
              </h2>

              <div className="mb-3">
                <div className="overflow-hidden overflow-y-auto text-sm text-gray-600 max-h-20">
                  {showFullDescription
                    ? data.description
                    : data.description.slice(0, 100) + "..."}
                </div>
                {data.description.length > 100 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    {showFullDescription ? "Sembunyikan" : "Selengkapnya"}
                  </button>
                )}
              </div>

              <div className="mb-4 text-xs text-blue-600">{data.status}</div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                  <span className="text-xs font-bold text-white">IF</span>
                </div>
                <div>
                  <div className="font-medium text-gray-700">
                    {data.eventTitle}
                  </div>
                  <div className="text-xs">@{data.creator}</div>
                </div>
              </div>
            </div>

            {/* Komentar Section */}
            <div className="flex flex-col flex-1">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                  <MessageCircle className="w-5 h-5" /> Komentar
                </h3>
              </div>


              {/* Form input komentar */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmitComment} className="flex space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                    <span className="text-xs font-medium text-white">U</span>
                  </div>
                  <div className="flex flex-1 space-x-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Bagikan pesan kamu..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" /> Post
                    </button>
                  </div>
                </form>
                
              {/* Daftar komentar dengan scroll saat overflow */}
              <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
                {komentars.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">Belum ada komentar</p>
                    <p className="text-sm text-gray-400">Mulai percakapan</p>
                  </div>
                ) : (
                  komentars.map((c) => (
                    <div key={c.id} className="flex space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                        <span className="text-xs font-medium text-gray-600">
                          {c.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="px-3 py-2 bg-gray-100 rounded-lg">
                          <div className="text-sm font-medium text-gray-800">
                            {c.user}
                          </div>
                          <div className="text-sm text-gray-700">
                            {c.comment}
                          </div>
                        </div>
                        <div className="mt-1 ml-3 text-xs text-gray-500">
                          {c.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalAlert>
  );

  return (
    <>
      {/* Mobile version */}
      <div className="block lg:hidden">
        <MobileVersion />
      </div>
      
      {/* Desktop version */}
      <div className="hidden lg:block">
        <DesktopVersion />
      </div>
    </>
  );
}

export default DetailResult;