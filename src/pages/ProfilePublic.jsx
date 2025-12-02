import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Users, Trophy, Share2, MoreVertical } from "lucide-react";
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

  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);

  // Refs
  const observerTarget = useRef(null);
  const dropdownRef = useRef(null);

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

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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
    <div className="flex flex-col col-span-4 justify-center items-center py-16 text-center">
      <div className="flex justify-center items-center mb-4 w-16 h-16 bg-gray-100 rounded-full dark:bg-gray-800">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );

  const renderStatsItem = (icon, label, value) => (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
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
          className="overflow-hidden relative h-60 bg-center bg-cover md:h-52"
          style={{ backgroundImage: `url(${Bg1})` }}
        ></div>

        {/* Profile Content */}
        <div className="container mt-10">
          <div className="flex flex-col gap-8 md:flex-row md:gap-8">
            {/* Profile Section */}
            <div className="flex flex-col flex-1 gap-6 items-start md:flex-row md:gap-8">
              {/* Avatar */}
              <div className="relative w-auto">
                <div className="flex justify-center items-center p-2 -mt-20 w-full bg-white rounded-xl border-4 border-white shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex justify-center items-center w-40 h-40 rounded-xl bg-primary-100 dark:bg-primary-900 md:w-48 md:h-48">
                    <Users className="w-16 h-16 text-primary-600 dark:text-primary-400 md:w-20 md:h-20" />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col flex-1 w-full">
                {/* Name */}
                <div className="mb-6">
                  <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                    {userData?.fullname}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    @{userData?.username || userData?.userEmail}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-8">
                  {/* Supporters */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {t("main.supporters")}
                    </span>
                    <div className="flex gap-2 items-center">
                      <Users className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {userData?.supports || 0}
                      </span>
                    </div>
                  </div>

                  {/* Campaigns */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {t("profile.campaigns")}
                    </span>
                    <div className="flex gap-2 items-center">
                      <Trophy className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalCampaigns}
                      </span>
                    </div>
                  </div>

                  {/* Posts */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {t("profile.posts")}
                    </span>
                    <div className="flex gap-2 items-center">
                      <Edit className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalPosts}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Dropdown Menu */}
            <div className="md:w-fit md:mt-0">
              {/* Dropdown Menu */}
              <div className="relative mb-1" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="hidden gap-2 justify-center items-center p-2 ml-auto md:flex"
                >
                  <MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <div className="flex gap-2 mb-2 md:hidden">
                  <button
                    className="flex gap-2 items-center px-3 py-2 w-full text-gray-700 bg-white rounded-xl border-2 border-gray-300 dark:text-gray-300 h-fit dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => {
                      handleProfileShare();
                      setShowDropdown(false);
                    }}
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
                {/* Dropdown Content */}
                {showDropdown && (
                  <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleProfileShare();
                          setShowDropdown(false);
                        }}
                        className="flex gap-3 items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container px-4 mx-auto w-full sm:px-6 lg:px-8">
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
                <div>

                  
                  {allMyTwibbons.length === 0 ? (
                    renderEmptyState(
                      <Edit className="w-8 h-8 text-gray-400 dark:text-gray-500" />,
                      t("main.no_twibbon_yet"),
                      t("profile.twibbone_will_appear")
                    )
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
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
                      </div>

                      {isLoadingMore && (
                        <div className="flex col-span-full justify-center items-center py-6">
                          <div className="w-8 h-8 rounded-full border-4 border-gray-300 animate-spin border-t-blue-500"></div>
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
