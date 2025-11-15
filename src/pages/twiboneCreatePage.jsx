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
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ModalLogin from "../components/modal/modalLogin";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";

export const generateSlug = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
export function SlugGenerator() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [manualEdit, setManualEdit] = useState(false);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (!manualEdit) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(generateSlug(e.target.value));
    setManualEdit(true);
  };

  return (
    <div className="p-4 space-y-4">
      <input
        className="w-full px-2 py-1 border"
        placeholder="Masukkan Title"
        value={title}
        onChange={handleTitleChange}
      />

      <input
        className="w-full px-2 py-1 border"
        placeholder="Automatis Link"
        value={slug}
        onChange={handleSlugChange}
      />
    </div>
  );
}

function TwiboneCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { token, setToken } = useGlobalStore();
  const { openToast } = useModalStore();
  const { mutateAsync, isPending } = usePOST("/event-twibbon");

  const [isDesktop, setIsDesktop] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch data for duplicate checking
  const { data: twibbonsData } = useGET("/twibbons");

  // Form setup
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
  });

  // Watching form fields
  const watchTitle = watch("title");
  const watchLink = watch("link");
  const [debouncedTitle] = useDebounce(watchTitle, 600);
  const [debouncedLink] = useDebounce(watchLink, 600);

  const imageValue = watch("image");

  // Media Query for Desktop Detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateSize = (e) => setIsDesktop(e.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateSize);

    return () => mediaQuery.removeEventListener("change", updateSize);
  }, []);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (!watchTitle) return;

    const autoSlug = generateSlug(watchTitle);
    const currentLink = watch("link");

    if (!currentLink || currentLink === generateSlug(currentLink)) {
      setValue("link", autoSlug, { shouldValidate: true });
    }
  }, [watchTitle, setValue, watch]);

  // Duplicate validation (debounced)
  useEffect(() => {
    if (!twibbonsData?.data) return;

    // Title duplicate check
    if (debouncedTitle) {
      const exists = twibbonsData.data.some(
        (item) => item.title.toLowerCase() === debouncedTitle.toLowerCase()
      );
      exists
        ? setError("title", {
            type: "manual",
            message: t("create.errors.duplicate_title"),
          })
        : clearErrors("title");
    }

    // Slug duplicate check
    if (debouncedLink) {
      const exists = twibbonsData.data.some(
        (item) =>
          item.slug_event_twibbon.toLowerCase() === debouncedLink.toLowerCase()
      );
      exists
        ? setError("link", {
            type: "manual",
            message: t("create.errors.duplicate_link"),
          })
        : clearErrors("link");
    }
  }, [debouncedTitle, debouncedLink, twibbonsData, setError, clearErrors, t]);

  // SubmitHadler

  const onSubmit = async (formData) => {
    if (!token) {
      openToast("toast", true, t("create.errors.contributor_required"), "info");
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await mutateAsync({
        url: "/event-twibbon",
        data: formData,
      });

      if (response.status === 201) {
        await queryClient.invalidateQueries(["twibbons"]);
        navigate("/");
      }
    } catch (error) {
      const status = error?.response?.status;

      const errorMap = {
        401: t("create.errors.contributor_required"),
        403: t("create.errors.contributor_required"),
        409: t("create.errors.data_already_used"),
        400: error?.response?.message,
      };

      openToast(
        "toast",
        true,
        errorMap[status] || t("create.errors.server_error")
      );

      if (status === 403) {
        localStorage.removeItem("token");
        setToken(null);
        setShowLoginModal(true);
      }
    }
  };

  const isSubmitDisabled = isPending || errors.title || errors.link;

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <NavbarEditor title={t("create.page_title_frame")} />

      <div className="flex flex-col flex-1 md:flex-row md:overflow-hidden">
        {/* Sidebar Image (Desktop) */}
        {isDesktop && (
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <ImageUploadArea
              name="image"
              setValue={setValue}
              error={errors?.image}
              value={imageValue}
            />
          </div>
        )}

        {/* Form Area */}
        <div className="flex-1 bg-white dark:bg-gray-900 md:w-1/2">
          <div className="h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 md:p-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {t("create.steps.campaign_details")}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("create.step_description")}
              </p>
            </div>

            {/* Form Content */}
            <div className="flex flex-col h-[calc(100%-140px)]">
              <div className="flex-1 p-4 pb-28 md:p-6 md:overflow-y-auto">
                {/* Mobile Upload */}
                {!isDesktop && (
                  <div className="mb-6">
                    <ImageUploadArea
                      name="image"
                      setValue={setValue}
                      error={errors?.image}
                      value={imageValue}
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

              {/* Submit Button */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:static md:p-6 dark:bg-gray-900 dark:border-gray-700">
                <button
                  type="button"
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit(onSubmit)}
                  className={`w-full px-6 py-3 rounded-lg text-white transition-colors
                    ${
                      isSubmitDisabled
                        ? "bg-primary-400 cursor-not-allowed"
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

      {/* Modals */}
      <ModalFileTypeError />
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default TwiboneCreatePage;
