import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Users, Trophy, Share2 } from "lucide-react";
import { useGET } from "../services/api.js";
import { useModalStore } from "../helper/store/modal.store.js";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layoutpage/Navbar.jsx";
import Footer from "../components/layoutpage/Footer.jsx";
import CardHome from "../components/cards/CardHome.jsx";
import CardPost from "../components/cards/CardPost.jsx";
import Bg1 from "../assets/images/background_hero.png";
import DetailResult from "../components/modal/DetailResult.jsx";
import ShareModal from "../components/modal/ShareModal.jsx"; // Import ShareModal

const ProfilePublic = () => {
  const { t } = useTranslation();
  const { openToast } = useModalStore();
  const { username } = useParams();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("Campaign");
  const [currentPage, setCurrentPage] = useState(1);
  const [allMyTwibbons, setAllMyTwibbons] = useState([]);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [selectedPostData, setSelectedPostData] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({
    title: "",
    url: "",
    description: "",
  });

  // Stats state
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  // Refs
  const observerTarget = useRef(null);

  // API calls
  const { data: myprofile } = useGET(`/my-profile`);
  const { data: profileData, refetch: refetchProfile } = useGET(
    `/user/${username}`
  );
  const { data: myTwibbonsData, refetch: refetchMyTwibbons } = useGET(
    `${username}/twibbons?page=${currentPage}`
  );
  const { data: userPostsData, refetch: refetchPosts } = useGET(
    `${username}/postings`
  );

  // Derived data
  const userData = profileData?.data || {};
  const userPosts = userPostsData?.data || [];

  useEffect(() => {
    if (myprofile?.data && username === myprofile?.data?.username) {
      navigate("/detailprofile");
    }
  }, [myprofile, username]);
  // Handle paginated twibbons data dan hitung total campaigns
  useEffect(() => {
    if (myTwibbonsData?.data) {
      const newData = myTwibbonsData.data;
      const pagination = myTwibbonsData.pagination;

      if (currentPage === 1) {
        setAllMyTwibbons(newData);
        // Set total campaigns dari pagination
        setTotalCampaigns(pagination?.total || newData.length);
      } else {
        setAllMyTwibbons((prev) => [...prev, ...newData]);
      }

      setHasNextPage(pagination?.has_next || false);
      setIsLoadingMore(false);
    }
  }, [myTwibbonsData, currentPage]);

  // Handle posts data dan hitung total posts
  useEffect(() => {
    if (userPostsData?.data) {
      const posts = userPostsData.data;
      const pagination = userPostsData.pagination;

      // Set total posts dari pagination atau length data
      setTotalPosts(pagination?.total || posts.length);
    }
  }, [userPostsData]);

  // Reset and refetch data when username changes
  useEffect(() => {
    refetchProfile();
    refetchPosts();
    setCurrentPage(1);
    setAllMyTwibbons([]);
    setTotalCampaigns(0);
    setTotalPosts(0);
    refetchMyTwibbons();
  }, [username]);

  // Infinite scroll setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
          setIsLoadingMore(true);
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isLoadingMore]);

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

  const handleTwibbonShare = (twibon) => {
    if (!twibon) {
      openToast("toast", true, t("main.twibbon_not_found"), "error");
      return;
    }

    const shareUrl = `${window.location.origin}/${twibon.slug || ""}`;
    const title = twibon.title || "Check out this twibbon!";

    setShareData({
      title: title,
      url: shareUrl,
      description: twibon.title || "",
    });
    setShowShareModal(true);
  };

  const handleProfileShare = () => {
    const shareUrl = `${window.location.origin}/user/${
      userData?.username || username
    }`;
    const title = `Check out ${userData.fullname}'s profile!`;

    setShareData({
      title: title,
      url: shareUrl,
      description: `View ${userData.fullname}'s campaigns and posts on our platform`,
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

  const tabs = [t("profile.campaign"), t("profile.posts")];

  const renderEmptyState = (icon, title, description) => (
    <div className="flex flex-col items-center justify-center col-span-4 py-16 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-gray-800">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );

  const renderStatsItem = (icon, label, value) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {label}
        </span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={closeShareModal}
        shareData={shareData}
      />

      {/* Hero Section */}
      <div className="relative">
        <div
          className="relative overflow-hidden bg-center bg-cover h-80"
          style={{ backgroundImage: `url(${Bg1})` }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Content */}
        <div className="container relative px-6 mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Profile Section */}
            <div className="flex-1">
              <div className="flex items-end justify-between mb-8 -mt-20">
                <div className="flex items-end">
                  <div className="relative">
                    <div className="flex items-center justify-center w-32 h-32 bg-white border-4 border-white rounded-full shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900">
                        <Users className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {userData?.fullname}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  @{userData?.username || userData?.userEmail}
                </p>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="flex flex-col gap-3 mt-5 lg:w-80">
              <div className="p-6 space-y-4 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                {renderStatsItem(
                  <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
                  t("main.supporters"),
                  userData?.supports
                )}
                {renderStatsItem(
                  <Trophy className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
                  t("profile.campaigns"),
                  totalCampaigns
                )}
                {renderStatsItem(
                  <Edit className="w-5 h-5 text-gray-600 dark:text-gray-300" />,
                  t("profile.posts"),
                  totalPosts
                )}
              </div>
              <button
                onClick={handleProfileShare}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
              >
                <Share2 className="w-4 h-4" />
                {t("main.share_profile")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container w-full px-4 mx-auto sm:px-6 lg:px-8">
        <div className="container px-6 py-8 mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              {/* Tabs */}
              <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex space-x-8">
                  {tabs.map((tab, index) => {
                    const tabKey =
                      tab === t("profile.campaign") ? "Campaign" : "Posts";

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
                  {allMyTwibbons.length === 0 ? (
                    renderEmptyState(
                      <Edit className="w-8 h-8 text-gray-400 dark:text-gray-500" />,
                      t("main.no_twibbon_yet"),
                      t("profile.twibbone_will_appear")
                    )
                  ) : (
                    <>
                      {allMyTwibbons.map((twibon) => (
                        <CardHome
                          key={twibon.id}
                          twibon={{
                            id: twibon.id,
                            title: twibon.title || t("explore.untitled"),
                            author: twibon?.contributor?.fullname || "Gypem",
                            supports: twibon?.supports || 0,
                            slug: twibon.slug_event_twibbon,
                            image: twibon.template_twibbon,
                            date: twibon.createdAt,
                            username: twibon?.contributor?.username || "",
                          }}
                          onShare={() => handleTwibbonShare(twibon)}
                        />
                      ))}

                      {isLoadingMore && (
                        <div className="flex items-center justify-center py-6 col-span-full">
                          <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
                        </div>
                      )}

                      {hasNextPage && allMyTwibbons.length > 0 && (
                        <div ref={observerTarget} className="h-6" />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Posts Content */}
              {activeTab === "Posts" && (
                <div>
                  {userPosts.length === 0 ? (
                    renderEmptyState(
                      <Edit className="w-8 h-8 text-gray-400 dark:text-gray-500" />,
                      t("main.no_posts_yet"),
                      t("profile.posts_will_appear")
                    )
                  ) : (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {userPosts.map((post) => (
                        <CardPost
                          key={post.id}
                          post={post}
                          onShare={handlePostShare}
                          showActions={false}
                          onCardClick={handlePostClick}
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

export default ProfilePublic;
