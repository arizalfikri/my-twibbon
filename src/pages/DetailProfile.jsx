import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Users, Trophy, Share2 } from "lucide-react";
import { useGET, useDELETE } from "../services/api.js";
import Navbar from "../components/layoutpage/Navbar.jsx";
import Bg1 from "../assets/images/background_hero.png";
import CardProfile from "../components/cards/CardProfile.jsx";
import CardPost from "../components/cards/CardPost.jsx";
import DetailResult from "../components/modal/DetailResult.jsx";
import ModalDeleteTwibone from "../components/modal/ModalDeleteTwibone.jsx";
import ModalDeletePost from "../components/modal/ModalDeletePost.jsx";
import { useGlobalStore } from "../helper/store/global.store.js";
import Footer from "../components/layoutpage/Footer.jsx";
import ModalEditTwibonne from "../components/modal/ModalEditTwibonne.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useModalStore } from "../helper/store/modal.store.js";
import CardCollections from "../components/cards/CardCollection.jsx";
import ModalDeleteCollection from "../components/modal/ModalDeleteCollection.jsx";
import ShareModal from "../components/modal/ShareModal.jsx"; // Import ShareModal

const DetailProfile = () => {
  const { t } = useTranslation();
  const { openToast } = useModalStore();

  const { data: profileData, isLoading, refetch } = useGET("/my-twibbons");
  // Paginated fetch for "My Twibbons" to support infinite scroll
  const [currentPage, setCurrentPage] = useState(1);
  const [allMyTwibbons, setAllMyTwibbons] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const {
    data: myTwibbonsData,
    isLoading: myTwibbonsLoading,
    refetch: refetchMyTwibbons,
  } = useGET(`/my-twibbons?page=${currentPage}`);
  const {
    data: SubscribeData,
    isLoading: subscribeLoading,
    refetch: refetchLoading,
  } = useGET("/detail-subscription");
  const {
    data: ProfilData,
    isLoading: ProfilLoading,
    refetch: refetchProfil,
  } = useGET("/my-profile");
  const {
    data: userPostsData,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useGET("/event-user-twibbons");

  const {
    data: userCollectionsData,
    isLoading: collectionsLoading,
    refetch: refetchCollections,
  } = useGET("/bookmarks");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);

  // States untuk posts
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [selectedPostData, setSelectedPostData] = useState(null);

  // State untuk share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({
    title: "",
    url: "",
    description: "",
  });

  const [showDeleteCollectionModal, setShowDeleteCollectionModal] =
    useState(false);
  const { email, token, fullname, role } = useGlobalStore();
  const [activeTab, setActiveTab] = useState("Campaign");
  const navigate = useNavigate();

  const userData = profileData || {};
  // Use the paginated list if available, otherwise fallback to profileData's data
  const twibbonData = allMyTwibbons.length
    ? allMyTwibbons
    : userData.data || [];
  const supports = ProfilData?.data?.supports || 0;
  const userFullname = userData.fullname || fullname;
  const userEmail = userData.email || email;

  // Extract posts data
  const userPosts = userPostsData?.data || [];

  // Extract subscription data
  const subscriptions = SubscribeData?.data || [];

  // Cari subscription berdasarkan type
  const contributorSubscription = subscriptions.find(
    (sub) => sub.plan?.type?.toLowerCase() === "contributor"
  );

  const participantSubscription = subscriptions.find(
    (sub) => sub.plan?.type?.toLowerCase() === "participant"
  );

  useEffect(() => {
    const isProfileError =
      profileData?.status === 401 || profileData?.status === 403;
    const isPostsError =
      userPostsData?.status === 401 || userPostsData?.status === 403;
    const isCollectionsError =
      userCollectionsData?.status === 401 ||
      userCollectionsData?.status === 403;

    if (isProfileError && isPostsError && isCollectionsError) {
      const { setEmail, setToken, setFullName, setRole } =
        useGlobalStore.getState();
      setEmail(null);
      setToken(null);
      setFullName(null);
      setRole(null);

      localStorage.clear();

      window.dispatchEvent(new Event("storage"));

      openToast(
        "toast",
        true,
        "Sesi telah berakhir. Silakan login kembali.",
        "error"
      );

      setTimeout(() => {
        navigate("/SignIn", { replace: true });
      }, 1000);
    }
  }, [profileData, userPostsData, userCollectionsData, navigate, openToast]);

  // Update paginated my-twibbons data when response arrives
  useEffect(() => {
    if (myTwibbonsData?.data) {
      const newData = myTwibbonsData.data;
      const pagination = myTwibbonsData.pagination;

      if (currentPage === 1) {
        setAllMyTwibbons(newData);
      } else {
        setAllMyTwibbons((prev) => [...prev, ...newData]);
      }

      setHasNextPage(pagination?.has_next || false);
      setIsLoadingMore(false);
    }
  }, [myTwibbonsData, currentPage]);

  useEffect(() => {
    refetch();
    refetchPosts();
    refetchCollections();
    // refresh paginated my-twibbons as well
    setCurrentPage(1);
    setAllMyTwibbons([]);
    refetchMyTwibbons();
  }, [refetch, refetchPosts, refetchCollections]);

  // Intersection observer for infinite scrolling of my-twibbons
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !myTwibbonsLoading &&
          !isLoadingMore
        ) {
          setIsLoadingMore(true);
          setCurrentPage((prev) => prev + 1);
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
  }, [hasNextPage, myTwibbonsLoading, isLoadingMore]);

  // Semua tabs muncul untuk semua role
  const availableTabs = [
    t("profile.campaign"),
    t("profile.posts"),
    "Collections",
  ];

  useEffect(() => {
    if (!role) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("fullname");
      localStorage.removeItem("role");
      openToast(
        "toast",
        true,
        "Sesi telah berakhir. Silakan login kembali.",
        "error"
      );

      navigate("/SignIn");
    }
  }, [role, navigate]);

  // Share handlers
  const handlePostShare = (post) => {
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const title = post.caption || "Check out this post!";

    setShareData({
      title: title,
      url: shareUrl,
      description: post.caption || "",
    });
    setShowShareModal(true);
  };

  const handleCollectionShare = (twibbon) => {
    if (!twibbon) {
      openToast("toast", true, t("main.twibbon_not_found"), "error");
      return;
    }

    const shareUrl = `${window.location.origin}/${twibbon.slug || ""}`;
    const title = twibbon.title || "Check out this twibbon!";

    setShareData({
      title: title,
      url: shareUrl,
      description: twibbon.title || "",
    });
    setShowShareModal(true);
  };

  const handleProfileShare = () => {
    const shareUrl = `${window.location.origin}/user/${ProfilData?.data?.username}`;
    const title = `Check out ${ProfilData?.data?.username}'s profile!`;

    setShareData({
      title: title,
      url: shareUrl,
      description: `View ${ProfilData?.data?.username} 's campaigns and posts on our platform`,
    });
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareData({
      title: "",
      url: "",
      description: "",
    });
  };

  // Campaign handlers
  const handleDeleteClick = (itemId) => {
    setSelectedItemId(itemId);
    setShowDeleteModal(true);
  };

  const handleEditClick = (itemData) => {
    setSelectedItemData(itemData);
    setShowEditModal(true);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    setSelectedItemId(null);
    refetch();
    // refresh paginated my-twibbons
    setCurrentPage(1);
    setAllMyTwibbons([]);
    refetchMyTwibbons();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedItemData(null);
    refetch();
    // refresh paginated my-twibbons
    setCurrentPage(1);
    setAllMyTwibbons([]);
    refetchMyTwibbons();
  };

  // Post handlers
  const handlePostDelete = (postId) => {
    setSelectedPostId(postId);
    setShowDeletePostModal(true);
  };

  const handleCollectionDelete = (collectionId) => {
    setSelectedCollectionId(collectionId);
    setShowDeleteCollectionModal(true);
  };

  const handlePostClick = (post) => {
    const transformedData = {
      id: post.id,
      title: post.event_twibbon?.title || post.caption || "Post",
      image: `${import.meta.env.VITE_FILE_URL}${post.image_url}`,
      status: "Active",
      author: post.event_twibbon?.contributor?.fullname || "Unknown",
    };

    setSelectedPostData(transformedData);
    setShowPostDetailModal(true);
  };

  const handlePostDeleteSuccess = () => {
    setShowDeletePostModal(false);
    setSelectedPostId(null);
    refetchPosts();
    openToast("toast", true, t("main.post_deleted_successfully"), "success");
  };

  const handleCollectionDeleteSuccess = () => {
    setShowDeleteCollectionModal(false);
    setSelectedCollectionId(null);
    refetchCollections();
    openToast("toast", true, t("profile.collection_deleted"), "success");
    setCurrentPage(1);
    setAllMyTwibbons([]);
    refetchMyTwibbons();
  };

  // Helper function untuk render subscription status
  const renderSubscriptionStatus = (subscription, type) => {
    if (!subscription) {
      return (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {type === "contributor"
              ? "Creator Membership"
              : "Supporter Membership"}
          </p>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            {t("profile.membership_status.not_subscribed")}
          </p>
          <button
            onClick={() => navigate("/membership")}
            className="w-full px-3 py-2 text-xs font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
          >
            {t("profile.membership_status.subscribe_now")}
          </button>
        </div>
      );
    }

    const status = subscription.status;
    const planName = subscription.plan?.name || "Unknown Plan";

    return (
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {type === "contributor"
            ? "Creator Membership"
            : "Supporter Membership"}{" "}
          - {planName}
        </p>

        {status === "ACTIVE" ? (
          <div>
            <p className="mb-3 text-sm font-medium text-green-600 dark:text-green-400">
              {t("profile.membership_status.active")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Berlaku hingga:{" "}
              {new Date(subscription.end_date).toLocaleDateString("id-ID")}
            </p>
          </div>
        ) : status === "PENDING" ? (
          <div>
            <p className="mb-3 text-sm font-medium text-yellow-600 dark:text-yellow-400">
              {t("profile.membership_status.pending")}
            </p>
            <button
              onClick={() => {
                type === "contributor"
                  ? navigate("/checkout?type=contributor")
                  : navigate("/checkout?type=participant");
              }}
              className="w-full px-3 py-2 text-xs font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
            >
              {t("profile.membership_status.continue_payment")}
            </button>
          </div>
        ) : status === "FAILED" ? (
          <div>
            <p className="mb-3 text-sm font-medium text-red-600 dark:text-red-400">
              {t("profile.membership_status.canceled")}
            </p>
            <button
              onClick={() => navigate("/membership")}
              className="w-full px-3 py-2 text-xs font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
            >
              {t("profile.membership_status.subscribe_now")}
            </button>
          </div>
        ) : status === "EXPIRED" ? (
          <div>
            <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("profile.membership_status.expired")}
            </p>
            <button
              onClick={() => navigate("/membership")}
              className="w-full px-3 py-2 text-xs font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
            >
              {t("profile.membership_status.renew_subscription")}
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {t("profile.membership_status.not_subscribed")}
            </p>
            <button
              onClick={() => navigate("/membership")}
              className="w-full px-3 py-2 text-xs font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
            >
              {t("profile.membership_status.subscribe_now")}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={closeShareModal}
        shareData={shareData}
      />

      {/* Hero Section with Profile */}
      <div className="relative">
        <div
          className="relative overflow-hidden bg-center bg-cover h-80"
          style={{
            backgroundImage: `url(${Bg1})`,
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10"></div>
        </div>

        {/* Profile Content */}
        <div className="container relative px-6 mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Profile Section */}
            <div className="flex-1">
              {/* Profile Avatar and Info */}
              <div className="flex items-end mb-8 -mt-20">
                <div className="relative">
                  <div className="flex items-center justify-center w-32 h-32 bg-white border-4 border-white rounded-full shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900">
                      <Users className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {userFullname}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  @{userEmail}
                </p>
              </div>

              <div className="flex gap-4 mb-8">
                <Link to="/EditProfile">
                  <button className="flex items-center gap-2 px-4 py-2 transition-colors bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Edit className="w-4 h-4 dark:text-white" />
                    <p className="text-gray-700 dark:text-gray-300">
                      {t("profile.edit_profile")}
                    </p>
                  </button>
                </Link>

                {/* Share Profile Button */}
                <button
                  onClick={handleProfileShare}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
                >
                  <Share2 className="w-4 h-4" />
                  {t("main.share_profile")}
                </button>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="mt-5 lg:w-80">
              <div className="p-6 space-y-4 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                {/* Supporters */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {t("main.supporters")}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {supports}
                  </span>
                </div>

                {/* Campaigns */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {`${t("profile.campaigns")}`}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {twibbonData?.length}
                  </span>
                </div>

                {/* Posts */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {`${t("profile.posts")}`}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {userPosts?.length}
                  </span>
                </div>
              </div>

              {/* Subscription Status Box */}
              <div className="mt-5 lg:w-80">
                {subscribeLoading ? (
                  <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">
                      Memuat status...
                    </p>
                  </div>
                ) : (
                  <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-4 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">
                      {t("profile.membership_status.title")}
                    </h3>

                    {/* Contributor Subscription */}
                    {renderSubscriptionStatus(
                      contributorSubscription,
                      "contributor"
                    )}

                    {/* Participant Subscription */}
                    {renderSubscriptionStatus(
                      participantSubscription,
                      "participant"
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="container w-full px-4 mx-auto sm:px-6 lg:px-8">
        {/* Content Section */}
        <div className="container px-6 py-8 mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Content */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex space-x-8">
                  {availableTabs.map((tab, index) => {
                    const tabKey =
                      tab === t("profile.campaign")
                        ? "Campaign"
                        : tab === t("profile.posts")
                        ? "Posts"
                        : "Collections";

                    return (
                      <button
                        key={index}
                        onClick={() => setActiveTab(tabKey)}
                        className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tabKey
                            ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campaign Content */}
              {activeTab === "Campaign" && (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
                  {twibbonData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center col-span-4 py-16 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-gray-800">
                        <Edit className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        {t("main.no_twibbon_yet")}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("profile.twibbone_will_appear")}
                      </p>
                    </div>
                  ) : (
                    <>
                      {twibbonData.map((twibon) => (
                        <CardProfile
                          key={twibon.id}
                          twibon={{
                            id: twibon.id,
                            title: twibon.title || t("main.no_title"),
                            author: userFullname || "Gypem",
                            supports: twibon?.supports ?? 0,
                            slug: twibon.slug_event_twibbon,
                            image: twibon.template_twibbon,
                            caption: twibon.caption,
                            url: twibon.url,
                          }}
                          onDelete={handleDeleteClick}
                          onEdit={handleEditClick}
                        />
                      ))}

                      {/* Loading more indicator for infinite scroll */}
                      {isLoadingMore && (
                        <div className="flex items-center justify-center py-6 col-span-full">
                          <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
                        </div>
                      )}

                      {/* Intersection observer target to trigger next page load */}
                      {hasNextPage && twibbonData.length > 0 && (
                        <div ref={observerTarget} className="h-6" />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Posts Content */}
              {activeTab === "Posts" && (
                <div>
                  {postsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
                    </div>
                  ) : userPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-gray-800">
                        <Edit className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        {t("main.no_posts_yet")}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("profile.posts_will_appear")}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
                      {userPosts.map((post) => (
                        <CardPost
                          key={post.id}
                          post={post}
                          onDelete={handlePostDelete}
                          onShare={handlePostShare}
                          onCardClick={handlePostClick}
                          showActions={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Collections Content */}
              {activeTab === "Collections" && (
                <div>
                  {collectionsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
                    </div>
                  ) : userCollectionsData?.data?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-gray-800">
                        <Trophy className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        {t("profile.no_collections")}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("profile.collections_will_appear")}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {userCollectionsData.data?.map((twibon) => (
                        <CardCollections
                          key={twibon.id}
                          collectionId={twibon.id}
                          twibon={{
                            id: twibon.id,
                            title: twibon.event_twibbon?.title,
                            author: twibon.event_twibbon?.author,
                            supports: twibon.event_twibbon?.supports,
                            slug: twibon.event_twibbon?.slug_event_twibbon,
                            image: twibon.event_twibbon?.template_twibbon,
                          }}
                          onShare={handleCollectionShare}
                          onDelete={handleCollectionDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ModalDeleteTwibone
        visibel={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItemId(null);
        }}
        onDeleteSuccess={handleDeleteSuccess}
        itemId={selectedItemId}
      />

      <ModalEditTwibonne
        visibel={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItemData(null);
        }}
        onEditSuccess={handleEditSuccess}
        itemData={selectedItemData}
      />

      <ModalDeletePost
        visible={showDeletePostModal}
        onClose={() => {
          setShowDeletePostModal(false);
          setSelectedPostId(null);
        }}
        onDeleteSuccess={handlePostDeleteSuccess}
        postId={selectedPostId}
      />

      <ModalDeleteCollection
        visible={showDeleteCollectionModal}
        onClose={() => {
          setShowDeleteCollectionModal(false);
          setSelectedCollectionId(null);
        }}
        onDeleteSuccess={handleCollectionDeleteSuccess}
        collectionId={selectedCollectionId}
      />

      <DetailResult
        isOpen={showPostDetailModal}
        onClose={() => setShowPostDetailModal(false)}
        cardData={selectedPostData}
        id_user_twibbons={selectedPostData?.id}
      />

      <Footer />
    </div>
  );
};

export default DetailProfile;
