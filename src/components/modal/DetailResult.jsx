import React, { useState } from "react";
import ModalAlert from "../../layout/ModalAlert";
import { X, MessageCircle, Send } from "lucide-react";

function DetailResult({ isOpen, onClose, cardData }) {
  const [comment, setComment] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comments, setComments] = useState([
    // Dummy comments
    {
      id: 1,
      user: "Gibran",
      comment: "Keren banget designnya!",
      time: "2 jam yang lalu"
    },
    {
      id: 2,
      user: "Jokowi Dodo", 
      comment: "Bagus sekali, semangat terus!",
      time: "5 jam yang lalu"
    },
    {
      id: 3,
      user: "Budi Santoso",
      comment: "Mantap jiwa! Keep up the good work bro",
      time: "1 hari yang lalu"
    },
    {
      id: 4,
      user: "Prabowo",
      comment: "Inspiratif sekali karyanya, sukses terus ya!",
      time: "2 hari yang lalu"
    }
  ]);

  if (!isOpen) return null;

  // Handle comment submission
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: "Current User",
        comment: comment.trim(),
        time: "Baru saja"
      };
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

  // Function to truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Default card data jika tidak ada
  const defaultCardData = {
    id: 1,
    image: "/api/placeholder/400/500",
    title: "MAULA DAFFA AMRIZAL (MAULA DAFFA 11B)",
    description: "IMPACT 2025 ON DUTY Hello Saya (Maula Daffa Amrizal) dari (SMA AL IZZAH BATU) sangat senang bisa berpartisipasi dalam acara IMPACT FIKKIA Olympiade and Research Competition 2025. Ini adalah pengalaman yang luar biasa bagi saya untuk dapat berkompetisi dengan peserta-peserta terbaik dari seluruh Indonesia. Semoga event ini dapat memberikan manfaat yang besar bagi perkembangan ilmu pengetahuan dan teknologi di Indonesia. Mari kita dukung bersama-sama kegiatan positif seperti ini!",
    status: "Selengkapnya",
    creator: "impactfikkiajamaur2025",
    eventTitle: "IMPACT FIKKIA Olympiade and Research Competition 2025"
  };

  const data = cardData || defaultCardData;

  return (
    <ModalAlert onClose={onClose}>
      <div className="relative w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute z-10 p-2 transition-colors bg-white rounded-full shadow-md top-4 right-4 hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:flex-row h-[80vh]">
          {/* Left Side - Image */}
          <div className="flex items-center justify-center p-4 bg-gray-100 lg:w-1/2">
            <div className="relative w-full max-w-md">
              <img
                src={data.image}
                alt={data.title}
                className="object-cover w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col lg:w-1/2">
            {/* Header Info */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="mb-2 text-xl font-bold text-gray-800">
                {data.title}
              </h2>
              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  {showFullDescription ? data.description : truncateDescription(data.description)}
                </p>
                {data.description.length > 100 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    {showFullDescription ? "Sembunyikan" : "Selengkapnya"}
                  </button>
                )}
              </div>
              <div className="mb-4 text-xs text-blue-600">
                {data.status}
              </div>
              
              {/* Event Info */}
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                  <span className="text-xs font-bold text-white">IF</span>
                </div>
                <div>
                  <div className="font-medium text-gray-700">{data.eventTitle}</div>
                  <div className="text-xs">@{data.creator}</div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col flex-1">
              {/* Comments Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                  <MessageCircle className="w-5 h-5" />
                  Komentar
                </h3>
              </div>

              {/* Comments List */}
              <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
                {comments.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">Belum ada Komentar</p>
                    <p className="text-sm text-gray-400">Mulai percakapan</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                        <span className="text-xs font-medium text-gray-600">
                          {comment.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="px-3 py-2 bg-gray-100 rounded-lg">
                          <div className="text-sm font-medium text-gray-800">
                            {comment.user}
                          </div>
                          <div className="text-sm text-gray-700">
                            {comment.comment}
                          </div>
                        </div>
                        <div className="mt-1 ml-3 text-xs text-gray-500">
                          {comment.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
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
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col max-h-[90vh]">
          {/* Image Section - Mobile */}
          <div className="flex items-center justify-center flex-shrink-0 p-3 bg-gray-100">
            <div className="relative w-full max-w-[200px]">
              <img
                src={data.image}
                alt={data.title}
                className="object-cover w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Header Info - Mobile */}
          <div className="flex-shrink-0 p-3 border-b border-gray-200">
            <h2 className="mb-2 text-base font-bold leading-tight text-gray-800">
              {data.title}
            </h2>
            <div className="mb-2">
              <p className="text-xs leading-relaxed text-gray-600">
                {showFullDescription ? data.description : truncateDescription(data.description, 80)}
              </p>
              {data.description.length > 80 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  {showFullDescription ? "Sembunyikan" : "Selengkapnya"}
                </button>
              )}
            </div>
            <div className="mb-2 text-xs text-blue-600">
              {data.status}
            </div>
            
            {/* Event Info - Mobile */}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                <span className="text-xs font-bold text-white">IF</span>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700">{data.eventTitle}</div>
                <div className="text-xs">@{data.creator}</div>
              </div>
            </div>
          </div>

          {/* Comments Header - Mobile */}
          <div className="flex-shrink-0 px-3 py-2 border-b border-gray-200">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <MessageCircle className="w-4 h-4" />
              Komentar ({comments.length})
            </h3>
          </div>

          {/* Comments List - Mobile (Scrollable) */}
          <div className="flex-1 min-h-0 px-3 py-2 space-y-3 overflow-y-auto" style={{ maxHeight: '40vh' }}>
            {comments.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-gray-500">Belum ada Komentar</p>
                <p className="text-xs text-gray-400">Mulai percakapan</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-2">
                  <div className="flex items-center justify-center flex-shrink-0 bg-gray-300 rounded-full w-7 h-7">
                    <span className="text-xs font-medium text-gray-600">
                      {comment.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="px-3 py-2 bg-gray-100 rounded-lg">
                      <div className="text-xs font-medium text-gray-800">
                        {comment.user}
                      </div>
                      <div className="mt-1 text-xs text-gray-700 break-words">
                        {comment.comment}
                      </div>
                    </div>
                    <div className="mt-1 ml-3 text-xs text-gray-500">
                      {comment.time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input - Mobile (Fixed at bottom) */}
          <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full">
                <span className="text-xs font-medium text-white">U</span>
              </div>
              <div className="flex flex-1 min-w-0 space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Bagikan pesan kamu..."
                  className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalAlert>
  );
}

export default DetailResult;