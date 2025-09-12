import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Edit, Users, Trophy } from "lucide-react";
import { useGET, useDELETE } from "../services/api.js";
import Navbar from "../components/layoutpage/Navbar.jsx";
import Bg1 from "../assets/images/background_hero.png";
import CardProfile from "../components/cards/CardProfile.jsx";
import ModalDeleteTwibone from "../components/modal/ModalDeleteTwibone.jsx";
import { useGlobalStore } from "../helper/store/global.store.js";
import Footer from "../components/layoutpage/Footer.jsx";
import ModalEditTwibonne from "../components/modal/ModalEditTwibonne.jsx";
import { Link, useNavigate } from "react-router-dom";
import EmptyTwibbon from "../components/common/EmptyTwibbon.jsx";

const DetailProfile = () => {
  const { t } = useTranslation();
  const { data: profileData, isLoading, refetch } = useGET("my-profile");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const { email, token, fullname, role } = useGlobalStore();
  const [activeTab, setActiveTab] = useState(
    role === "contributor" ? "Campaign" : "Posts"
  );
  const navigate = useNavigate();
  
  // Updated data extraction based on new API structure
  const userData = profileData?.data || {};
  const twibbonData = userData.my_event_twibbons || [];
  const supports = userData.supports || 0;
  const userFullname = userData.fullname || fullname;
  const userEmail = userData.email || email;

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Tentukan tabs berdasarkan role
  const availableTabs =
    role === "contributor" ? [t('profile.campaign')] : role === "user" ? [t('profile.posts')] : [];

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

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
        <div className="container relative px-6 mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Profile Section */}
            <div className="flex-1">
              {/* Profile Avatar and Info */}
              <div className="flex items-end mb-8 -mt-20">
                <div className="relative">
                  <div className="flex items-center justify-center w-32 h-32 bg-white border-4 border-white rounded-full shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full dark:bg-purple-900">
                      <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
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

              {role === "contributor" ? (
                <div className="flex gap-4 mb-8">
                  <Link to="/EditProfile">
                    <button className="flex items-center gap-2 px-4 py-2 transition-colors bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Edit className="w-4 h-4 dark:text-white" />
                      <p className="text-gray-700 dark:text-gray-300">
                        {t('profile.edit_profile')}
                      </p>
                    </button>
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Stats Sidebar */}
            <div className="mt-5 lg:w-80">
              <div className="p-6 space-y-4 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {t('main.supporters')}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {supports}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {t('profile.campaigns')}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {twibbonData.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container px-6 py-8 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex space-x-8">
                {availableTabs.map((tab, index) => {
                  const tabKey = role === "contributor" ? "Campaign" : "Posts";
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
            {activeTab === "Campaign" && role === "contributor" && (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }`}
              >
                {twibbonData.length === 0 ? (
                  <EmptyTwibbon />
                ) : (
                  twibbonData.map((twibon) => (
                    <CardProfile
                      key={twibon.id}
                      twibon={{
                        id: twibon.id,
                        title: twibon.title || t('main.no_title'),
                        author: userFullname || "Gypem",
                        User: 0,
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

            {/* Posts Content */}
            {activeTab === "Posts" && role === "user" && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-gray-800">
                  <Edit className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  {t('main.no_posts_yet')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('profile.posts_will_appear')}
                </p>
              </div>
            )}
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
      <Footer />
    </div>
  );
};

export default DetailProfile;