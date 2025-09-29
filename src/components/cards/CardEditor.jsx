import React, { useRef, useState, useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useNavigate } from "react-router-dom";
import useImageStore from "../../helper/store/imagestore";
import useUIStore from "../../helper/store/uiStore";
import UploadModal from "../modal/UploudModal";
import CameraCapture from "../modal/CameraCapture";
import ControlPanel from "../ui/ControlPanel";
import { toPng } from "html-to-image";
import gypemLogo from "../../assets/images/Gypem_Watermark.png";
import { usePOST } from "../../services/api";
import ModalMembership from "../modal/ModalMembership";

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
}) {
  const { mutateAsync } = usePOST("/support");
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { image, setImage, setResultImage } = useImageStore();
  const [isExporting, setIsExporting] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [downloadWithWatermark, setDownloadWithWatermark] = useState(false);
  const [isMember, setIsMember] = useState(false);

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
  const [frameSize, setFrameSize] = useState({ width: 1080, height: 1080 }); // default 1080

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Set aspect ratio & size frame sesuai ukuran asli
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

  // Cleanup modal on unmount
  useEffect(() => {
    return () => {
      setShowUploadModal(false);
      setShowCamera(false);
    };
  }, [setShowUploadModal, setShowCamera]);

  // Generate CSS filter string
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

  // Generate final image dengan ukuran asli frame
  const generateFinalImage = async () => {
    if (!containerRef.current || !image) throw new Error("Container missing");

    try {
      setIsExporting(true); // aktifkan logo khusus export

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
      setIsExporting(false); // reset lagi ke mode normal
    }
  };

  const handleDownload = async (withWatermark = false) => {
    try {
      if (!isLoaded) {
        alert("Tunggu gambar selesai dimuat...");
        return;
      }

      setIsDownloading(true);

      // bedakan state watermark
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
      setDownloadWithWatermark(false); // reset biar ga kebawa ke next download
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result); // simpan base64 aman
      navigate("/editorpage");
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (dataUrl) => {
    setImage(dataUrl);
    navigate("/editorpage");
  };

  const currentFilterString = generateFilterString(filters);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div
            ref={containerRef}
            className="relative max-w-sm w-full md:w-[200%] overflow-hidden lg:max-w-md rounded-xl"
            style={{
              aspectRatio: frameAspectRatio,
              minWidth: "320px",
              minHeight: "320px",
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
                  wrapperStyle={{ width: "100%", height: "100%" }}
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
              style={{ maxWidth: "none", maxHeight: "none" }}
            />
            {/* WATERMARK */}
            {isExporting && downloadWithWatermark && (
              <div className="absolute flex items-center px-2 py-1 text-gray-600 shadow-md shadow-gray-800 rounded-2xl bottom-2 right-2 bg-white/95">
                <span className="text-[8px] font-medium ">Made with</span>
                <img
                  src={gypemLogo}
                  alt="Logo"
                  className="object-contain h-4 w-fit"
                  crossOrigin="anonymous"
                />
              </div>
            )}
          </div>

          <ControlPanel
            onDownload={() => {
              if (SubscribeData?.status === "active") {
                handleDownload(false);
              } else {
                setShowMembershipModal(true);
              }
            }}
            hasImage={!!image}
          />
        </div>
      </div>

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
        onDownloadMember={() => handleDownload(false)} // no watermark
        onDownloadWatermark={() => handleDownload(true)} // dengan watermark
      />
    </>
  );
}

export default CardEditor;
