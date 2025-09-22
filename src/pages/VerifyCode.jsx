import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import LoginImage from "../assets/images/login_image.png";
import LogoGypem from "../assets/images/gypem_logo.png";
import { InputType } from "../components/FormControl";
import { useModalStore } from "../helper/store/modal.store";

function VerifyCode() {
  const { t } = useTranslation();
  const { openToast } = useModalStore();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Kode OTP:", data.code);

    // Notifikasi sementara
    openToast("toast", true, "Kode berhasil diverifikasi (dummy)", "success");

    // Lanjut ke reset password
    navigate("/reset-password");
  };

  return (
    <div id="root">
      <div className="grid justify-center h-screen grid-cols-1 overflow-x-hidden bg-white dark:bg-gray-900 md:grid-cols-2 lg:grid-cols-3">
        {/* Gambar kiri */}
        <img
          className="hidden object-cover w-full h-full col-span-1 lg:block"
          src={LoginImage}
          alt={t("auth.verify_code_title", { defaultValue: "Verifikasi Kode" })}
        />

        {/* Konten kanan */}
        <div className="flex flex-col col-span-3 px-4 py-16 overflow-auto bg-white dark:bg-gray-900 lg:col-span-2 md:px-32 xl:px-52 md:py-20">
          <a href="/">
            <img
              src={LogoGypem}
              alt={t("common.logo")}
              className="block w-20 h-full mx-auto md:w-28 md:h-28"
            />
          </a>

          
          {/* Judul + deskripsi */}
          <div className="mt-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {t("auth.verify_code_title", { defaultValue: "Verifikasi Kode" })}
            </h2>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
              Masukkan kode OTP yang telah kami kirimkan ke email kamu.
            </p>
          </div>

          {/* Form */}
          <form className="mt-6 md:mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <InputWithLabel
                htmlFor="code"
                label="Kode OTP"
                type={InputType.TEXT}
                placeholder="Masukkan kode OTP"
                name="code"
                id="code"
                style="rounded-xl"
                control={control}
                autoComplete="off"
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

export default VerifyCode;
