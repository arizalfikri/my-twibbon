import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Save,
  X,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Camera,
  Upload,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import { useGlobalStore } from "../helper/store/global.store.js";
import { usePATCH } from "../services/api.js";
import { useModalStore } from "../helper/store/modal.store.js";

const EditProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openToast } = useModalStore();
  const { email, fullname, setFullName } = useGlobalStore();
  const { mutateAsync, isPending } = usePATCH(`/my-profile`);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
    },
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (fullname || email) {
      setValue("fullname", fullname || "");
      setValue("email", email || "");
    }
  }, [fullname, email, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Only send fullname since that's what the API accepts
      const response = await mutateAsync({
        url: `/my-profile`,
        data: {
          fullname: data.fullname,
        },
      });

      if (response.status === 200 || response.status === 201) {
        openToast("toast", true, "Profil berhasil diperbarui!", "success");
        localStorage.setItem("fullname", response.data.fullname);
        setFullName(response.data.fullname);

        navigate("/DetailProfile");
      }
    } catch (error) {
      switch (error?.response?.status) {
        case 400:
          openToast(
            "toast",
            true,
            error?.response?.data?.message || "Data tidak valid"
          );
          break;
        case 401:
          openToast(
            "toast",
            true,
            "Anda tidak memiliki akses untuk mengedit profil",
            "info"
          );
          break;
        case 403:
          openToast("toast", true, "Akses ditolak", "warning");
          break;
        case 404:
          openToast("toast", true, "Profil tidak ditemukan");
          break;
        default:
          openToast("toast", true, "Kesalahan Server");
          break;
      }
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth login logic here
    alert("Fitur Google Login akan segera tersedia!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container max-w-4xl px-6 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/DetailProfile"
            className="inline-flex items-center gap-2 mb-4 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Profil
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Profil
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola informasi akun dan preferensi Anda
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 mb-6 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/30 dark:border-green-700">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-800 dark:text-green-300">
              {successMessage}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Informasi Pribadi
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Perbarui informasi dasar akun Anda
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullname"
                      className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        id="fullname"
                        {...register("fullname")}
                        className={`w-full py-3 pl-10 pr-4 transition-all border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white ${
                          errors.fullname
                            ? "border-red-300 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    {errors.fullname && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>

                  {/* Email - Read Only */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        disabled
                        className="w-full py-3 pl-10 pr-4 text-gray-600 transition-all border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                        placeholder="Email tidak dapat diubah"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email tidak dapat diubah saat ini
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#4C0D68] to-[#6B1E7A] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>

                    <Link
                      to="/DetailProfile"
                      className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      <X className="w-5 h-5" />
                      Batal
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 duration-200 bg-white rounded-xl animate-in fade-in-0 zoom-in-95 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/40">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hapus Akun
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                Anda yakin ingin menghapus akun? Semua data dan twibone yang
                Anda buat akan hilang permanen.
              </p>
              <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/30 dark:border-red-700">
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                  ⚠️ Data yang akan dihapus:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside dark:text-red-300">
                  <li>Semua twibone yang dibuat</li>
                  <li>Riwayat aktivitas</li>
                  <li>Informasi profil</li>
                  <li>Koneksi dengan akun Google</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex items-center justify-center flex-1 gap-2 px-4 py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5 text-white" />
                )}
                {isLoading ? "Menghapus..." : "Ya, Hapus Akun"}
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EditProfile;
