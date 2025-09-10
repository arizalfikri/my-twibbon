import React, { useRef, useState, useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useNavigate } from "react-router-dom";
import useImageStore from "../../helper/store/imagestore";
import useUIStore from "../../helper/store/uiStore";
import html2canvas from "html2canvas";
import UploadModal from "../modal/UploudModal";
import CameraCapture from "../modal/CameraCapture";
import ControlPanel from "../ui/ControlPanel";

function CardEditor({
  frameImage,
  filters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
  },
}) {
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
    return () => {
      setShowUploadModal(false);
      setShowCamera(false);
    };
  }, [setShowUploadModal, setShowCamera]);

  useEffect(() => {
    if (!frameImage) return;
    const img = new Image();
    img.onload = () =>
      setFrameAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`);
    img.onerror = () => setFrameAspectRatio("1/1");
    img.src = frameImage;
  }, [frameImage]);

  // Generate CSS filter string from filters object
  const generateFilterString = (filtersObj) => {
    const filterParts = [];

    if (filtersObj.brightness !== 100) {
      filterParts.push(`brightness(${filtersObj.brightness}%)`);
    }
    if (filtersObj.contrast !== 100) {
      filterParts.push(`contrast(${filtersObj.contrast}%)`);
    }
    if (filtersObj.saturation !== 100) {
      filterParts.push(`saturate(${filtersObj.saturation}%)`);
    }
    if (filtersObj.hue !== 0) {
      filterParts.push(`hue-rotate(${filtersObj.hue}deg)`);
    }
    if (filtersObj.blur > 0) {
      filterParts.push(`blur(${filtersObj.blur}px)`);
    }
    if (filtersObj.sepia > 0) {
      filterParts.push(`sepia(${filtersObj.sepia}%)`);
    }
    if (filtersObj.grayscale > 0) {
      filterParts.push(`grayscale(${filtersObj.grayscale}%)`);
    }

    return filterParts.length > 0 ? filterParts.join(" ") : "none";
  };

  // Apply filters to canvas context manually for user image only
  const applyFiltersToUserImage = (canvas, filtersObj) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply brightness
      if (filtersObj.brightness !== 100) {
        const brightnessFactor = filtersObj.brightness / 100;
        r = Math.min(255, Math.max(0, r * brightnessFactor));
        g = Math.min(255, Math.max(0, g * brightnessFactor));
        b = Math.min(255, Math.max(0, b * brightnessFactor));
      }

      // Apply contrast
      if (filtersObj.contrast !== 100) {
        const contrastFactor = filtersObj.contrast / 100;
        r = Math.min(255, Math.max(0, (r - 128) * contrastFactor + 128));
        g = Math.min(255, Math.max(0, (g - 128) * contrastFactor + 128));
        b = Math.min(255, Math.max(0, (b - 128) * contrastFactor + 128));
      }

      // Apply saturation
      if (filtersObj.saturation !== 100) {
        const saturationFactor = filtersObj.saturation / 100;
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = Math.min(255, Math.max(0, gray + saturationFactor * (r - gray)));
        g = Math.min(255, Math.max(0, gray + saturationFactor * (g - gray)));
        b = Math.min(255, Math.max(0, gray + saturationFactor * (b - gray)));
      }

      // Apply grayscale
      if (filtersObj.grayscale > 0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const factor = filtersObj.grayscale / 100;
        r = r + factor * (gray - r);
        g = g + factor * (gray - g);
        b = b + factor * (gray - b);
      }

      // Apply sepia
      if (filtersObj.sepia > 0) {
        const factor = filtersObj.sepia / 100;
        const tr =
          (0.393 * r + 0.769 * g + 0.189 * b) * factor + r * (1 - factor);
        const tg =
          (0.349 * r + 0.686 * g + 0.168 * b) * factor + g * (1 - factor);
        const tb =
          (0.272 * r + 0.534 * g + 0.131 * b) * factor + b * (1 - factor);
        r = Math.min(255, tr);
        g = Math.min(255, tg);
        b = Math.min(255, tb);
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply hue rotation using CSS filter if needed
    if (filtersObj.hue !== 0) {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.filter = `hue-rotate(${filtersObj.hue}deg)`;
      tempCtx.drawImage(canvas, 0, 0);
      return tempCanvas;
    }

    return canvas;
  };

  // Generate final image with filtered user image and clean frame
  const generateFinalImageWithSeparateLayers = async () => {
    if (!containerRef.current || !image)
      throw new Error("Container or image not found");

    // Load frame image
    const frameImg = new Image();
    frameImg.src = frameImage;
    frameImg.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      frameImg.onload = resolve;
      frameImg.onerror = () => reject(new Error("Failed to load frame image"));
    });

    const frameWidth = frameImg.naturalWidth;
    const frameHeight = frameImg.naturalHeight;
    const { offsetWidth: containerWidth, offsetHeight: containerHeight } =
      containerRef.current;
    const scaleRatio = Math.min(
      frameWidth / containerWidth,
      frameHeight / containerHeight
    );

    // Temporarily remove filters and capture the current zoom/pan state
    const userImage = containerRef.current.querySelector(
      '[data-user-image="true"]'
    );
    const originalFilter = userImage ? userImage.style.filter : "";

    if (userImage) {
      userImage.style.filter = "none";
    }

    await new Promise((res) => setTimeout(res, 100));

    // Capture only the user image area with current zoom/pan applied
    const canvas = await html2canvas(containerRef.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      width: containerWidth,
      height: containerHeight,
      scale: scaleRatio,
      logging: false,
      onclone: (clonedDoc) => {
        // Hide frame in the cloned document to capture only user image
        const frameInClone = clonedDoc.querySelector(
          'img[alt="Twibbon Frame"]'
        );
        if (frameInClone) {
          frameInClone.style.display = "none";
        }

        clonedDoc.querySelectorAll("img").forEach((img) => {
          img.style.maxWidth = "none";
          img.style.maxHeight = "none";
        });
      },
    });

    // Restore original filter
    if (userImage) {
      userImage.style.filter = originalFilter;
    }

    // Apply filters to the captured canvas
    const filteredCanvas = applyFiltersToUserImage(canvas, filters);

    // Create final canvas with correct dimensions
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = frameWidth;
    finalCanvas.height = frameHeight;
    const ctx = finalCanvas.getContext("2d");

    // Draw the filtered user image (preserving zoom/pan)
    ctx.drawImage(filteredCanvas, 0, 0, frameWidth, frameHeight);

    // Draw clean frame on top (without filters)
    ctx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);

    return finalCanvas.toDataURL("image/png", 1.0);
  };

  // Fallback method using html2canvas with separate handling
  const generateFinalImageFallback = async () => {
    if (!containerRef.current) throw new Error("Container not found");

    // Load frame image
    const frameImg = new Image();
    frameImg.src = frameImage;
    frameImg.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      frameImg.onload = resolve;
      frameImg.onerror = () => reject(new Error("Failed to load frame"));
    });

    const frameWidth = frameImg.naturalWidth;
    const frameHeight = frameImg.naturalHeight;
    const { offsetWidth: containerWidth, offsetHeight: containerHeight } =
      containerRef.current;
    const scaleRatio = Math.min(
      frameWidth / containerWidth,
      frameHeight / containerHeight
    );

    // Temporarily remove filters and frame, then capture user image with zoom/pan
    const userImage = containerRef.current.querySelector(
      '[data-user-image="true"]'
    );
    const frameElement = containerRef.current.querySelector(
      'img[alt="Twibbon Frame"]'
    );

    const originalFilter = userImage ? userImage.style.filter : "";

    if (userImage) {
      userImage.style.filter = "none";
    }
    if (frameElement) {
      frameElement.style.display = "none";
    }

    await new Promise((res) => setTimeout(res, 100));

    const userCanvas = await html2canvas(containerRef.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      width: containerWidth,
      height: containerHeight,
      scale: scaleRatio,
      logging: false,
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll("img").forEach((img) => {
          img.style.maxWidth = "none";
          img.style.maxHeight = "none";
        });
      },
    });

    // Restore elements
    if (userImage) {
      userImage.style.filter = originalFilter;
    }
    if (frameElement) {
      frameElement.style.display = "";
    }

    // Apply filters only to user image canvas
    const filteredUserCanvas = applyFiltersToUserImage(userCanvas, filters);

    // Create final composition with correct dimensions
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = frameWidth;
    finalCanvas.height = frameHeight;
    const ctx = finalCanvas.getContext("2d");

    // Draw filtered user image with proper scaling
    ctx.drawImage(filteredUserCanvas, 0, 0, frameWidth, frameHeight);

    // Draw clean frame on top
    ctx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);

    return finalCanvas.toDataURL("image/png", 1.0);
  };

  // Handle download with separate layer approach
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      let dataUrl;

      try {
        // Try the separate layers method first
        dataUrl = await generateFinalImageWithSeparateLayers();
      } catch (error) {
        console.warn("Separate layers method failed, using fallback:", error);
        // Use fallback method
        dataUrl = await generateFinalImageFallback();
      }

      // Trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `twibbon_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Store in Zustand
      setResultImage(dataUrl);
      setImage(dataUrl);
      navigate("/result");
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download gagal. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    navigate("/editorpage");
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
              style={{ maxWidth: "none", maxHeight: "none" }}
            />
          </div>

          <ControlPanel onDownload={handleDownload} hasImage={!!image} />
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
    </>
  );
}

export default CardEditor;
