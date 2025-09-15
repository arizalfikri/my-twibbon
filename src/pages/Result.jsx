import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import CardEditor from "../components/cards/CardEditor";
import useImageStore from "../helper/store/imagestore";
import { Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../components/modal/modalLogin";
import useTwibbonStore from "../helper/store/TwiboneUser";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import { useForm } from "react-hook-form";
import { usePOST } from "../services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCaptionSchema } from "../helper/yup";
import { useModalStore } from "../helper/store/modal.store";

function Result() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resultImage, image } = useImageStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [caption, setCaption] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const { twibbonData } = useTwibbonStore();
  const { mutateAsync, isPending } = usePOST("/event-user-twibbon");
  const { openToast } = useModalStore();

  const handleRestart = () => {
    window.location.href = `/${twibbonData.slug_event_twibbon}`;
  };

  useEffect(() => {
    if (!showLoginModal) {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, [showLoginModal]);

  useEffect(() => {
    if (!resultImage) {
      navigate("/");
    }
  }, [resultImage, navigate]);

  const handlePostClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      caption: twibbonData?.caption || "",
    },
    resolver: yupResolver(setCaptionSchema),
  });

  const convertBlobUrlToFile = async (blobUrl, fileName) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const onSubmit = async (data) => {
    try {
      const file = await convertBlobUrlToFile(resultImage, "twibbon-result.png");

      const response = await mutateAsync({
        url: "/event-user-twibbon",
        data: {
          event_twibbon_id: twibbonData.id,
          caption: data.caption,
          image: file,
        },
      });
      if (response.status === 201) {
        setIsPosted(true);
        openToast("toast", true, t('result.post_success'), "success");
      }
    } catch (error) {
      switch (error?.response.status) {
        case 401:
          openToast("toast", true, t('result.insufficient_data'), "error");
          break;
        case 403:
          openToast("toast", true, t('create.errors.contributor_required'), "info");
          setShowLoginModal(true);
          break;
        default:
          openToast("toast", true, t('auth.server_error'), "error");
          break;
      }
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    handlePost();
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    console.log("Switch to register modal");
  };

  const handleCopyCaption = async () => {
    const captionValue = document.querySelector("textarea[name='caption']")?.value;
    if (captionValue) {
      await navigator.clipboard.writeText(captionValue);
      openToast("toast", true, t('result.caption_copied'), "success");
    } else {
      openToast("toast", true, t('result.caption_empty'), "info");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavbarEditor title={twibbonData?.title} />

      <div className="items-center justify-center gap-6 p-6 mx-auto md:grid md:grid-cols-2 max-w-7xl">
        {/* Result photo section */}
        <div className="md:col-span-1">
          <div className="relative max-w-xl mx-auto w-fit">
            <div className="relative w-fit">
              <img
                src={resultImage}
                alt={t('result.twibbon_result')}
                className="object-contain h-auto rounded-lg shadow w-fit"
              />
            </div>
          </div>

          {/* Download link */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('result.photo_not_downloaded')}{" "}
              <a
                href={resultImage}
                download="twibbon-result.png"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                {t('result.redownload')}
              </a>
            </span>
          </div>
        </div>

        {/* Desktop Control Panel */}
        <div className="hidden p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 md:block">
          {isPosted ? (
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold text-green-600 dark:text-green-400">
                {t('result.posted_successfully')}
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {t('result.photo_posted_to_gypem')}
              </p>
              <button
                onClick={handleRestart}
                className="w-full px-4 py-3 font-medium text-center text-gray-700 transition-colors bg-yellow-400 rounded-lg dark:text-gray-200 hover:bg-yellow-600"
              >
                {t('result.create_twibbon_again')}
              </button>
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
                {t('result.post_photo_to_gypem')}
              </h2>
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  {/* Caption + Copy */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="caption"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {t('create.form.caption')}
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyCaption}
                        className="px-2 py-1 text-xs text-purple-600 border rounded dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>

                    <InputWithLabel
                      control={control}
                      name="caption"
                      htmlFor="caption"
                      type="textarea"
                      placeholder={t('create.form.caption_placeholder')}
                      error={errors}
                      disabled={isPending}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePostClick}
                    disabled={isPending}
                    className="w-full px-4 py-2 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-purple-500 dark:hover:bg-purple-600"
                  >
                    {isPending
                      ? t('result.posting')
                      : isLoggedIn
                      ? t('result.post_to_gypem')
                      : t('result.login_and_post_to_gypem')}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="w-full px-4 py-3 font-medium text-center text-gray-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900"
                  >
                    {t('result.create_again')}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Mobile Control Panel */}
        <div className="p-4 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 md:hidden">
          {isPosted ? (
            <div className="text-center">
              <h3 className="mb-4 text-lg font-semibold text-green-600 dark:text-green-400">
                {t('result.posted_successfully')}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {t('result.photo_posted_to_gypem')}
              </p>
              <button
                onClick={handleRestart}
                className="flex items-center justify-center w-full px-4 py-3 font-medium text-center text-gray-700 transition-colors bg-yellow-400 rounded-lg dark:text-gray-200 hover:bg-yellow-600"
              >
                {t('result.create_twibbon_again')}
              </button>
            </div>
          ) : (
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
                  {t('result.post_photo_to_gypem')}
                </h3>
                {/* Caption + Copy */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="caption"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t('create.form.caption')}
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyCaption}
                      className="px-2 py-1 text-xs text-purple-600 border rounded dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700"
                    >
                      <Copy className="w-5" />
                    </button>
                  </div>

                  <InputWithLabel
                    className="h-96"
                    control={control}
                    name="caption"
                    htmlFor="caption"
                    type="textarea"
                    placeholder={t('create.form.caption_placeholder')}
                    error={errors}
                    maxLength={500}
                    disabled={isPending}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handlePostClick}
                disabled={isPending}
                className="w-full px-4 py-2 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-purple-500 dark:hover:bg-purple-600"
              >
                {isPending
                  ? t('result.posting')
                  : isLoggedIn
                  ? t('result.post_to_gypem')
                  : t('result.login_and_post_to_gypem')}
              </button>

              <button
                onClick={handleRestart}
                className="w-full px-4 py-3 mt-3 font-medium text-center text-gray-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900"
              >
                {t('result.create_again')}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Modal Login */}
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default Result;