// components/CardEditor.jsx
import React, { useRef, useState, useEffect } from "react";
import frameImage from "../../assets/images/frame4.png";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useNavigate } from "react-router-dom";
import useImageStore from "../../helper/store/imagestore";
import useUIStore from "../../helper/store/uiStore"; // Import UI store
import html2canvas from "html2canvas";
import { useMutation } from "@tanstack/react-query";
import UploadModal from "../modal/UploudModal";
import CameraCapture from "../modal/CameraCapture";
import ControlPanel from "../ui/ControlPanel"; // Import komponen baru

function CardEditor() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { image, setImage, setResultImage } = useImageStore();
  
  // Zustand UI state
  const { 
    showUploadModal, 
    showCamera,
    setShowUploadModal,
    setShowCamera,
    setIsDownloading,
    openCamera,
    closeUploadModal,
    closeCamera
  } = useUIStore();
  
  const [frameAspectRatio, setFrameAspectRatio] = useState('1/1');
  
  // Effect untuk mendeteksi aspect ratio frame image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      setFrameAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`);
    };
    img.onerror = () => {
      setFrameAspectRatio('1/1');
    };
    img.src = frameImage;
  }, []);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      navigate("/editorpage");
    }
  };

  const handleCameraCapture = (imageDataUrl) => {
    setImage(imageDataUrl);
    navigate("/editorpage");
  };

  const handleCameraSelect = () => {
    openCamera(); // Menggunakan action dari store
  };

  const handleFileSelect = (e) => {
    handleImageUpload(e);
    closeUploadModal(); // Menggunakan action dari store
  };

  // Function untuk proses download - FIXED untuk resolusi frame asli
  const downloadImage = async () => {
    if (!containerRef.current) {
      throw new Error("Container not found");
    }

    const frame = new Image();
    frame.src = frameImage;
    frame.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
      frame.onload = async () => {
        try {
          // Gunakan dimensi asli frame untuk hasil akhir
          const frameWidth = frame.naturalWidth;
          const frameHeight = frame.naturalHeight;
          
          // Dapatkan dimensi container saat ini
          const containerWidth = containerRef.current.offsetWidth;
          const containerHeight = containerRef.current.offsetHeight;
          
          // Hitung scale ratio untuk menyesuaikan dari container ke frame asli
          const scaleRatio = Math.min(frameWidth / containerWidth, frameHeight / containerHeight);

          // Tunggu sebentar untuk memastikan rendering selesai
          await new Promise((res) => setTimeout(res, 500));

          // Capture dengan dimensi container tapi scale up ke resolusi frame
          const canvas = await html2canvas(containerRef.current, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            width: containerWidth,
            height: containerHeight,
            scale: scaleRatio, // Scale untuk mendapatkan resolusi frame asli
            logging: false,
            onclone: (clonedDoc) => {
              // Pastikan semua gambar di dokumen klon sudah loaded
              const images = clonedDoc.querySelectorAll('img');
              images.forEach(img => {
                img.style.maxWidth = 'none';
                img.style.maxHeight = 'none';
              });
            }
          });

          if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error("html2canvas did not return a valid canvas");
          }

          // Jika ukuran canvas belum sesuai frame, resize manual
          if (canvas.width !== frameWidth || canvas.height !== frameHeight) {
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = frameWidth;
            finalCanvas.height = frameHeight;
            const ctx = finalCanvas.getContext('2d');
            
            // Gambar hasil capture ke canvas final dengan ukuran frame
            ctx.drawImage(canvas, 0, 0, frameWidth, frameHeight);
            
            const dataUrl = finalCanvas.toDataURL("image/png", 1.0);
            
            const link = document.createElement("a");
            link.download = "twibbon.png";
            link.href = dataUrl;
            link.click();
            
            resolve(dataUrl);
          } else {
            const dataUrl = canvas.toDataURL("image/png", 1.0);

            const link = document.createElement("a");
            link.download = "twibbon.png";
            link.href = dataUrl;
            link.click();

            resolve(dataUrl);
          }
        } catch (error) {
          console.error("Download error:", error);
          reject(error);
        }
      };

      frame.onerror = () => {
        reject(new Error("Failed to load frame image"));
      };
    });
  };

  // TanStack Query mutation dengan Zustand integration
  const downloadMutation = useMutation({
    mutationFn: downloadImage,
    onMutate: () => {
      setIsDownloading(true); // Set loading state
    },
    onSuccess: (dataUrl) => {
      setResultImage(dataUrl);
      setIsDownloading(false);
      setTimeout(() => {
        navigate("/result");
      }, 500);
    },
    onError: (error) => {
      console.error("Download failed:", error);
      setIsDownloading(false);
      alert("Download gagal. Silakan coba lagi.");
    },
  });

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div
            ref={containerRef}
            className="relative max-w-sm w-[100%] md:w-[200%] overflow-hidden lg:max-w-md rounded-xl"
            style={{
              aspectRatio: frameAspectRatio,
              // Tambahkan style untuk memastikan dimensi tetap
              minWidth: '320px',
              minHeight: '320px'
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
                    style={{
                      // Pastikan gambar tidak terpotong saat di-capture
                      maxWidth: 'none',
                      maxHeight: 'none'
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
              style={{
                // Pastikan frame tidak terpotong saat di-capture
                maxWidth: 'none',
                maxHeight: 'none'
              }}
            />
          </div>
          
          {/* Menggunakan ControlPanel component */}
          <ControlPanel 
            onDownload={handleDownload}
            hasImage={!!image}
          />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onFileSelect={handleFileSelect}
        onCameraSelect={handleCameraSelect}
      />

      {/* Camera */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={closeCamera} // Menggunakan action dari store
        />
      )}
    </>
  );
}

export default CardEditor;