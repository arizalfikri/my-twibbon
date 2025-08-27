import React, { useState, useEffect } from "react";
import ModalAlert from "../../layout/ModalAlert";
import { X, MessageCircle, Send, ArrowLeft } from "lucide-react";
import { useGET, usePOST } from "../../services/api";
import { useForm } from "react-hook-form";
import ModalLogin from "./modalLogin";

function DetailResult({ isOpen, onClose, cardData, id_user_twibbons }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [komentars, setKomentars] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState(new Set());

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: infoUser,
  } = useGET(`event-user-twibbon/${id_user_twibbons}`);

  const {
    data: KomentarData,
    isLoading,
    refetch,
  } = useGET(`twibbon/user/${id_user_twibbons}/comments`);

  const { mutateAsync, isPending } = usePOST(
    `twibbon/user/${id_user_twibbons}/comments`
  );

  // Helper function to format time - Fixed negative time issue
  const formatTime = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMs = now - commentDate;

    // Handle negative differences (future dates or invalid dates)
    if (diffInMs < 0) {
      return "baru saja";
    }

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes === 0) {
      return "baru saja";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else {
      return `${diffInDays} hari yang lalu`;
    }
  };

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase();
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Toggle comment expansion
  const toggleCommentExpansion = (commentId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (KomentarData?.data) {
      const transformedComments = KomentarData.data.map((comment) => ({
        id: comment.id,
        user: ` ${comment?.author_gypem?.user_firstname||comment?.author?.fullname}`,
        comment: comment.content,
        time: formatTime(comment.createdAt),
        user_id: comment.user_id,
        replies: comment.replies || [],
      }));
      setKomentars(transformedComments);
    } else {
      setKomentars([]);
    }
  }, [KomentarData, id_user_twibbons]);

  // Refetch comments when modal opens
  useEffect(() => {
    if (isOpen && id_user_twibbons) {
      refetch();
    }
  }, [isOpen, id_user_twibbons, refetch]);

  if (!isOpen || !cardData) return null;

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // Fixed modal login handling with pre-validation
  const onSubmit = async (data) => {
    if (!data.comment?.trim()) return;

    // Check authentication before sending request
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await mutateAsync({
        url: `twibbon/user/${id_user_twibbons}/comments`,
        data: {
          content: data.comment,
        },
      });

      if (response.status === 201) {
        reset();
        refetch();
      }
    } catch (error) {
      switch (error?.response?.status) {
        case 401:
          setShowLoginModal(true);
          break;
        case 403:
          setShowLoginModal(true);
          break;
        default:
          // Handle other errors if needed
          console.error("Server error:", error);
          break;
      }
    }
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (id_user_twibbons) {
      refetch();
    }
  };

  const data = cardData;

  // Mobile full screen version
  const MobileVersion = () => (
    <ModalAlert onClose={onClose}>
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
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image - Centered for Surface Pro 7 width */}
          <div className="flex justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md">
              <img 
                src={data.image} 
                alt={data.title} 
                className="w-full h-auto rounded-lg shadow-md" 
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4">
            <h2 className="mb-3 text-xl font-bold text-gray-800">
              {data.title}
            </h2>

            <div className="mb-4">
              <div className="text-sm text-gray-600">
                {showFullDescription
                  ? infoUser?.data?.caption || ""
                  : (infoUser?.data?.caption?.slice(0, 150) ?? "")}
              </div>
              {infoUser?.data?.caption?.length > 150 && (
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
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-sm font-bold text-white">
                  {getUserInitials(infoUser?.data?.author?.user_firstname || "Unknown User")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-700 truncate">
                  {truncateText(infoUser?.data?.author?.user_firstname || "Unknown User", 20)}
                </div>
                <div className="text-sm truncate">
                  @{truncateText(infoUser?.data?.author?.user_email || "unknown@email.com", 25)}
                </div>
              </div>
            </div>

            {/* Komentar Section */}
            <div className="border-t border-gray-200">
              <div className="py-4">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                  <MessageCircle className="w-5 h-5" /> Komentar
                </h3>

                {/* Form input komentar */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex mb-4 space-x-3"
                >
                  <div className="flex flex-1 space-x-2">
                    <input
                      {...register("comment", { required: true })}
                      type="text"
                      placeholder="Bagikan pesan kamu..."
                      className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                      disabled={isPending || !id_user_twibbons}
                      onFocus={() => {
                        if (!isAuthenticated()) {
                          setShowLoginModal(true);
                        }
                      }}
                    />

                    <button
                      type="submit"
                      disabled={isPending || !id_user_twibbons}
                      className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px]"
                    >
                      {isPending ? (
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>

                {/* Loading state for comments */}
                {isLoading && (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">Memuat komentar...</p>
                  </div>
                )}

                {/* Daftar komentar */}
                <div className="space-y-4">
                  {!isLoading && komentars.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">Belum ada komentar</p>
                      <p className="text-sm text-gray-400">Mulai percakapan</p>
                    </div>
                  ) : (
                    komentars.map((c) => {
                      const isExpanded = expandedComments.has(c.id);
                      const shouldTruncate = c.comment.length > 100;
                      const displayComment = isExpanded || !shouldTruncate 
                        ? c.comment 
                        : c.comment.slice(0, 100);

                      return (
                        <div key={c.id} className="flex space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600">
                            <span className="text-xs font-bold text-white">
                              {getUserInitials(c.user)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="px-3 py-2 bg-gray-100 rounded-lg">
                              <div className="text-sm font-medium text-gray-800 truncate">
                                {truncateText(c.user, 25)}
                              </div>
                              <div className="text-sm text-gray-700 break-words break-all overflow-wrap-anywhere">
                                {displayComment}
                                {shouldTruncate && (
                                  <button
                                    onClick={() => toggleCommentExpansion(c.id)}
                                    className="inline-block ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                                  >
                                    {isExpanded ? "Sembunyikan" : "Selengkapnya"}
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="mt-1 ml-3 text-xs text-gray-500">
                              {c.time}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalAlert>
  );

  const DesktopVersion = () => (
    <ModalAlert onClose={onClose}>
      <div
        className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl"
        style={{ height: "80vh" }}
      >
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
                    ? infoUser?.data?.caption || ""
                    : (infoUser?.data?.caption?.slice(0, 100) ?? "")}
                </div>
                {infoUser?.data?.caption?.length > 100 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    {showFullDescription ? "Sembunyikan" : "Selengkapnya"}
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-xs font-bold text-white">
                    {getUserInitials(infoUser?.data?.author?.user_firstname || "Unknown User")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-700 truncate">
                    {truncateText(infoUser?.data?.author?.user_firstname || "Unknown User", 20)}
                  </div>
                  <div className="text-xs truncate">
                    @{truncateText(infoUser?.data?.author?.user_email || "unknown@email.com", 25)}
                  </div>
                </div>
              </div>
            </div>

            {/* Komentar Section */}
            <div className="flex flex-col flex-1 min-h-0">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                  <MessageCircle className="w-5 h-5" /> Komentar
                </h3>
              </div>

              {/* Form input komentar */}
              <div className="p-4 border-b border-gray-200">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex space-x-3"
                >
                  <div className="flex flex-1 space-x-2">
                    <input
                      {...register("comment", { required: true })}
                      type="text"
                      placeholder="Bagikan pesan kamu..."
                      className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                      disabled={isPending || !id_user_twibbons}
                      onFocus={() => {
                        if (!isAuthenticated()) {
                          setShowLoginModal(true);
                        }
                      }}
                    />

                    <button
                      type="submit"
                      disabled={isPending || !id_user_twibbons}
                      className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px]"
                    >
                      {isPending ? (
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center flex-1">
                  <p className="text-gray-500">Memuat komentar...</p>
                </div>
              )}

              {/* Daftar komentar */}
              {!isLoading && (
                <div className="flex-1 min-h-0 px-6 py-4 space-y-4 overflow-y-auto">
                  {komentars.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">Belum ada komentar</p>
                      <p className="text-sm text-gray-400">Mulai percakapan</p>
                    </div>
                  ) : (
                    komentars.map((c) => {
                      const isExpanded = expandedComments.has(c.id);
                      const shouldTruncate = c.comment.length > 100;
                      const displayComment = isExpanded || !shouldTruncate 
                        ? c.comment 
                        : c.comment.slice(0, 100);

                      return (
                        <div key={c.id} className="flex space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600">
                            <span className="text-xs font-bold text-white">
                              {getUserInitials(c.user)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="px-3 py-2 bg-gray-100 rounded-lg">
                              <div className="text-sm font-medium text-gray-800 truncate">
                                {truncateText(c.user, 25)}
                              </div>
                              <div className="text-sm text-gray-700 break-words break-all overflow-wrap-anywhere">
                                {displayComment}
                                {shouldTruncate && (
                                  <button
                                    onClick={() => toggleCommentExpansion(c.id)}
                                    className="inline-block ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                                  >
                                    {isExpanded ? "Sembunyikan" : "Selengkapnya"}
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="mt-1 ml-3 text-xs text-gray-500">
                              {c.time}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onLoginSuccess={handleLoginSuccess}
      />
    </ModalAlert>
  );

  // Render based on isMobile state
  return (
    <>
      {isMobile ? <MobileVersion /> : <DesktopVersion />}

      {/* Login Modal for Mobile */}
      {isMobile && (
        <ModalLogin
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}

export default DetailResult;