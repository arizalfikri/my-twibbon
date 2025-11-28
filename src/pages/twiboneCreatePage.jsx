import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ModalLogin from "../components/modal/modalLogin";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import ModalThumbnailPreview from "../components/modal/ModalThumbnailPreview";

export const generateSlug = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

function TwiboneCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { token, setToken } = useGlobalStore();
  const { openToast } = useModalStore();
  const { mutateAsync, isPending } = usePOST("/event-twibbon");

  const [isDesktop, setIsDesktop] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [tempForm, setTempForm] = useState(null);

  const { data: twibbonsData } = useGET("/twibbons");

  // Deteksi type dari URL: /create/frame atau /create/background
  const uploadType = location.pathname.includes("/create/background")
    ? "background"
    : "frame";

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(createTwiboneSchema),
    mode: "onChange",
    defaultValues: {
      template: null,
      title: "",
      link: "",
      caption: "",
    },
  });

  const watchTitle = watch("title");
  const watchLink = watch("link");
  const [debouncedTitle] = useDebounce(watchTitle, 600);
  const [debouncedLink] = useDebounce(watchLink, 600);
  const templateValue = watch("template");

  // Detect desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Auto-create slug
  useEffect(() => {
    if (!watchTitle) return;
    const autoSlug = generateSlug(watchTitle);
    const current = watch("link");
    if (!current || current === generateSlug(current)) {
      setValue("link", autoSlug, { shouldValidate: true });
    }
  }, [watchTitle, setValue, watch]);

  // Duplicate validation
  useEffect(() => {
    if (!twibbonsData?.data) return;

    if (debouncedTitle) {
      const exists = twibbonsData.data.some(
        (i) => i.title.toLowerCase() === debouncedTitle.toLowerCase()
      );
      exists
        ? setError("title", {
            type: "manual",
            message: t("create.errors.duplicate_title"),
          })
        : clearErrors("title");
    }

    if (debouncedLink) {
      const exists = twibbonsData.data.some(
        (i) =>
          i.slug_event_twibbon.toLowerCase() === debouncedLink.toLowerCase()
      );
      exists
        ? setError("link", {
            type: "manual",
            message: t("create.errors.duplicate_link"),
          })
        : clearErrors("link");
    }
  }, [debouncedTitle, debouncedLink, twibbonsData, setError, clearErrors, t]);

  const onSubmit = (formData) => {
    setShowThumbnailModal(true);
    setTempForm({
      ...formData,
      type: uploadType,
    });
  };

  const handleFinalSubmit = async (thumb) => {
    setSelectedThumbnail(thumb);

    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await mutateAsync({
        url: "/event-twibbon",
        data: {
          ...tempForm,
          thumbnail: thumb || null,
        },
      });

      if (response.status === 201) {
        await queryClient.invalidateQueries(["twibbons"]);
        navigate("/");
      }
    } catch (error) {
      const status = error?.response?.status;

      // TOKEN EXPIRED
      if (status === 403 || status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setShowLoginModal(true);
        return;
      }

      openToast("toast", true, "Server error. Please try again.");
    }
  };

  const isSubmitDisabled =
    isPending ||
    errors.title ||
    errors.link ||
    !watch("title") ||
    !watch("link") ||
    !watch("template") ||
    !watch("caption");

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <NavbarEditor
        title={
          uploadType === "frame"
            ? t("create.page_title_frame")
            : t("create.page_title_background")
        }
      />

      <div className="flex flex-col flex-1 md:flex-row md:overflow-hidden">
        {isDesktop && (
          <div className="w-1/2 border-r bg-gray-50 dark:bg-gray-800">
            <ImageUploadArea
              name="template"
              setValue={setValue}
              error={errors?.template}
              value={templateValue}
              type={uploadType}
            />
          </div>
        )}

        <div className="flex-1 bg-white dark:bg-gray-900 md:w-1/2">
          <div className="h-full">
            <div className="p-4 border-b md:p-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold">
                {t("create.steps.campaign_details")}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("create.step_description")}
              </p>
            </div>

            <div className="flex flex-col h-[calc(100%-140px)]">
              <div className="flex-1 p-4 pb-28 md:p-6 md:overflow-y-auto">
                {!isDesktop && (
                  <div className="mb-6">
                    <ImageUploadArea
                      name="template"
                      setValue={setValue}
                      error={errors?.template}
                      value={templateValue}
                      type={uploadType}
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <InputWithLabel
                    control={control}
                    name="title"
                    htmlFor="title"
                    label={
                      <>
                        {t("create.form.campaign_title")}{" "}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    placeholder={t("create.form.title_placeholder")}
                    error={errors}
                  />

                  <InputWithLabel
                    control={control}
                    name="caption"
                    htmlFor="caption"
                    type="textarea"
                    label={t("create.form.caption")}
                    placeholder={t("create.form.caption_placeholder")}
                    maxLength={500}
                    error={errors}
                  />

                  <InputWithLabel
                    control={control}
                    name="link"
                    htmlFor="link"
                    prefix="MyTwibbon/"
                    label={t("create.form.campaign_link")}
                    placeholder={t("create.form.link_placeholder")}
                    error={errors}
                  />
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:static md:p-6 dark:bg-gray-900">
                <button
                  type="button"
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit(onSubmit)}
                  className={`w-full px-6 py-3 rounded-lg text-white ${
                    isSubmitDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      {t("create.buttons.saving")}
                    </span>
                  ) : (
                    t("create.buttons.save")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalFileTypeError />
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <ModalThumbnailPreview
        isOpen={showThumbnailModal}
        onClose={() => setShowThumbnailModal(false)}
        onConfirm={(thumb) => {
          setShowThumbnailModal(false);
          handleFinalSubmit(thumb);
        }}
        framePreview={templateValue}
        uploadType={uploadType}
      />
    </div>
  );
}

export default TwiboneCreatePage;
