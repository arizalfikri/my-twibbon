import React, { useState, useEffect } from "react";
import {
  Edit,
  Share2,
  Search,
  MoreHorizontal,
  Users,
  Calendar,
  Trophy,
  ImageOff,
  Palette,
  Heart,
  Plus,
  Grid,
  List,
  Filter,
} from "lucide-react";
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
    role === "contributor" ? ["Campaign"] : role === "user" ? ["Posts"] : [];

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
    <div className="min-h-screen bg-gray-50">
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
                  <div className="flex items-center justify-center w-32 h-32 bg-white border-4 border-white rounded-full shadow-lg">
                    <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                      <Users className="w-10 h-10 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {userFullname}
                </h1>
                <p className="text-lg text-gray-600">@{userEmail}</p>
              </div>
              {role == "contributo" ? (
                <div className="flex gap-4 mb-8">
                  <Link to="/EditProfile">
                    <button className="flex items-center gap-2 px-4 py-2 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Stats Sidebar */}
            <div className="mt-5 lg:w-80">
              <div className="p-6 space-y-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      Supporters
                    </span>
                  </div>
                  <span className="text-xl font-bold">{supports}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Campaigns</span>
                  </div>
                  <span className="text-xl font-bold">
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
            {/* Tabs and View Controls */}
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex space-x-8">
                {availableTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
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
                        title: twibon.title || "Tanpa Judul",
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

            {activeTab === "Posts" && role === "user" && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                  <Edit className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No Posts Yet
                </h3>
                <p className="text-gray-500">
                  Posts you create will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
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
