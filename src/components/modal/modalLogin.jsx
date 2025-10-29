import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ModalAlert from "../../layout/ModalAlert";
import { Mail, X } from "lucide-react";
import { useModalStore } from "../../helper/store/modal.store";
import { useGlobalStore } from "../../helper/store/global.store";
import { usePOST } from "../../services/api";
import { useForm } from "react-hook-form";
import InputPassword from "../FormControl/InputPassword";
import InputWithLabel from "../FormControl/InputWithLabel";
import { InputType } from "../FormControl";
import { useQueryClient } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

export default function ModalLogin({ isOpen, onClose, kontributor = false }) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { openToast } = useModalStore();
  const { setToken, setEmail, setFullName, setRole } = useGlobalStore();
  const navigate = useNavigate();

  // Tentukan endpoint berdasarkan prop kontributor
  const loginMutation = usePOST("/auth/login");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const googleLoginAPI = usePOST("/auth/login-sosmed");

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleUser = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const email = googleUser.data.email;

        const response = await googleLoginAPI.mutateAsync({
          url: "/auth/login-sosmed",
          data: { email },
        });

        if (response.status === 200) {
          setEmail(response.data.user.email);
          setFullName(response.data.user.fullname);
          setToken(response.data.token);
          setRole(response.data.user.role);
          localStorage.setItem("email", response.data.user.email);
          localStorage.setItem("fullname", response.data.user.fullname);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("token", response.data.token);

          openToast("toast", true, "Login with Google successful", "success");
          queryClient.removeQueries();
          onClose();
        } else {
          openToast(
            "toast",
            true,
            response.message || "Login with Google failed",
            "error"
          );
        }
      } catch (err) {
        console.error(err);
        openToast("toast", true, "Login with Google failed", "error");
      }
    },
    onError: () => {
      openToast("toast", true, "Login with Google failed", "error");
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      let response = await loginMutation.mutateAsync({
        url: "/auth/login",
        data: { email: data.email, password: data.password },
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("fullname", response.data.user.fullname);
        localStorage.setItem("role", response.data.user.role);
        setToken(response.data.token);
        setEmail(response.data.email);
        setFullName(response.data.user.fullname);
        setRole(response.data.user.role);
        openToast("toast", true, t("auth.login_successful"), "success");
        queryClient.removeQueries();

        onClose();
      }
      console.log("Login response:", response);
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        openToast("toast", true, t("auth.invalid_credentials"));
      } else {
        openToast("toast", true, t("auth.server_error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalAlert onClose={onClose}>
      <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white rounded-md shadow-2xl md:w-96 dark:bg-gray-900">
        <div className="relative px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-700">
          <button
            onClick={onClose}
            className="absolute p-2 text-white transition-colors rounded-full top-5 right-3 hover:text-purple-200 hover:bg-white/10"
          >
            <X size={20} />
          </button>

          <div className="px-2 text-center text-white">
            <h2 className="mb-1 text-2xl font-bold">
              {t("auth.welcome_back")}
            </h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.email_address")}
              </label>
              <div className="relative">
                <InputWithLabel
                  htmlFor="email"
                  type={InputType.TEXT}
                  placeholder={t("auth.email_placeholder")}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.password")}
              </label>
              <div className="relative">
                <InputPassword
                  htmlFor="password"
                  type={InputType.PASSWORD}
                  placeholder={t("auth.enter_password")}
                  name="password"
                  id="password"
                  control={control}
                  error={errors}
                />
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-end text-sm">
              
              <button
                type="button"
                className="font-medium text-purple-600 hover:text-purple-700"
              >
                {t("auth.forgot_password")}
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
                  {t("auth.logging_in")}
                </div>
              ) : (
                t("auth.login")
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          {kontributor ? null : (
            <>
              <div className="mt-6 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">
                      {t("auth.or_continue_with")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 mb-6">
                <button
                  onClick={() => loginGoogle()}
                  type="button"
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <FcGoogle className="w-5 h-5" />
                  Google
                </button>
              </div>
            </>
          )}

          {/* Register Link */}
          <div className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
            {t("auth.no_account")}{" "}
            <a
              href="https://gypem.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-600 hover:text-purple-700"
            >
              {t("auth.register_now")}
            </a>
          </div>
        </div>
      </div>
    </ModalAlert>
  );
}
