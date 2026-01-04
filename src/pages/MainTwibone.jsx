import React, { useEffect, useState, useRef } from "react";
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
  Bookmark,
  Copy,
} from "lucide-react";
import CardEditor from "../components/cards/CardEditor";
import CardResult from "../components/cards/CardResult";
import Bg1 from "../assets/images/background_hero.png";
import Footer from "../components/layoutpage/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import useImageStore from "../helper/store/imagestore";
import DetailResult from "../components/modal/DetailResult";
import { useGET, usePOST, useDELETE } from "../services/api";
import LoadingPage from "../components/layoutpage/LoadingPage";
import useTwibbonStore from "../helper/store/TwiboneUser";
import { useModalStore } from "../helper/store/modal.store";
import NotFound from "./NotfoundPage";
import ModalLogin from "../components/modal/modalLogin";
import { useGlobalStore } from "../helper/store/global.store";
import ShareModal from "../components/modal/ShareModal";
import DetailSkeleton from "../components/skeletons/DetailSkeleton.jsx";
function MainTwibone() {
  const { t } = useTranslation();
  const { image, setImage, setFrameImage, frameImage } = useImageStore();
  const navigate = useNavigate();
  const { slug } = useParams();
  const {
    data: twibbon,
    isLoading,
    refetch,
  } = useGET(`twibbon/${slug}?page=1&perPage=20`);
  const { data: bookmark, refetch: refetchBookmarks } = useGET(`bookmarks`);
  const { data: subscriptionData } = useGET("/detail-subscription");

  const { openToast } = useModalStore();
  const { token, role } = useGlobalStore();
  const BookmarkMutation = usePOST(`/bookmark`);
  const DeleteBookmarkMutation = useDELETE(`/bookmark`);
  const ViewTrackingMutation = usePOST(`/twibbon/view`);
  const [cards, setCards] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const [shareData, setShareData] = useState({
    title: "",
    url: "",
    description: "",
  });

  // State untuk infinite scroll fullscreen
  const [fullscreenPage, setFullscreenPage] = useState(1);
  const [allFullscreenCards, setAllFullscreenCards] = useState([]);
  const [hasNextPageFullscreen, setHasNextPageFullscreen] = useState(false);
  const [isLoadingMoreFullscreen, setIsLoadingMoreFullscreen] = useState(false);
  const observerTarget = useRef(null);

  // API call untuk fullscreen dengan pagination
  const fullscreenApiUrl = `twibbon/${slug}?page=${fullscreenPage}&perPage=20`;
  const { data: fullscreenData, isLoading: isLoadingFullscreen } = useGET(
    isFullscreen ? fullscreenApiUrl : null
  );

  useEffect(() => {
    refetch();
  }, [slug, refetch]);

  useEffect(() => {
    setShowDetailModal(false);
    setSelectedCard(null);
  }, [slug]);

  useEffect(() => {
    if (twibbon?.data) {
      // Set bookmark status dari response API twibbon
      const isBookmarked =
        twibbon.data.bookmark !== null &&
        twibbon.data.bookmark !== undefined &&
        typeof twibbon.data.bookmark === "object" &&
        twibbon.data.bookmark.user_id;

      setBookmarked(isBookmarked);

      useTwibbonStore.getState().setTwibbonData({
        ...twibbon.data,
        watermark: twibbon.watermark,
      });
      const userCards = twibbon.data.user_twibbons.map((utw) => ({
        id: utw.id,
        image: `${import.meta.env.VITE_FILE_URL}${utw.image_url}`,
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

  // Effect untuk set bookmark ID dari list bookmarks
  useEffect(() => {
    if (bookmark?.data && twibbon?.data?.id) {
      // Cari bookmark yang sesuai dengan event_twibbon_id saat ini
      const currentBookmark = bookmark.data.find(
        (bm) => bm.event_twibbon_id === twibbon.data.id
      );

      if (currentBookmark) {
        setBookmarkId(currentBookmark.id);
      } else {
        setBookmarkId(null);
      }
    }
  }, [bookmark, twibbon]);

  useEffect(() => {
    if (twibbon?.data?.template_twibbon) {
      const imageURL = `${import.meta.env.VITE_FILE_URL}${
        twibbon.data.template_twibbon
      }`;
      setFrameImage(imageURL);
    }
  }, [twibbon?.data?.template_twibbon, setFrameImage]);

  useEffect(() => {
    if (image) {
      setImage(null);
    }
  }, [slug]);

  // Track view when page loads
  useEffect(() => {
    const trackView = async () => {
      // Only track if twibbon data is loaded and we haven't tracked yet
      if (twibbon?.data?.id && !viewTracked) {
        try {
          await ViewTrackingMutation.mutateAsync({
            url: `/twibbon/${twibbon.data.id}/view`,
            data: {},
          });
          setViewTracked(true);
          console.log("View tracked successfully");
        } catch (error) {
          console.error("Failed to track view:", error);
          // Don't show error to user, just log it
        }
      }
    };

    trackView();
  }, [twibbon?.data?.id]);

  // Reset view tracking when slug changes
  useEffect(() => {
    setViewTracked(false);
  }, [slug]);

  // Reset pagination saat buka fullscreen
  useEffect(() => {
    if (isFullscreen) {
      setFullscreenPage(1);
      setAllFullscreenCards([]);
    }
  }, [isFullscreen]);

  // Update data fullscreen saat response datang
  useEffect(() => {
    if (fullscreenData?.data) {
      const newCards = fullscreenData.data.user_twibbons.map((utw) => ({
        id: utw.id,
        image: `${API_BASE_URL}${utw.image_url}`,
        description: utw.caption || "",
        title: fullscreenData.data.title,
        status: "",
        eventTitle: fullscreenData.data.title,
        creator: utw.user_id,
        user_twibbon_id: utw.id,
      }));

      const pagination = fullscreenData.pagination;

      if (fullscreenPage === 1) {
        setAllFullscreenCards(newCards);
      } else {
        setAllFullscreenCards((prev) => [...prev, ...newCards]);
      }

      setHasNextPageFullscreen(pagination?.has_next || false);
      setIsLoadingMoreFullscreen(false);
    }
  }, [fullscreenData, fullscreenPage]);

  // Intersection Observer untuk infinite scroll fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPageFullscreen &&
          !isLoadingFullscreen &&
          !isLoadingMoreFullscreen
        ) {
          setIsLoadingMoreFullscreen(true);
          setFullscreenPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [
    isFullscreen,
    hasNextPageFullscreen,
    isLoadingFullscreen,
    isLoadingMoreFullscreen,
  ]);

  const handleCardClick = (cardId) => {
    const card = isFullscreen
      ? allFullscreenCards.find((c) => c.id === cardId)
      : cards.find((c) => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setShowDetailModal(true);
    }
  };

  // Fungsi untuk menangani share
  const handleShare = (card) => {
    setShareData({
      title: card.title,
      url: window.location.href,
      description:
        card.description || t("main.share_text", { title: card.title }),
    });
    setShowShareModal(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleBookmark = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      if (bookmarked && bookmarkId) {
        const response = await DeleteBookmarkMutation.mutateAsync(
          `/bookmark/${bookmarkId}`
        );

        if (response?.status === 200) {
          setBookmarked(false);
          setBookmarkId(null);

          setTimeout(() => {
            refetch();
            refetchBookmarks();
          }, 100);

          openToast("toast", true, t("main.bookmark_removed"), "success");
        }
      } else {
        const response = await BookmarkMutation.mutateAsync({
          url: "/bookmark",
          data: {
            event_twibbon_id: twibbon?.data?.id,
          },
        });

        if (response?.status === 200 || response?.status === 201) {
          setBookmarked(true);

          if (response?.data?.data?.id) {
            setBookmarkId(response.data.data.id);
          } else if (response?.data?.id) {
            setBookmarkId(response.data.id);
          }

          setTimeout(() => {
            refetch();
            if (refetchBookmarks) {
              refetchBookmarks();
            }
          }, 100);

          openToast("toast", true, t("main.bookmark_success"), "success");
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error);

      // Cek jika error 401 atau 403 (unauthorized/forbidden)
      const status = error?.response?.status || error?.status;
      if (status === 401 || status === 403) {
        setShowLoginModal(true);
        openToast("toast", true, t("main.please_login"), "warning");
      } else {
        openToast("toast", true, t("main.bookmark_failed"), "error");
      }
    }
  };

  const handleLoginSuccess = async () => {
    await Promise.all([refetch(), refetchBookmarks()]);
    setShowLoginModal(false);
  };

  if (isLoading) return <DetailSkeleton />;
  if (!isLoading && !twibbon?.data) {
    return <NotFound />;
  }

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
            <div className="flex justify-center items-center w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-800">
              <ImageOff className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex absolute -right-1 -bottom-1 justify-center items-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900">
              <Users className="w-4 h-4 text-primary-500 dark:text-primary-400" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {t("main.no_posts_yet")}
            </h3>
            <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {t("main.be_first_to_post")}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex mt-6 space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse bg-primary-200 dark:bg-primary-600"></div>
            <div className="w-2 h-2 rounded-full delay-100 animate-pulse bg-primary-300 dark:bg-primary-500"></div>
            <div className="w-2 h-2 rounded-full delay-200 animate-pulse bg-primary-400 dark:bg-primary-400"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderLoadingMore = () => {
    if (!isLoadingMoreFullscreen) return null;

    return (
      <div className="flex col-span-full justify-center items-center py-8">
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full border-4 animate-spin border-primary-400 dark:border-primary-500 border-t-transparent"></div>
          <span className="text-gray-600 dark:text-gray-400">
            {t("explore.loading_more") || "Loading more..."}
          </span>
        </div>
      </div>
    );
  };

  const renderFullscreenModal = () => {
    if (!isFullscreen) return null;

    return (
      <div className="fixed inset-0 z-40 bg-white dark:bg-gray-900">
        <NavbarEditor
          title={twibbon?.data?.title || t("main.no_title")}
          disableModalExit={true}
          onExit={() => setIsFullscreen(false)}
        />

        {/* Content area */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto p-6">
          <div className="mx-auto">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-8">
              {allFullscreenCards.map((card) => (
                <div key={card.id} className="w-full aspect-square">
                  <CardResult
                    src={card.image}
                    onClick={() => handleCardClick(card.id)}
                    onShare={() => handleShare(card)}
                  />
                </div>
              ))}

              {/* Loading More Indicator */}
              {renderLoadingMore()}
            </div>

            {/* Intersection Observer Target */}
            {hasNextPageFullscreen && allFullscreenCards.length > 0 && (
              <div ref={observerTarget} className="h-10" />
            )}

            {/* End of Results Message */}
            {!hasNextPageFullscreen &&
              allFullscreenCards.length > 0 &&
              !isLoadingMoreFullscreen && (
                <div className="py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("explore.end_of_results") ||
                      "You've reached the end of the results"}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white">
      <Navbar />
      <header className="container px-3 py-3 m-5 mx-auto bg-white dark:bg-gray-900 dark:text-white">
        <div className="grid grid-cols-1 items-center lg:grid-cols-3">
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-medium capitalize truncate">
              {twibbon?.data?.title || t("main.no_title")}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-400 hover:underline">
              <Link to={`/user/${twibbon.data.contributor.username}`}>
                {twibbon?.data?.contributor?.fullname}
              </Link>
            </p>
          </div>

          <div className="flex justify-start items-center mt-2 space-x-2 lg:justify-center">
            <User className="w-5 h-5 dark:text-gray-300" />
            <div>
              <span className="text-sm">{t("main.supporters")}</span>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {twibbon?.data?.supports ?? 0}
              </div>
            </div>
          </div>
          <div className="hidden justify-end items-center space-x-4 lg:flex">
            <div className="flex overflow-hidden relative items-center bg-gray-100 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
              <span className="px-3 py-2 text-sm text-gray-500 bg-gray-200 select-none dark:bg-gray-700 dark:text-gray-300">
                MyTwibbon/
              </span>

              <input
                type="text"
                readOnly
                value={twibbon?.data?.link?.replace(/^https?:\/\/[^/]+\//, "")}
                onClick={() => {
                  navigator.clipboard.writeText(twibbon?.data?.link);
                  openToast("toast", true, t("main.copy_success"), "success");
                }}
                className="px-3 py-2 text-sm text-gray-800 bg-transparent dark:text-gray-200 focus:outline-none w-[160px] truncate cursor-pointer pr-10"
                title={twibbon?.data?.link}
              />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(twibbon?.data?.link);
                  openToast("toast", true, t("main.copy_success"), "success");
                }}
                className="absolute right-2 p-1 text-gray-500 rounded transition-all hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 h-full lg:grid-cols-2">
        <div
          className="flex relative justify-center items-center p-4"
          style={{
            backgroundImage: `url(${Bg1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay khusus dark mode */}
          <div className="hidden absolute inset-0 bg-black/60 dark:block"></div>

          {/* Konten */}
          <div className="relative z-10 w-full lg:max-w-lg">
            <CardEditor
              frameImage={frameImage}
              event_twibbon_id={twibbon?.data?.id}
              SubscribeData={subscriptionData?.data}
              templateType={twibbon?.data?.type || "frame"}
              watermarkRequired={
                twibbon?.watermark || twibbon?.data?.watermark || false
              }
              isSubscribed={subscriptionData?.data?.some(
                (sub) => sub.status === "ACTIVE"
              )}
            />
          </div>
        </div>

        <div className="overflow-y-auto relative justify-center p-4 h-full bg-white dark:bg-gray-900">
          {cards.length > 9 && (
            <button
              onClick={toggleFullscreen}
              className="flex absolute top-4 right-4 z-10 justify-center items-center p-3 text-white rounded-full shadow-lg transition-colors duration-200 bg-primary-600 opacity-85 hover:bg-primary-700 hover:opacity-100"
              aria-label={t("main.view_all_images")}
              title={t("main.view_all_images")}
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

      {/* HPSHARE */}
      <div className="mb-6 border-t border-gray-200 dark:border-gray-600 lg:hidden"></div>
      <div className="lg:hidden">
        <div className="flex flex-col mx-3 min-w-0">
          <h3 className="font-medium capitalize truncate text-md">
            {twibbon?.data?.title || t("main.no_title")}
          </h3>
        </div>
        <div className="flex items-center mx-3 my-10 mt-2 space-x-2">
          {/* Box Link */}
          <div className="flex overflow-hidden flex-1 bg-gray-100 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
            <span className="px-3 py-2 text-sm text-gray-500 bg-gray-200 select-none dark:bg-gray-700 dark:text-gray-300">
              TwibbonGypem/
            </span>
            <input
              type="text"
              readOnly
              value={twibbon?.data?.link?.replace(/^https?:\/\/[^/]+\//, "")}
              onClick={() => {
                navigator.clipboard.writeText(twibbon?.data?.link);
                openToast("toast", true, t("main.copy_success"), "success");
              }}
              className="px-3 py-2 text-sm text-gray-800 bg-transparent dark:text-gray-200 focus:outline-none w-[160px] truncate cursor-pointer"
              title={twibbon?.data?.link}
            />
          </div>

          {/* Tombol Bookmark */}
          <button
            onClick={toggleBookmark}
            className="flex justify-center items-center w-10 h-10 bg-gray-100 rounded-lg border border-gray-300 transition dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Bookmark"
          >
            <Bookmark
              size={18}
              className={
                bookmarked
                  ? "fill-primary-500 text-primary-500"
                  : "text-gray-500 dark:text-gray-300"
              }
            />
          </button>
        </div>
      </div>
      <Footer />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareData={shareData}
      />
      {showLoginModal && (
        <ModalLogin
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default MainTwibone;
