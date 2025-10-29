import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import LogoGypem from "../assets/images/gypem_logo.png";
import LogoGypemPutih from "../assets/images/gypem_logo_putih.png";
import LoginImage from "../assets/images/login_image.png";
import { Eye, EyeOff } from "lucide-react";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import InputPassword from "../components/FormControl/InputPassword";
import { useForm } from "react-hook-form";
import { InputType } from "../components/FormControl";
import { usePOST } from "../services/api";
import { useModalStore } from "../helper/store/modal.store";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../helper/yup";

function SignUp() {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { openToast } = useModalStore();
  const { mutateAsync, isPending } = usePOST("/auth/register");
  const [selectedRole, setSelectedRole] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signUpSchema) });

  const forms = [
    {
      id: "fullname",
      label: t("auth.full_name"),
      type: InputType.TEXT,
      placeholder: t("auth.enter_full_name"),
    },
    {
      id: "email",
      label: t("auth.email"),
      type: InputType.EMAIL,
      placeholder: t("auth.enter_email"),
    },
    {
      id: "password",
      label: t("auth.password"),
      type: InputType.PASSWORD,
      placeholder: "*******",
    },
    {
      id: "confirm_password",
      label: t("auth.confirm_password"),
      type: InputType.PASSWORD,
      placeholder: "*******",
    },
  ];

  const handleOnSubmit = async (data) => {
    const { confirm_password, ...rest } = data;

    try {
      const response = await mutateAsync({
        url: "/auth/register",
        data: { ...rest, role: selectedRole },
      });

      if (response.status === 200) {
        openToast("toast", true, t("auth.register_success"), "success");
        navigate("/signin");
      }
    } catch (error) {
      switch (error.status) {
        case 401:
        case 409:
          openToast("toast", true, t("auth.email_already_registered"));
          break;
        default:
          openToast("toast", true, t("auth.server_error"));
          break;
      }
    }
  };

  if (!selectedRole) {
    return (
      <div id="root">
        <div className="grid items-center justify-center h-screen grid-cols-1 overflow-x-hidden bg-white dark:bg-gray-900 md:grid-cols-2 lg:grid-cols-3">
          <img
            className="hidden object-cover w-full h-full col-span-1 lg:block"
            src={LoginImage}
            alt={t("auth.register")}
          />

          <div className="flex flex-col justify-center col-span-3 px-4 py-16 overflow-auto bg-white dark:bg-gray-900 lg:col-span-2 md:px-32 xl:px-52 md:py-20">
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

            <div className="mt-10 md:mt-5">
              <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
                {t("auth.select_register_role")}
              </h2>

              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("contributor");
                    localStorage.setItem("selectedRole", "contributor");
                  }}
                  className="inline-flex items-center justify-center w-full px-4 py-4 text-lg font-semibold text-white bg-purple-700 gap-x-1 transition-smooth rounded-xl hover:bg-purple-900"
                >
                  {t("auth.register_as_contributor")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("participant");
                    localStorage.setItem("selectedRole", "participant");
                  }}
                  className="inline-flex items-center justify-center w-full px-4 py-4 text-lg font-semibold text-white bg-yellow-400 gap-x-1 transition-smooth rounded-xl hover:bg-yellow-600"
                >
                  {t("auth.register_as_participant")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="root">
      <div className="grid h-screen grid-cols-1 overflow-x-hidden md:grid-cols-2 lg:grid-cols-3">
        <img
          className="hidden object-cover w-full h-full col-span-1 lg:block"
          src={LoginImage}
          alt={t("auth.login_image")}
        />
        <div className="flex flex-col col-span-3 px-4 py-16 overflow-auto text-gray-800 bg-white dark:bg-gray-900 dark:text-gray-100 lg:col-span-2 md:px-32 xl:px-52 md:py-20">
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
          <div className="relative flex items-center justify-center mt-4">
            {/* Tombol Back di kiri */}
            <div className="absolute left-0">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="inline-block text-sm font-medium text-purple-700 rounded-lg dark:hover:text-purple-500 hover:text-purple-800 transition-smooth"
              >
                ←{" "}
                {t("common.back", { defaultValue: "Kembali ke Pilihan Role" })}
              </button>
            </div>

            {/* Judul tetap di center */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {t("auth.register")}{" "}
              {selectedRole === "contributor"
                ? t("auth.contributor")
                : selectedRole === "participant"
                ? t("auth.participant")
                : ""}
            </h2>
          </div>

          <form
            className="mt-10 md:mt-5"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex flex-col gap-3 mt-10 md:gap-5 md:mt-5">
                {forms.map(({ id, label, type, placeholder }) =>
                  type === "password" ? (
                    <InputPassword
                      key={id}
                      htmlFor={id}
                      label={label}
                      type={type}
                      placeholder={placeholder}
                      id={id}
                      name={id}
                      control={control}
                      error={errors}
                    />
                  ) : (
                    <InputWithLabel
                      key={id}
                      htmlFor={id}
                      label={label}
                      type={type}
                      placeholder={placeholder}
                      id={id}
                      name={id}
                      control={control}
                      error={errors}
                    />
                  )
                )}
              </div>
            </motion.div>

            <div className="flex flex-col gap-2 mt-8 md:flex-row">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-x-1 transition-smooth font-semibold 
                       bg-purple-700 text-white px-4 py-2.5 w-full rounded-xl 
                       hover:bg-purple-900 disabled:opacity-50"
              >
                {isPending ? t("auth.registering") : t("auth.register")}
              </button>
            </div>
          </form>

          <div className="mt-3 text-sm text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {t("auth.already_have_account")}{" "}
              <a
                href="/SignIn"
                className="font-medium text-purple-700 underline dark:text-purple-400"
              >
                {t("auth.login")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
