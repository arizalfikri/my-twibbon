import React, { useRef, useState, useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useNavigate } from "react-router-dom";
import useImageStore from "../../helper/store/imagestore";
import useUIStore from "../../helper/store/uiStore";
import html2canvas from "html2canvas";
import UploadModal from "../modal/UploudModal";
import CameraCapture from "../modal/CameraCapture";
import ControlPanel from "../ui/ControlPanel";

function CardEditor({ frameImage }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { image, setImage, setResultImage } = useImageStore();

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

  const [frameAspectRatio, setFrameAspectRatio] = useState("1/1");

  useEffect(() => {
    if (!frameImage) return;
    const img = new Image();
    img.onload = () => setFrameAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`);
    img.onerror = () => setFrameAspectRatio("1/1");
    img.src = frameImage;
  }, [frameImage]);

  // Generate composited image data URL
  const generateFinalImage = async () => {
    if (!containerRef.current) throw new Error("Container not found");
    const frame = new Image();
    frame.src = frameImage;
    frame.crossOrigin = "anonymous";

    await new Promise((res, rej) => {
      frame.onload = res;
      frame.onerror = () => rej(new Error("Failed to load frame image"));
    });

    const frameWidth = frame.naturalWidth;
    const frameHeight = frame.naturalHeight;
    const { offsetWidth: containerWidth, offsetHeight: containerHeight } = containerRef.current;
    const scaleRatio = Math.min(frameWidth / containerWidth, frameHeight / containerHeight);

    // ensure rendering
    await new Promise(res => setTimeout(res, 300));

    const canvas = await html2canvas(containerRef.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      width: containerWidth,
      height: containerHeight,
      scale: scaleRatio,
      logging: false,
      onclone: doc => doc.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';
      })
    });

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = frameWidth;
    finalCanvas.height = frameHeight;
    const ctx = finalCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, frameWidth, frameHeight);

    return finalCanvas.toDataURL('image/png', 1.0);
  };

  // Handle download: generate, trigger link, store, and navigate
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const dataUrl = await generateFinalImage();
      // trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'twibbon.png';
      link.click();
      // store in Zustand
      setResultImage(dataUrl);
      setImage(dataUrl);
      navigate('/result');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download gagal. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    navigate('/editorpage');
  };

  const handleCameraCapture = dataUrl => {
    setImage(dataUrl);
    navigate('/editorpage');
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div
            ref={containerRef}
            className="relative max-w-sm w-full md:w-[200%] overflow-hidden lg:max-w-md rounded-xl"
            style={{ aspectRatio: frameAspectRatio, minWidth: '320px', minHeight: '320px' }}
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
                <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                  <img
                    src={image}
                    alt="Uploaded"
                    className="object-cover w-full h-full"
                    crossOrigin="anonymous"
                    style={{ maxWidth: 'none', maxHeight: 'none' }}
                  />
                </TransformComponent>
              </TransformWrapper>
            )}
            <img
              src={frameImage}
              alt="Twibbon Frame"
              className="absolute inset-0 object-cover w-full h-full pointer-events-none"
              crossOrigin="anonymous"
              style={{ maxWidth: 'none', maxHeight: 'none' }}
            />
          </div>

          <ControlPanel onDownload={handleDownload} hasImage={!!image} />
        </div>
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onFileSelect={e => { handleImageUpload(e); closeUploadModal(); }}
        onCameraSelect={() => { openCamera(); closeUploadModal(); }}
      />

      {showCamera && (
        <CameraCapture
          onCapture={dataUrl => { handleCameraCapture(dataUrl); closeCamera(); }}
          onClose={closeCamera}
        />
      )}
    </>
  );
}

export default CardEditor;
