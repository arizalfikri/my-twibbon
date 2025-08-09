import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import ImageUploadArea from "../components/uploadArea/ImageUploadArea";
import ModalFileTypeError from "../components/modal/modalFileTypeError";
import { useForm } from "react-hook-form";
import { usePOST } from "../services/api";
import { useGlobalStore } from "../helper/store/global.store";
import { useModalStore } from "../helper/store/modal.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTwiboneSchema } from "../helper/yup";

function TwiboneCreatePage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);
    const { mutateAsync, isPending } = usePOST("/event-twibbon");
    const { openToast } = useModalStore();
    const { token } = useGlobalStore();

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
  } = useForm({ resolver: yupResolver(createTwiboneSchema) });

  const descValue = watch("caption") || "";

  // const visibilityOptions = [
  //   { value: "", label: "Pilih tingkat visibilitas" },
  //   { value: "publik", label: "Publik" },
  //   { value: "terbatas", label: "Terbatas" },
  //   { value: "privat", label: "Privat" },
  // ];

  const steps = isDesktop
    ? [
        { title: "Rincian Kampanye" },
        // , { title: "Kontak & Visibilitas"  }
      ]
    : [
        { title: "Gambar" },
        { title: "Rincian Kampanye" },
        // { title: "Kontak & Visibilitas" },
      ];

  const totalSteps = steps.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

    const onSubmit = async (data) => {
        try {
            const response = await mutateAsync({
                url: "/event-twibbon",
                data: data,
            });
            if (response.status === 201) {
                navigate("/");
            }
        } catch (error) {
            switch (error?.response.status) {
                case 401:
                    openToast("toast", true, "kurang data");
                    break;
                case 400:
                    openToast("toast", true, error?.response.message);
                    break;
                case 403:
                    openToast(
                        "toast",
                        true,
                        "Anda Harus Menjadi Kontributor.",
                        "info"
                    );
                    break;
                default:
                    openToast("toast", true, "Kesalahan Server");
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
            className="w-full border-r border-gray-200 bg-gray-50 md:hidden"
          >
            <ImageUploadArea name="image" setValue={setValue} error={errors} />
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
                  Judul Kampanye <span className="ml-1 text-red-500">*</span>
                </>
              }
              placeholder="Dapat berupa angka, alfabet atau karakter spesial"
              error={errors}
            />

            <InputWithLabel
              control={control}
              name="caption"
              htmlFor="caption"
              label="caption "
              type="textarea"
              placeholder="Bagikan rincian tentang kampanyemu untuk menarik dukungan"
              error={errors}
                className="h-50"

            />

            <InputWithLabel
              control={control}
              name="link"
              htmlFor="link"
              label="Link Kampanye"
              prefix="twibbo.nz/"
              placeholder="link-kampanye"
              error={errors}
            />
          </div>
        );

      // case 2:
      //   return (
      //     <div key={`${currentStep}-${key}`} className="space-y-6">
      //       <InputWithLabel
      //         control={control}
      //         name="Template_Caption"
      //         htmlFor="Template_Caption"
      //         label={
      //           <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
      //             <Globe size={16} className="text-gray-500" />
      //             <span>Template Caption</span>
      //           </div>
      //         }
      //         placeholder="contoh: Ayo dukung kampanye ini!"
      //         error={errors.Template_Caption?.message}
      //       />

      //       <InputSelectWithLabel
      //         control={control}
      //         option_label="label"
      //         option_value="value"
      //         name="visibility"
      //         htmlFor="visibility"
      //         defaultValue=""
      //         label={
      //           <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
      //             <Tag size={16} className="text-gray-500" />
      //             <span>Visibilitas</span>
      //           </div>
      //         }
      //         options={visibilityOptions}
      //         error={errors}
      //       />
      //     </div>
      //   );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavbarEditor title="Create Twibone" />

      <div className="flex flex-col flex-1 md:flex-row md:overflow-hidden">
        {/* Sidebar Gambar (desktop) */}
        <div className="hidden w-1/2 border-r border-gray-200 md:block bg-gray-50">
          <ImageUploadArea
            name="image"
            setValue={setValue}
            error={errors?.image}
          />
        </div>

        {/* Form Step */}
        <div className="flex-1 bg-white md:w-1/2">
          <div className="h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {steps[currentStep]?.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Lengkapi informasi kampanye Anda
              </p>
              <div className="flex items-center mt-4 space-x-2">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full ${
                      idx <= currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Langkah {currentStep + 1} dari {totalSteps}
              </div>
            </div>

            {/* Content & Navigation */}
            <div className="flex flex-col h-[calc(100%-140px)]">
              <div className="flex-1 p-4 overflow-y-auto md:p-6">
                {renderStepContent()}
              </div>

              <div className="p-4 border-t border-gray-200 md:p-6">
                <div className="flex items-center space-x-4">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center justify-center px-4 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      <ChevronLeft size={20} className="mr-2" />
                      Kembali
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={
                      currentStep === totalSteps - 1
                        ? handleSubmit(onSubmit)
                        : nextStep
                    }
                    disabled={isPending}
                    className={`flex items-center justify-center flex-1 px-6 py-3 text-white rounded-lg transition-colors
    ${
      isPending
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
                  >
                    {isPending ? (
                      <span className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-white animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 018 8z"
                          ></path>
                        </svg>
                        Menyimpan...
                      </span>
                    ) : currentStep === totalSteps - 1 ? (
                      "Simpan"
                    ) : (
                      <>
                        Selanjutnya
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
    </div>
  );
}

export default TwiboneCreatePage;
