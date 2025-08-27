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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container max-w-4xl px-6 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/DetailProfile"
            className="inline-flex items-center gap-2 mb-4 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Profil
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profil</h1>
          </div>
          <p className="text-gray-600">
            Kelola informasi akun dan preferensi Anda
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Informasi Pribadi
                  </h2>
                  <p className="text-gray-600">
                    Perbarui informasi dasar akun Anda
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullname"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        id="fullname"
                        {...register("fullname", {
                          required: "Nama lengkap wajib diisi",
                          minLength: {
                            value: 2,
                            message: "Nama lengkap minimal 2 karakter",
                          },
                        })}
                        className={`w-full py-3 pl-10 pr-4 transition-all border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.fullname ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    {errors.fullname && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>

                  {/* Email - Read Only */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700"
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
                        className="w-full py-3 pl-10 pr-4 transition-all border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50"
                        placeholder="Email tidak dapat diubah"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Email tidak dapat diubah saat ini
                    </p>
                  </div>

                  {/* Google Login Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Login dengan Google
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Hubungkan akun Google Anda untuk login yang lebih mudah
                      dan aman
                    </p>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="flex items-center gap-3 px-6 py-3 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 group"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285f4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34a853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#fbbc05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#ea4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="group-hover:text-gray-700">
                        Hubungkan dengan Google
                      </span>
                    </button>
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
                      className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
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
          <div className="w-full max-w-md p-6 duration-200 bg-white rounded-xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Hapus Akun
                </h3>
                <p className="text-gray-600">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-gray-700">
                Anda yakin ingin menghapus akun? Semua data dan twibone yang
                Anda buat akan hilang permanen.
              </p>
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <p className="text-sm font-medium text-red-800">
                  ⚠️ Data yang akan dihapus:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
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
                  <Trash2 className="w-5 h-5" />
                )}
                {isLoading ? "Menghapus..." : "Ya, Hapus Akun"}
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
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
