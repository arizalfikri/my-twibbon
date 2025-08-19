import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalAlert from "../../layout/ModalAlert";
import { Eye, EyeOff, Mail, Lock, Users, UserCheck, X } from "lucide-react";
import { useModalStore } from "../../helper/store/modal.store";
import { useGlobalStore } from "../../helper/store/global.store";
import { usePOST } from "../../services/api";
import { useForm } from "react-hook-form";
import InputPassword from "../FormControl/InputPassword";
import InputWithLabel from "../FormControl/InputWithLabel";
import { InputType } from "../FormControl";

export default function ModalLogin({ isOpen, onClose, kontributor = false }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { openToast } = useModalStore();
  const { setToken, setEmail } = useGlobalStore();
  const navigate = useNavigate();

  // Tentukan endpoint berdasarkan prop kontributor
  const loginEndpoint = kontributor ? "/auth/login" : "/auth/login-participant";
  const loginMutation = usePOST(loginEndpoint);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      let response;

      response = await loginMutation.mutateAsync({
        url: loginEndpoint,
        data: { email: data.email, password: data.password },
      });
      
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        setToken(response.data.token);
        setEmail(response.data.email);
        openToast("success", true, "Login Berhasil");

        onClose();
      }
      console.log("Login response:", response);

    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        openToast("toast", true, "Email atau password tidak valid");
      } else {
        openToast("toast", true, "Terjadi kesalahan pada server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalAlert onClose={onClose}>
      <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white rounded-md shadow-2xl md:w-96">
        {/* Header with purple gradient */}
        <div className="relative px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-700">
        <button
          onClick={onClose}
            className="absolute p-1 text-white transition-colors rounded-full top-4 right-4 hover:text-purple-200 hover:bg-white/10"
        >
          <X size={20} />
        </button>

          <div className="text-center text-white">
            <h2 className="mb-1 text-2xl font-bold">
              {kontributor ? "Login Kontributor" : "Selamat Datang Kembali!"}
            </h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Alamat Email
              </label>
              <div className="relative">
          <InputWithLabel
            htmlFor="email"
            type={InputType.TEXT}
                  placeholder="nama@example.com"
            name="email"
            id="email"
                  style="rounded-lg"
            control={control}
            autoComplete="email"
                />
                <Mail
                  size={18}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2"
          />
              </div>
            </div>

          {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kata Sandi
              </label>
          <div className="relative">
            <InputPassword
              htmlFor="password"
              type={InputType.PASSWORD}
                  placeholder="Masukkan kata sandi Anda"
              name="password"
              id="password"
              control={control}
              error={errors}
            />
          </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-gray-600">Ingat saya</span>
              </label>
              <button
                type="button"
                className="font-medium text-purple-600 hover:text-purple-700"
              >
                Lupa kata sandi?
              </button>
            </div>

            {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 mr-3 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Masuk...
                </div>
              ) : (
                "Masuk"
              )}
          </button>
        </form>

          {/* Social Login Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  atau lanjutkan dengan
                </span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Register Link */}
          <div className="text-sm text-center text-gray-600">
            Belum punya akun?{" "}
            <button
              type="button"
              className="font-medium text-purple-600 hover:text-purple-700"
            >
              Daftar sekarang
            </button>
          </div>
        </div>
      </div>
    </ModalAlert>
  );
}