import React, { useEffect, useState } from "react";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import LoginImage from "../assets/images/login_image.png";
import LogoGypem from "../assets/images/gypem_logo.png";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "../helper/store/global.store";
import { useModalStore } from "../helper/store/modal.store";
import { useNavigate, Link } from "react-router-dom";
import { usePOST } from "../services/api";
import { useForm } from "react-hook-form";
import { InputType } from "../components/FormControl";
import { yupResolver } from "@hookform/resolvers/yup";

function ForgotPassword() {
  const { t } = useTranslation();
  const { openToast } = useModalStore();
  const token = localStorage.getItem("token");
  const { setEmail, setToken, setFullName, setRole } = useGlobalStore();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = usePOST("/auth/forgot-password");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let response;
      {
        response = await mutateAsync({
          url: "/auth/forgot-password",
          data: { email: data.email },
        });
      }
      console.log(response);
      if (response.status === 200) {
        openToast("toast", true, t("Silahkan Cek Email"), "success");
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

  return (
    <div id="root">
      <div className="grid justify-center h-screen grid-cols-1 overflow-x-hidden bg-white dark:bg-gray-900 md:grid-cols-2 lg:grid-cols-3">
        <img
          className="hidden object-cover w-full h-full col-span-1 lg:block"
          src={LoginImage}
          alt={t("auth.login")}
        />

        <div className="flex flex-col col-span-3 px-4 py-16 overflow-auto bg-white dark:bg-gray-900 lg:col-span-2 md:px-32 xl:px-52 md:py-20">
          <a href="/">
            <img
              src={LogoGypem}
              alt={t("common.logo")}
              className="block w-20 h-full mx-auto md:w-28 md:h-28"
            />
          </a>

          {/* Tombol kembali */}
          <div className="">
            <Link
              to="/SignIn"
              className="inline-block mt-10 text-sm font-medium text-purple-700 rounded-lg dark:hover:text-purple-500 hover:text-purple-800 transition-smooth"
            >
              ← {t("common.back", { defaultValue: "Kembali Ke Login" })}
            </Link>
          </div>
          <div className="mt-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {t("auth.forgot_password_title", {
                defaultValue: "Kamu lupa password ?",
              })}
            </h2>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
              {t("auth.forgot_password_description")}
            </p>
          </div>

          <form className="mt-6 md:mt-5" onSubmit={handleSubmit(onSubmit)}>
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
            </div>
            <div className="flex flex-col gap-2 mt-4 md:flex-row">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-x-1 transition-smooth font-semibold bg-purple-700 text-white px-4 py-2.5 w-full rounded-xl hover:bg-purple-900 disabled:opacity-50"
              >
                {isPending ? t("common.loading") : "submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
