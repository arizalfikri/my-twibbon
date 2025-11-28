import React, { useRef, useState, useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useNavigate, useParams } from "react-router-dom";
import useImageStore from "../../helper/store/imagestore";
import useUIStore from "../../helper/store/uiStore";
import UploadModal from "../modal/UploudModal";
import CameraCapture from "../modal/CameraCapture";
import ControlPanel from "../ui/ControlPanel";
import { toPng } from "html-to-image";
import gypemLogo from "../../assets/images/logo/Logo_Hitam.png";
import { usePOST } from "../../services/api";
import ModalMembership from "../modal/ModalMembership";
import ModalGreenscreen from "../modal/ModalGreenscreen";
import ExampleModal from "../modal/ExampleModal ";

function CardEditor({
  frameImage,
  filters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    sepia: 0,
    grayscale: 0,
  },
  event_twibbon_id,
  SubscribeData,
  templateType = "frame",
  watermarkRequired = false,
  isSubscribed = false,
}) {
  const { mutateAsync } = usePOST("/support");
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { image, setImage, setResultImage } = useImageStore();
  const [isExporting, setIsExporting] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [downloadWithWatermark, setDownloadWithWatermark] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showGreenscreenModal, setShowGreenscreenModal] = useState(false);
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const [pendingImageData, setPendingImageData] = useState(null);
  const [showExampleModal, setShowExampleModal] = useState(false); // Modal contoh
  const { slug } = useParams();

  // State untuk menentukan apakah sedang dalam proses upload pertama kali
  const [isInitialUpload, setIsInitialUpload] = useState(true);

  const shouldShowWatermark =
    watermarkRequired === true &&
    userRole === "contributor" &&
    isSubscribed === false;
  const shouldShowModal =
    watermarkRequired === true &&
    userRole === "contributor" &&
    isSubscribed === false;

  const {
    showUploadModal,
    showCamera,
    setShowUploadModal,
    setShowCamera,
    setIsDownloading,
    openCamera,
    closeUploadModal,
    closeCamera,
  } = useUIStore();

  const [isLoaded, setIsLoaded] = useState(false);
  const [frameAspectRatio, setFrameAspectRatio] = useState("1/1");
  const [frameSize, setFrameSize] = useState({ width: 1080, height: 1080 });

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Determine userRole dari subscription data
  useEffect(() => {
    if (SubscribeData?.[0]?.role) {
      setUserRole(SubscribeData[0].role.toLowerCase());
    } else {
      setUserRole("");
    }
  }, [SubscribeData]);

  useEffect(() => {
    if (!frameImage) return;
    const img = new Image();
    img.onload = () => {
      setFrameSize({ width: img.naturalWidth, height: img.naturalHeight });
      setFrameAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`);
    };
    img.onerror = () => setFrameAspectRatio("1/1");
    img.src = frameImage;
  }, [frameImage]);

  useEffect(() => {
    return () => {
      setShowUploadModal(false);
      setShowCamera(false);
    };
  }, [setShowUploadModal, setShowCamera]);

  // Example modal will be shown when user clicks Upload — see handleUploadClick

  const handleUploadClick = () => {
    // For background templates on first upload we prefer to show the example modal first
    if (templateType === "background" && isInitialUpload && !image) {
      setShowExampleModal(true);
    } else {
      // fallback: open upload modal immediately
      setShowUploadModal(true);
    }
  };

  const generateFilterString = (f) => {
    const parts = [];
    if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
    if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
    if (f.saturation !== 100) parts.push(`saturate(${f.saturation}%)`);
    if (f.hue !== 0) parts.push(`hue-rotate(${f.hue}deg)`);
    if (f.blur > 0) parts.push(`blur(${f.blur}px)`);
    if (f.sepia > 0) parts.push(`sepia(${f.sepia}%)`);
    if (f.grayscale > 0) parts.push(`grayscale(${f.grayscale}%)`);
    return parts.length ? parts.join(" ") : "none";
  };

  const generateFinalImage = async () => {
    if (!containerRef.current || !image) throw new Error("Container missing");

    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const scale = frameSize.width / containerRef.current.offsetWidth;

      const dataUrl = await toPng(containerRef.current, {
        width: frameSize.width,
        height: frameSize.height,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${containerRef.current.offsetWidth}px`,
          height: `${containerRef.current.offsetHeight}px`,
        },
        pixelRatio: 1,
        backgroundColor: "transparent",
        useCORS: true,
        cacheBust: true,
      });

      return dataUrl;
    } catch (error) {
      console.error("html-to-image error:", error);
      throw new Error("Gagal generate gambar");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async (withWatermark = false) => {
    try {
      if (!isLoaded) {
        alert("Tunggu gambar selesai dimuat...");
        return;
      }

      setIsDownloading(true);
      setDownloadWithWatermark(withWatermark);
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const dataUrl = await generateFinalImage();

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `twibbon_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setResultImage(dataUrl);
      navigate("/result");

      await mutateAsync({
        url: "/support",
        data: { event_twibbon_id },
      });
    } catch (err) {
      console.error(err);
      alert("Download gagal. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
      setIsExporting(false);
      setDownloadWithWatermark(false);
    }
  };

  // Fungsi untuk memulai proses upload
  const startUploadProcess = () => {
    setShowExampleModal(false);
    setIsInitialUpload(false);
    setShowUploadModal(true);
  };
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name);
    console.log("Template type:", templateType);
    console.log("Current showGreenscreenModal:", showGreenscreenModal);

    const reader = new FileReader();
    reader.onload = () => {
      if (templateType === "background") {
        console.log("Setting greenscreen modal to TRUE");
        setPendingImageData(reader.result);
        setShowUploadModal(false);
        setShowGreenscreenModal(true);

        setTimeout(() => {
          handleRemoveBgAuto(reader.result);
        }, 100);
      } else {
        setImage(reader.result);
        navigate(`/${slug}/editorpage`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (dataUrl) => {
    // Jika background type, langsung proses greenscreen
    if (templateType === "background") {
      setPendingImageData(dataUrl);
      setShowCamera(false);
      setShowGreenscreenModal(true);

      // Auto proses background removal setelah modal terbuka
      setTimeout(() => {
        handleRemoveBgAuto(dataUrl);
      }, 100);
    } else {
      // Jika frame type, langsung set image
      setImage(dataUrl);
      navigate(`/${slug}/editorpage`);
    }
  };

  const handleRemoveBgAuto = async (imageData) => {
    try {
      setIsProcessingBg(true);

      const { removeBackground } = await import("@imgly/background-removal");
      const result = await removeBackground(imageData);

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsProcessingBg(false);
        setPendingImageData(null);
        setShowGreenscreenModal(false);

        setTimeout(() => {
          navigate(`/${slug}/editorpage`);
        }, 300);
      };
      reader.readAsDataURL(result);
    } catch (error) {
      console.error("Auto background removal error:", error);
      setIsProcessingBg(false);
      // Fallback ke image original jika gagal
      setImage(imageData);
      setPendingImageData(null);
      setShowGreenscreenModal(false);
      setTimeout(() => {
        navigate(`/${slug}/editorpage`);
      }, 300);
    }
  };

  const currentFilterString = generateFilterString(filters);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div
            ref={containerRef}
            className="relative w-full mx-auto overflow-hidden rounded-xl"
            style={{
              aspectRatio: frameAspectRatio,
            }}
          >
            {image && (
              <TransformWrapper
                defaultScale={1}
                minScale={0.5}
                maxScale={10}
                centerOnInit
                centerZoomedOut
                wheel={{ step: 50 }}
                doubleClick={{ disabled: true }}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: "130%",
                    height: "150%",
                    position: "absolute",
                    left: "-60px",
                    zIndex: templateType === "background" ? 1 : 10,
                  }}
                >
                  <img
                    src={image}
                    alt="Uploaded"
                    className="object-cover w-full h-full"
                    crossOrigin="anonymous"
                    data-user-image="true"
                    onLoad={handleImageLoad}
                    style={{
                      maxWidth: "none",
                      maxHeight: "none",
                      filter: currentFilterString,
                    }}
                  />
                </TransformComponent>
              </TransformWrapper>
            )}
            <img
              src={frameImage}
              alt="Twibbon Frame"
              className="absolute inset-0 object-cover w-full h-full pointer-events-none"
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              style={{
                maxWidth: "none",
                maxHeight: "none",
                zIndex: templateType === "background" ? 0 : 20,
              }}
            />
            {isExporting && downloadWithWatermark && shouldShowWatermark && (
              <div
                id="watermark-fixed"
                className="absolute flex items-center justify-center gap-1 px-2 py-[4px]
      text-gray-700 bg-white/95 rounded-lg shadow-md shadow-gray-600
      bottom-[10px] right-[10px]"
                style={{
                  transformOrigin: "bottom right",
                  scale: "clamp(0.7, 1vw, 1)",
                  zIndex: 30,
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(7px, 1.3vw, 10px)",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  Made with
                </span>
                <img
                  src={gypemLogo}
                  alt="Logo"
                  style={{
                    height: "clamp(8px, 2vw, 13px)",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  crossOrigin="anonymous"
                />
              </div>
            )}
          </div>

          <ControlPanel
            onDownload={() => {
              const isSubscribed = SubscribeData?.[0]?.status === "ACTIVE";

              if (isSubscribed || !shouldShowModal) {
                handleDownload(false);
              } else {
                if (shouldShowModal) {
                  setShowMembershipModal(true);
                } else {
                  handleDownload(false);
                }
              }
            }}
            hasImage={!!image}
            onUpload={handleUploadClick}
          />
        </div>
      </div>

      {/* Modal Contoh Gambar - hanya untuk background template dan pertama kali */}
      <ExampleModal
        isOpen={showExampleModal}
        onClose={() => setShowExampleModal(false)}
        onContinue={startUploadProcess}
        templateType={templateType}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onFileSelect={(e) => {
          handleImageUpload(e);
          closeUploadModal();
        }}
        onCameraSelect={() => {
          openCamera();
          closeUploadModal();
        }}
      />

      {showCamera && (
        <CameraCapture
          onCapture={(dataUrl) => {
            handleCameraCapture(dataUrl);
            closeCamera();
          }}
          onClose={closeCamera}
        />
      )}

      <ModalMembership
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        onDownloadMember={() => {
          handleDownload(false);
          setShowMembershipModal(false);
        }}
        onDownloadWatermark={() => {
          handleDownload(true);
          setShowMembershipModal(false);
        }}
      />

      {/* Modal Greenscreen - langsung proses tanpa konfirmasi */}
      <ModalGreenscreen
        isOpen={showGreenscreenModal}
        isProcessing={isProcessingBg}
      />

      {/* Loading Indicator saat process BG */}
      {isProcessingBg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-center text-gray-700 dark:text-gray-200">
              🎨 Menghapus Background...
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default CardEditor;
