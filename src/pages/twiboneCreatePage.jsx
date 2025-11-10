import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import ImageUploadArea from "../components/uploadArea/ImageUploadArea";
import ModalFileTypeError from "../components/modal/modalFileTypeError";
import { useForm } from "react-hook-form";
import { useGET, usePOST } from "../services/api";
import { useGlobalStore } from "../helper/store/global.store";
import { useModalStore } from "../helper/store/modal.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTwiboneSchema } from "../helper/yup";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ModalLogin from "../components/modal/modalLogin";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";

function TwiboneCreatePage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { mutateAsync, isPending } = usePOST("/event-twibbon");
  const { openToast } = useModalStore();
  const { token } = useGlobalStore();
  const navigate = useNavigate();

  // Get twibbons data for duplicate checking
  const { data: twibbonsData } = useGET("/twibbons");

  // Media Query: Deteksi desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Form control
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    resolver: yupResolver(createTwiboneSchema),
    mode: "onChange", 
    reValidateMode: "onChange",
  });

  const descValue = watch("caption") || "";
  const imageValue = watch("image");

  // Watch for title and link changes
  const watchTitle = watch("title");
  const watchLink = watch("link");
  const [debouncedTitle] = useDebounce(watchTitle, 600);
  const [debouncedLink] = useDebounce(watchLink, 600);

  // Duplicate checking with debounce
  useEffect(() => {
    if (!twibbonsData?.data) return;

    if (debouncedTitle) {
      const isDuplicateTitle = twibbonsData.data.some(
        (item) => item.title.toLowerCase() === debouncedTitle.toLowerCase()
      );
      if (isDuplicateTitle) {
        setError("title", {
          type: "manual",
          message: t("create.errors.duplicate_title"),
        });
      } else {
        clearErrors("title");
      }
    }

    if (debouncedLink) {
      const isDuplicateSlug = twibbonsData.data.some(
        (item) =>
          item.slug_event_twibbon.toLowerCase() === debouncedLink.toLowerCase()
      );
      if (isDuplicateSlug) {
        setError("link", {
          type: "manual",
          message: t("create.errors.duplicate_link"),
        });
      } else {
        clearErrors("link");
      }
    }
  }, [debouncedTitle, debouncedLink, twibbonsData, setError, clearErrors, t]);

  const steps = isDesktop
    ? [{ title: t("create.steps.campaign_details") }]
    : [
        { title: t("create.steps.image") },
        { title: t("create.steps.campaign_details") },
      ];

  const totalSteps = steps.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const onSubmit = async (data) => {
    try {
      const response = await mutateAsync({
        url: "/event-twibbon",
        data: data,
      });
      if (response.status === 201) {
        await queryClient.invalidateQueries(["twibbons"]);
        navigate("/");
      }
    } catch (error) {
      switch (error?.response.status) {
        case 401:
          openToast(
            "toast",
            true,
            t("create.errors.contributor_required"),
            "info"
          );
          setShowLoginModal(true);
          break;
        case 400:
          openToast("toast", true, error?.response.message);
          break;
        case 403:
          openToast(
            "toast",
            true,
            t("create.errors.contributor_required"),
            "info"
          );
          setShowLoginModal(true);
          break;
        case 409:
          openToast("toast", true, t("create.errors.data_already_used"));
          break;
        default:
          openToast("toast", true, t("create.errors.server_error"));
          break;
      }
    }
  };

  const renderStepContent = () => {
    const adjustedStep = isDesktop ? currentStep + 1 : currentStep;
    const key = isDesktop ? "desktop" : "mobile";

    switch (adjustedStep) {
      case 0: // mobile only
        return (
          <div
            key={`${currentStep}-${key}`}
            className="w-full border-r border-gray-200 bg-gray-50 dark:bg-gray-800 md:hidden"
          >
            <ImageUploadArea
              name="image"
              setValue={setValue}
              error={errors}
              value={imageValue}
            />
          </div>
        );

      case 1:
        return (
          <div key={`${currentStep}-${key}`} className="space-y-6">
            <InputWithLabel
              control={control}
              name="title"
              htmlFor="title"
              label={
                <>
                  {t("create.form.campaign_title")}{" "}
                  <span className="ml-1 text-red-500">*</span>
                </>
              }
              placeholder={t("create.form.title_placeholder")}
              error={errors}
            />

            <InputWithLabel
              control={control}
              name="caption"
              htmlFor="caption"
              label={t("create.form.caption")}
              type="textarea"
              placeholder={t("create.form.caption_placeholder")}
              error={errors}
              className="h-50"
              maxLength={500}
            />

            <InputWithLabel
              control={control}
              name="link"
              htmlFor="link"
              label={t("create.form.campaign_link")}
              prefix="twibbo.nz/"
              placeholder={t("create.form.link_placeholder")}
              error={errors}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const isSubmitDisabled = isPending || errors.title || errors.link;

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <NavbarEditor title={t("create.page_title")} />

      <div className="flex flex-col flex-1 md:flex-row md:overflow-hidden ">
        {/* Sidebar Gambar (desktop) */}
        <div className="hidden w-1/2 border-r border-gray-200 dark:border-gray-700 md:block bg-gray-50 dark:bg-gray-800">
          <ImageUploadArea
            name="image"
            setValue={setValue}
            error={errors?.image}
            value={imageValue}
          />
        </div>

        {/* Form Step */}
        <div className="flex-1 bg-white dark:bg-gray-900 md:w-1/2">
          <div className="h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {steps[currentStep]?.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("create.step_description")}
              </p>
              <div className="flex items-center mt-4 space-x-2">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full ${
                      idx <= currentStep
                        ? "bg-primary-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t("create.step_counter", {
                  current: currentStep + 1,
                  total: totalSteps,
                })}
              </div>
            </div>

            {/* Content & Navigation */}
            <div className="flex flex-col h-[calc(100%-140px)]">
              <div className="flex-1 p-4 overflow-y-auto md:p-6">
                {renderStepContent()}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 md:p-6">
                <div className="flex items-center space-x-4">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center justify-center px-4 py-3 text-gray-700 bg-gray-200 rounded-lg dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      <ChevronLeft size={20} className="mr-2" />
                      {t("create.buttons.back")}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={
                      currentStep === totalSteps - 1
                        ? handleSubmit(onSubmit)
                        : nextStep
                    }
                    disabled={isSubmitDisabled}
                    className={`flex items-center justify-center flex-1 px-6 py-3 text-white rounded-lg transition-colors
    ${
      isSubmitDisabled
        ? "bg-primary-400 cursor-not-allowed"
        : "bg-primary-600 hover:bg-primary-700"
    }`}
                  >
                    {isPending ? (
                      <span className="flex items-center">
                        <Loader2 size={20} className="animate-spin" />

                        {t("create.buttons.saving")}
                      </span>
                    ) : currentStep === totalSteps - 1 ? (
                      t("create.buttons.save")
                    ) : (
                      <>
                        {t("create.buttons.next")}
                        <ChevronRight size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalFileTypeError />

      {/* Modal Login untuk Kontributor */}
      <ModalLogin
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        kontributor={true}
      />
    </div>
  );
}

export default TwiboneCreatePage;
