import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Users, Trophy } from "lucide-react";
import { useGET, useDELETE } from "../services/api.js";
import Navbar from "../components/layoutpage/Navbar.jsx";
import Bg1 from "../assets/images/background_hero3.png";
import CardProfile from "../components/cards/CardProfile.jsx";
import CardPost from "../components/cards/CardPost.jsx"; // Import CardPost
import DetailResult from "../components/modal/DetailResult.jsx"; // Import DetailResult untuk modal
import ModalDeleteTwibone from "../components/modal/ModalDeleteTwibone.jsx";
import ModalDeletePost from "../components/modal/ModalDeletePost.jsx"; // Perlu dibuat modal delete post
import { useGlobalStore } from "../helper/store/global.store.js";
import Footer from "../components/layoutpage/Footer.jsx";
import ModalEditTwibonne from "../components/modal/ModalEditTwibonne.jsx";
import { Link, useNavigate } from "react-router-dom";
import EmptyTwibbon from "../components/common/EmptyTwibbon.jsx";
import { useModalStore } from "../helper/store/modal.store.js";
import CardCollections from "../components/cards/CardCollection.jsx";
import ModalDeleteCollection from "../components/modal/ModalDeleteCollection.jsx";

const DetailProfile = () => {
  const { t } = useTranslation();
  const { openToast } = useModalStore();
  const { data: profileData, isLoading, refetch } = useGET("/my-profile");
  const {
    data: SubscribeData,
    isLoading: subscribeLoading,
    refetch: refetchLoading,
  } = useGET("/subscription");

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

  const [viewMode, setViewMode] = useState("grid");
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

  const [showDeleteCollectionModal, setShowDeleteCollectionModal] =
    useState(false);
  const { email, token, fullname, role } = useGlobalStore();
  const [activeTab, setActiveTab] = useState("Campaign");
  const navigate = useNavigate();

  // Updated data extraction
  const userData = profileData?.data || {};
  const twibbonData = userData.my_event_twibbons || [];
  const supports = userData.supports || 0;
  const userFullname = userData.fullname || fullname;
  const userEmail = userData.email || email;

  // Extract posts data
  const userPosts = userPostsData?.data || [];

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

  useEffect(() => {
    refetch();
    refetchPosts();
    refetchCollections();
  }, [refetch, refetchPosts, refetchCollections]);

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
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedItemData(null);
    refetch();
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

  const handlePostShare = (post) => {
    // Handle share functionality
    if (navigator.share) {
      navigator.share({
        title: post.caption || "Check out this post!",
        text: post.caption,
        url: window.location.origin + `/post/${post.id}`, // Adjust URL as needed
      });
    } else {
      // Fallback: copy to clipboard
      const shareUrl = window.location.origin + `/post/${post.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        openToast("toast", true, t("main.link_copied"), "success");
      });
    }
  };
  const handleCollectionShare = (twibbon) => {
    console.log(twibbon);
    if (!twibbon) {
      openToast("toast", true, t("main.twibbon_not_found"), "error");
      return;
    }

    const caption = twibbon.caption || "Check out this post!";
    const shareUrl = `${window.location.origin}/${twibbon.slug || ""}`;

    if (navigator.share) {
      navigator
        .share({
          title: caption,
          text: caption,
          url: shareUrl,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareUrl).then(() => {
            openToast("toast", true, t("main.link_copied"), "success");
          });
        });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        openToast("toast", true, t("main.link_copied"), "success");
      });
    }
  };

  const handlePostClick = (post) => {
    // Transform post data to match DetailResult expected format
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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      {/* Hero Section with Profile */}
      <div className="relative">
        <div
          className="relative overflow-hidden bg-center bg-cover h-80"
          style={{
            backgroundImage: `url(${Bg1})`,
            filter: "saturate(300%)",
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10"></div>
        </div>

        {/* Profile Content */}
        <div className="container relative max-w-screen-lg px-6 mx-auto">
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

                    {SubscribeData?.data?.status === "ACTIVE" ? (
                      <div>
                        <p className="mb-3 text-lg font-medium text-green-600 dark:text-green-400">
                          {t("profile.membership_status.active")}
                        </p>
                      </div>
                    ) : SubscribeData?.data?.status === "PENDING" ? (
                      <div>
                        <p className="mb-3 text-lg font-medium text-yellow-600 dark:text-yellow-400">
                          {t("profile.membership_status.pending")}
                        </p>
                        <button
                          onClick={() => navigate("/checkout")}
                          className="w-full px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
                        >
                          {t("profile.membership_status.continue_payment")}
                        </button>
                      </div>
                    ) : SubscribeData?.data?.status === "FAILED" ? (
                      <div>
                        <p className="mb-3 text-lg font-medium text-red-600 dark:text-red-400">
                          {t("profile.membership_status.canceled")}
                        </p>
                        <button
                          onClick={() => navigate("/membership")}
                          className="w-full px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
                        >
                          {t("profile.membership_status.subscribe_now")}
                        </button>
                      </div>
                    ) : SubscribeData?.data?.status === "EXPIRED" ? (
                      <div>
                        <p className="mb-3 text-lg font-medium text-gray-600 dark:text-gray-400">
                          {t("profile.membership_status.expired")}
                        </p>
                        <button
                          onClick={() => navigate("/membership")}
                          className="w-full px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
                        >
                          {t("profile.membership_status.renew_subscription")}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-3 text-lg font-medium text-gray-600 dark:text-gray-400">
                          {t("profile.membership_status.not_subscribed")}
                        </p>
                        <button
                          onClick={() => navigate("/membership")}
                          className="w-full px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
                        >
                          {t("profile.membership_status.subscribe_now")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-screen-lg px-4 mx-auto sm:px-6 lg:px-8">
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
                <div
                  className={`${
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }`}
                >
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
                    twibbonData.map((twibon) => (
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
                        isGrid={viewMode === "grid"}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Posts Content - Updated */}
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

      {/* Post Delete Modal = */}
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

      {/* Post Detail Modal */}
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
