import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import LogoGypem from "../assets/images/gypem_logo.png";
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
      label: t('auth.full_name'),
      type: InputType.TEXT,
      placeholder: t('auth.enter_full_name'),
    },
    {
      id: "email",
      label: t('auth.email'),
      type: InputType.EMAIL,
      placeholder: t('auth.enter_email'),
    },
    {
      id: "password",
      label: t('auth.password'),
      type: InputType.PASSWORD,
      placeholder: "*******",
    },
    {
      id: "confirm_password",
      label: t('auth.confirm_password'),
      type: InputType.PASSWORD,
      placeholder: "*******",
    },
  ];

  const handleOnSubmit = (data) => {
    const { confirm_password, ...rest } = data;

    mutateAsync({
      url: "/auth/register",
      data: { ...rest, role: "contributor" },
    })
      .then(() => navigate("/signin"))
      .catch((error) => {
        switch (error.status) {
          case 401:
            openToast("toast", true, t('auth.email_already_registered'));
            break;
          case 409:
            openToast("toast", true, t('auth.email_already_registered'));
            break;
          default:
            openToast("toast", true, t('auth.server_error'));
            break;
        }
      });
  };

  return (
    <div id="root">
      <div className="grid h-screen grid-cols-1 overflow-x-hidden md:grid-cols-2 lg:grid-cols-3">
        <img
          className="hidden object-cover w-full h-full col-span-1 lg:block"
          src={LoginImage}
          alt={t('auth.login_image')}
        />
        <div className="flex flex-col col-span-3 px-4 py-16 overflow-auto text-gray-800 bg-white dark:bg-gray-900 dark:text-gray-100 lg:col-span-2 md:px-32 xl:px-52 md:py-20">
          <a href="/">
            <img
              src={LogoGypem}
              alt={t('common.logo')}
              className="block w-20 h-full mx-auto md:w-28 md:h-28"
            />
          </a>

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
                {isPending ? t('auth.registering') : t('auth.register')}
              </button>
            </div>
          </form>

          <div className="mt-3 text-sm text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {t('auth.already_have_account')}{" "}
              <a
                href="/SignIn"
                className="font-medium text-purple-700 underline dark:text-purple-400"
              >
                {t('auth.login')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;