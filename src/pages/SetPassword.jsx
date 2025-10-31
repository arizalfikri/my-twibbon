import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import LoginImage from "../assets/images/login_image.png";
import LogoGypem from "../assets/images/gypem_logo.png";
import LogoGypemPutih from "../assets/images/gypem_logo_putih.png";

import { InputType } from "../components/FormControl";
import { useModalStore } from "../helper/store/modal.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { setPasswordSchema } from "../helper/yup";
import { usePOST } from "../services/api";
import InputPassword from "../components/FormControl/InputPassword";

function SetPassword() {
  const { t } = useTranslation();
  const { openToast } = useModalStore();
  const navigate = useNavigate();
  const { token } = useParams();
  const role = localStorage.getItem("selectedRole");
  const { mutateAsync, isPending } = usePOST("/event-twibbon");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(setPasswordSchema) });
  const onSubmit = async (data) => {
    try {
      let response;
      {
        response = await mutateAsync({
          url: `auth/reset-password/${token}`,
          data: { password: data.password, role: role },
        });
      }
      console.log(response);
      if (response.status === 200) {
        localStorage.removeItem("selectedRole");
        navigate("/SignIn");
      }
    } catch (error) {
      switch (error?.response.status) {
        case 401:
          openToast("toast", true, "info");
          break;
        case 400:
          openToast("toast", true, "warning");
          break;
        default:
          openToast("toast", true);
          break;
      }
    }
  };

  return (
    <div id="root">
      <div className="grid justify-center h-screen grid-cols-1 overflow-x-hidden bg-white dark:bg-gray-900 md:grid-cols-2 lg:grid-cols-3">
        {/* Gambar kiri */}
        <img
          className="hidden object-cover w-full h-full col-span-1 lg:block"
          src={LoginImage}
          alt={t("auth.reset_password_title", {
            defaultValue: "Atur Password",
          })}
        />

        {/* Konten kanan */}
        <div className="flex flex-col col-span-3 px-4 py-16 overflow-auto bg-white dark:bg-gray-900 lg:col-span-2 md:px-32 xl:px-52 md:py-20">
          <a href="/">
            <img
              src={
                document.documentElement.classList.contains("dark")
                  ? LogoGypemPutih
                  : LogoGypem
              }
              alt={t("common.logo")}
              className="block w-20 h-full mx-auto md:w-28 md:h-28"
            />
          </a>

          <div className="">
            <Link
              to="/SignIn"
              className="inline-block mt-10 text-sm font-medium text-purple-700 rounded-lg dark:hover:text-purple-500 hover:text-purple-800 transition-smooth"
            >
              ← {t("common.back", { defaultValue: "Kembali Ke Login" })}
            </Link>
          </div>
          {/* Judul + deskripsi */}
          <div className="mt-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {t("auth.reset_password_title", {
                defaultValue: "Atur Password Baru",
              })}
            </h2>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
              {t("auth.reset_password_description")}
            </p>
          </div>

          {/* Form */}
          <form className="mt-6 md:mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <InputPassword
                htmlFor="password"
                label={t("auth.new_password")}
                type={InputType.PASSWORD}
                placeholder={t("auth.enter_new_password")}
                name="password"
                id="password"
                style="rounded-xl"
                control={control}
                autoComplete="new-password"
                error={errors}
              />

              <InputPassword
                htmlFor="password_confirmation"
                label={t("auth.confirm_new_password")}
                type={InputType.PASSWORD}
                placeholder={t("auth.reenter_new_password")}
                name="password_confirmation"
                id="password_confirmation"
                style="rounded-xl"
                control={control}
                autoComplete="new-password"
                error={errors}
              />
            </div>

            <div className="flex flex-col gap-2 mt-4 md:flex-row">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-x-1 transition-smooth font-semibold bg-purple-700 text-white px-4 py-2.5 w-full rounded-xl hover:bg-purple-900"
              >
                {t("common.submit", { defaultValue: "Submit" })}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SetPassword;
