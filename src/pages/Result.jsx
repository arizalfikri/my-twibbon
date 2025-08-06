import React, { useEffect, useState } from "react";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import CardEditor from "../components/cards/CardEditor";
import useImageStore from "../helper/store/imagestore";
import { Camera } from "lucide-react";
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
  const navigate = useNavigate();
  const { resultImage, image } = useImageStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State untuk status login
  const [caption, setCaption] = useState("");
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
    if (!image) {
      navigate("/");
    }
  }, [image, navigate]);

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
      const file = await convertBlobUrlToFile(image, "twibbon-result.png");

      const response = await mutateAsync({
        url: "/event-user-twibbon",
        data: {
          event_twibbon_id: twibbonData.id,
          caption: data.caption,
          image: file,
        },
      });
      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      switch (error?.response.status) {
        case 401:
          openToast("toast", true, "kurang data");
          break;
        case 403:
          openToast("toast", true, "Anda Harus Menjadi Peserta.", "info");
          break;
        default:
          openToast("toast", true, "Kesalahan Server");
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
    // Logic untuk buka modal register atau navigate ke halaman register
    console.log("Switch to register modal");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarEditor title={twibbonData?.title} />
      <div className="items-center justify-center gap-6 p-6 mx-auto md:grid md:grid-cols-2 max-w-7xl">
        {/* Result photo section */}
        <div className="md:col-span-1">
          <div className="relative w-full max-w-xl mx-auto">
            <div className="relative w-full">
              <img
                src={resultImage}
                alt="Hasil Twibbon"
                className="object-contain w-full h-auto rounded-lg shadow"
              />
            </div>
          </div>

          {/* Download link - always below image */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Foto belum terunduh?{" "}
              <a
                href={resultImage}
                download="twibbon-result.png"
                className="font-semibold text-purple-600 hover:underline"
              >
                Unduh Ulang
              </a>
            </span>
          </div>
        </div>

        {/* Desktop Control Panel - positioned on the right */}
        <div className="hidden p-6 bg-white border border-gray-200 rounded-lg shadow-sm md:block">
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
            Posting Foto ini Ke Gypem
          </h2>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <InputWithLabel
                control={control}
                name="caption"
                htmlFor="caption"
                label="caption "
                type="textarea"
                placeholder="Bagikan rincian tentang kampanyemu untuk menarik dukungan"
                error={errors}
              ></InputWithLabel>
              <button
                type="button"
                onClick={handlePostClick}
                className="w-full px-4 py-2 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                {isLoggedIn ? "Post ke Gypem" : "Masuk & Post ke Gypem"}
              </button>
              <button
                onClick={handleRestart}
                className="w-full px-4 py-3 font-medium text-center text-gray-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-600"
              >
                Buat Lagi
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Control Panel - Positioned naturally at bottom */}
        <div className="p-4 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm md:hidden">
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-800">
                Posting Foto ini Ke Gypem
              </h3>

              <InputWithLabel
                className="h-96"
                control={control}
                name="caption"
                htmlFor="caption"
                label="caption "
                type="textarea"
                placeholder="Bagikan rincian tentang kampanyemu untuk menarik dukungan"
                error={errors}
              ></InputWithLabel>
            </div>

            <div className="grid w-full grid-cols-4 gap-3">
              <button
                onClick={handleRestart}
                className="flex items-center justify-center col-span-2 px-4 py-3 font-medium text-center text-gray-700 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-600"
              >
                Buat Lagi
              </button>
              <button
                type="button"
                onClick={handlePostClick}
                className="flex items-center justify-center col-span-2 gap-2 px-4 py-3 font-medium text-center text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                {isLoggedIn ? "Post" : "Masuk & Post"}
              </button>
            </div>
          </form>
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
