import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoginImage from "../assets/images/Login_Image.svg";
import LogoGypem from "../assets/images/logo/Logo_Icon.png";
import { Link, useNavigate } from "react-router-dom";
import { usePOST } from "../services/api";
import { useGlobalStore } from "../helper/store/global.store";
import { useModalStore } from "../helper/store/modal.store";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import { useForm } from "react-hook-form";
import { InputType } from "../components/FormControl";
import InputPassword from "../components/FormControl/InputPassword";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../helper/yup/index";
import { useQueryClient } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const SignIn = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(null);
  const { openToast } = useModalStore();
  const {
    setEmail,
    setToken,
    setFullName,
    setRole,
    email,
    token,
    fullname,
    role,
  } = useGlobalStore();
  const navigate = useNavigate();

  // State untuk menyimpan data Google user yang belum terdaftar
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);

  useEffect(() => {
    if (email && token && fullname && role) {
      navigate("/");
    }
  }, [email, token, fullname, role, navigate]);

  const userLogin = usePOST("/auth/login");
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
        const name = googleUser.data.name;

        const response = await googleLoginAPI.mutateAsync({
          url: "/auth/login-sosmed",
          data: { email },
        });

        if (response.status === 200) {
          setEmail(response.data.email);
          setFullName(response.data.user.fullname);
          setToken(response.data.token);
          setRole(response.data.user.role);

          localStorage.setItem("email", response.data.user.email);
          localStorage.setItem("fullname", response.data.user.fullname);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("token", response.data.token);

          openToast("toast", true, "Login with Google successful", "success");
          queryClient.removeQueries();
          // Refetch ads after login
          queryClient.invalidateQueries(["/ads"]);
          navigate("/");
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

        // Jika error 404 (Not Found), artinya akun belum terdaftar
        if (err.response?.status === 401) {
          const googleUser = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
          );

          const userData = {
            email: googleUser.data.email,
            name: googleUser.data.name,
            picture: googleUser.data.picture,
          };

          // Simpan data user Google untuk auto-fill di signup
          setPendingGoogleUser(userData);

          // Tampilkan toast informasi
          openToast(
            "toast",
            true,
            "Akun kamu belum terdaftar. Silakan daftar terlebih dahulu.",
            "info"
          );

          // Redirect ke halaman signup dengan state
          navigate("/SignUp", {
            state: {
              googleUser: userData,
              fromGoogle: true,
            },
          });
        } else {
          openToast("toast", true, "Login with Google failed", "error");
        }
      }
    },
    onError: () => {
      openToast("toast", true, "Login with Google failed", "error");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signInSchema) });

  const onSubmit = async (data) => {
    try {
      let response;
      response = await userLogin.mutateAsync({
        url: "/auth/login",
        data: { email: data.email, password: data.password },
      });

      if (response.status === 200) {
        openToast("toast", true, t("auth.login_success"), "success");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("fullname", response.data.user.fullname);
        localStorage.setItem("role", response.data.user.role);
        setToken(response.data.token);
        setEmail(response.data.email);
        setFullName(response.data.user.fullname);
        setRole(response.data.user.role);
        queryClient.removeQueries();
        // Refetch ads after login
        queryClient.invalidateQueries(["/ads"]);

        navigate("/");
      }
    } catch (error) {
      switch (error?.response.status) {
        case 401:
          openToast("toast", true, t("auth.invalid_credentials"), "info");
          break;
        case 400:
          openToast("toast", true, t("auth.not_registered"), "warning");
          break;
        default:
          openToast("toast", true, t("auth.server_error"));
          break;
      }
    }
  };

  const isPending = userLogin.isPending;

  return (
    <div id="root" className="flex overflow-hidden w-screen h-screen">
      {/* Left Side - Fixed Image */}
      <div className="hidden flex-shrink-0 w-1/2 bg-white lg:flex dark:bg-gray-900">
        <img
          className="object-cover w-full h-full"
          src={LoginImage}
          alt={t("auth.login")}
        />
      </div>

      {/* Right Side - Scrollable Form */}
      <div className="overflow-y-auto flex-1 w-full bg-white lg:w-1/2 dark:bg-gray-900">
        <div className="flex flex-col px-4 py-16 min-h-full md:px-32 md:py-20">
          <a href="/">
            <img
              src={LogoGypem}
              alt={t("common.logo")}
              className="block mx-auto h-20 aspect-square md:w-28 md:h-28"
            />
          </a>

          <form className="mt-10 md:mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <InputWithLabel
                htmlFor="email"
                label={<span className="capitalize">{t("auth.email")}</span>}
                type={InputType.TEXT}
                placeholder={t("auth.enter_email")}
                name="email"
                id="email"
                style="rounded-xl"
                control={control}
                autoComplete="email"
                error={errors}
              />

              <div className="relative">
                <InputPassword
                  htmlFor="password"
                  label={t("auth.password")}
                  type={InputType.PASSWORD}
                  placeholder={"******"}
                  name="password"
                  id="password"
                  control={control}
                  error={errors}
                />
              </div>
            </div>

            <div className="flex justify-end my-5">
              <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                <Link
                  to="/Forgot-Password"
                  className="font-medium text-primary-400 hover:underline"
                >
                  {t("auth.forgot_password")}{" "}
                </Link>
              </p>
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex gap-3 justify-center items-center px-4 py-3 mt-5 w-full font-semibold text-white rounded-full transition-smooth bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
              >
                {isPending ? t("common.loading") : t("login")}
              </button>
            </div>

            <button
              type="button"
              onClick={() => loginGoogle()}
              className="inline-flex gap-3 justify-center items-center px-4 py-3 mt-5 w-full font-semibold text-gray-800 bg-white rounded-full border border-gray-400 shadow-sm hover:border-gray-700 hover:bg-gray-50 transition-smooth dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <FcGoogle className="w-5 h-5" />
              google
            </button>
          </form>

          <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400 md:text-md">
            {t("auth.no_account")}{" "}
            <a
              href={"/SignUp"}
              className="font-semibold text-primary-700 hover:underline dark:text-primary-400"
            >
              {t("auth.click_here")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
