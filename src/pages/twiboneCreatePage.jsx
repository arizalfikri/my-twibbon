import React, { useEffect, useState } from "react";
import {
  Upload,
  X,
  Image,
  FileText,
  Link as LinkIcon,
  Calendar,
  Tag,
  User,
  ArrowRightFromLine ,
  Globe,
  Camera,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import InputSelectWithLabel from "../components/FormControl/SelectWithLabel";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import ImageUploadArea from "../components/uploadArea/ImageUploadArea";
import ModalFileTypeError from "../components/modal/modalFileTypeError";
import { useForm } from "react-hook-form";

function TwiboneCreatePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (e) => setIsDesktop(e.matches);

    setIsDesktop(mediaQuery.matches); // initial check
    mediaQuery.addEventListener("change", handleMediaChange); // listen for changes

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);



  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      author: "",
      website: "",
      socialMedia: "",
      visibility: "",
      linkKampanye: "",
    },
    mode: "onChange",
  });

  const categoryOptions = [
    { value: "", label: "Pilih kategori kampanye" },
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  const visibilityOptions = [
    { value: "", label: "Pilih tingkat visibilitas" },
    { value: "publik", label: "Publik" },
    { value: "terbatas", label: "Terbatas" },
    { value: "privat", label: "Privat" },
  ];

  const steps = isDesktop
    ? [
        { title: "Rincian Kampanye" },
        { title: "Kontak & Visibilitas" },
      ]
    : [
        { title: "Gambar" },
        { title: "Rincian Kampanye" },
        { title: "Kontak & Visibilitas" },
      ];

  const totalSteps = steps.length;
  const descValue = watch("description");

  const nextStep = () =>
    currentStep < totalSteps - 1 && setCurrentStep((s) => s + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep((s) => s - 1);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const renderStepContent = () => {
  const adjustedStep = isDesktop ? currentStep + 1 : currentStep;

  switch (adjustedStep) {
    case 0:
      // Ini hanya tampil di mobile
      return (
        <div className="w-full border-r border-gray-200 bg-gray-50 md:hidden">
          <ImageUploadArea />
        </div>
      );

    case 1:
      return (
        <div className="space-y-6">
          <InputWithLabel
            control={control}
            name="title"
            htmlFor="title"
            defaultValue=""
            label={
              <>
                Judul Kampanye
                <span className="ml-1 text-red-500">*</span>
              </>
            }
            placeholder="Dapat berupa angka, alfabet atau karakter spesial"
            error={errors.title?.message}
          />

          <InputWithLabel
            control={control}
            name="description"
            htmlFor="description"
            defaultValue=""
            label="Deskripsi (Opsional)"
            type="textarea"
            placeholder="Bagikan rincian tentang kampanyemu untuk menarik dukungan"
            maxLength={250}
            extraInfo={
              <div className="text-xs text-right text-gray-500">
                {descValue.length}/250
              </div>
            }
            error={errors.description?.message}
          />

          <InputWithLabel
            control={control}
            name="linkKampanye"
            htmlFor="linkKampanye"
            defaultValue=""
            label="Link Kampanye"
            prefix="twibbo.nz/"
            placeholder="link-kampanye"
            error={errors.linkKampanye?.message}
          />
        </div>
      );


    case 2:
      return (
        <div className="space-y-6">
          <InputWithLabel
            control={control}
            name="Template_Caption"
            htmlFor="Template_Caption"
            defaultValue=""
            label={
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Globe size={16} className="text-gray-500" />
                <span>Template_Caption</span>
              </div>
            }
            placeholder="https://example.com"
            error={errors.website?.message}
          />

      

          <InputSelectWithLabel
            control={control}
            option_label="label"
            option_value="value"
            name="visibility"
            htmlFor="visibility"
            defaultValue=""
            label={
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Tag size={16} className="text-gray-500" />
                <span>Visibilitas</span>
              </div>
            }
            options={visibilityOptions}
            error={errors}
          />
        </div>
      );

    default:
      return null;
  }
};


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavbarEditor title="Create Twibone" />
      <div className="flex flex-col flex-1 md:flex-row md:overflow-hidden">
        <div className="hidden w-1/2 border-r border-gray-200 md:block bg-gray-50">
          <ImageUploadArea />
        </div>

        <div className="flex-1 bg-white md:w-1/2">
          <div className="h-full bg-white">
            <div className="p-4 border-b border-gray-200 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {steps[currentStep].title}
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
                    className="flex items-center justify-center flex-1 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {currentStep === totalSteps - 1 ? (
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
