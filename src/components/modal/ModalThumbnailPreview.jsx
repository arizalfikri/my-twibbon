import React, { useState, useRef, useEffect } from "react";
import { X, Shuffle, Upload } from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toPng, toBlob } from "html-to-image";

// Import local thumbnails
import SampleBg1 from "../../assets/images/thumbnails/sample_bg.png";
import SampleBg2 from "../../assets/images/thumbnails/sample_bg4.png";
import SampleBg3 from "../../assets/images/thumbnails/sample_bg2.png";
import SampleBg4 from "../../assets/images/thumbnails/sample_bg3.png";

import SampleNoBg1 from "../../assets/images/thumbnails/sample_nobg.png";
import SampleNoBg2 from "../../assets/images/thumbnails/sample_nobg4.png";
import SampleNoBg3 from "../../assets/images/thumbnails/sample_nobg2.png";
import SampleNoBg4 from "../../assets/images/thumbnails/sample_nobg3.png";

// Utility function to compress image to under 2MB
const compressImage = async (blob, maxSize = 2 * 1024 * 1024) => {
  if (blob.size <= maxSize) return blob;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate compression ratio based on file size
        const compressionRatio = Math.sqrt(maxSize / blob.size);
        width = Math.floor(width * compressionRatio);
        height = Math.floor(height * compressionRatio);

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { alpha: true });
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with quality compression
        canvas.toBlob(
          (compressedBlob) => {
            resolve(compressedBlob || blob);
          },
          "image/png",
          0.8 // quality setting
        );
      };
    };
  });
};

function ModalThumbnailPreview({
  isOpen,
  onClose,
  onConfirm,
  framePreview,
  uploadType = "frame",
}) {
  const [selectedThumb, setSelectedThumb] = useState(null);
  const canvasRef = useRef(null);
  const [displayThumbs, setDisplayThumbs] = useState([]);
  const [frameSrc, setFrameSrc] = useState(null);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustedThumb, setAdjustedThumb] = useState(null);
  const transformRef = useRef(null);

  const bgThumbnails = [SampleBg1, SampleBg2, SampleBg3, SampleBg4];
  const nobgThumbnails = [SampleNoBg1, SampleNoBg2, SampleNoBg3, SampleNoBg4];

  const getRandomThree = () => {
    const sourceThumbs = uploadType === "frame" ? bgThumbnails : nobgThumbnails;
    const shuffled = [...sourceThumbs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    setDisplayThumbs(getRandomThree());
  }, [uploadType]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedThumb(null);
      setAdjustedThumb(null);
      setIsAdjusting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let mounted = true;
    setFrameSrc(null);

    if (framePreview && typeof framePreview !== "string") {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!mounted) return;
        setFrameSrc(e.target.result);
      };
      reader.readAsDataURL(framePreview);
    } else if (typeof framePreview === "string") {
      setFrameSrc(framePreview);
    }

    return () => {
      mounted = false;
    };
  }, [framePreview]);

  const handleShuffle = () => {
    setDisplayThumbs(getRandomThree());
    setAdjustedThumb(null);
  };

  if (!isOpen) return null;

  const handlePublish = async () => {
    const thumbToUse = adjustedThumb || selectedThumb;
    if (!canvasRef.current || !thumbToUse) return;

    try {
      const blob = await toBlob(canvasRef.current, {
        pixelRatio: 2,
        useCORS: true,
        cacheBust: true,
        backgroundColor: "transparent",
        allowTaint: true,
      });

      if (!blob) throw new Error("Blob export failed");

      // Compress PNG to under 2MB
      const compressedBlob = await compressImage(blob);
      const finalFile = new File([compressedBlob], "thumbnail.png", {
        type: "image/png",
      });

      console.log(
        `Thumbnail created: ${finalFile.name} (${(
          finalFile.size / 1024
        ).toFixed(2)} KB)`
      );
      onConfirm(finalFile);
    } catch (err) {
      console.error("Thumbnail export failed:", err);

      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = thumbToUse;

        img.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = 144;
            canvas.height = 144;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, 144, 144);

            const fallbackDataUrl = canvas.toDataURL("image/png");
            const res = await fetch(fallbackDataUrl);
            const blob = await res.blob();

            const compressedBlob = await compressImage(blob);
            const finalFile = new File([compressedBlob], "thumbnail.png", {
              type: "image/png",
            });

            console.log(
              `Thumbnail created (fallback): ${finalFile.name} (${(
                finalFile.size / 1024
              ).toFixed(2)} KB)`
            );
            onConfirm(finalFile);
          } catch (convErr) {
            console.error("Fallback conversion failed:", convErr);
            alert(
              "Gagal membuat thumbnail. Coba foto lain atau upload gambar langsung."
            );
          }
        };

        img.onerror = () => {
          alert(
            "Gagal membuat thumbnail. Coba foto lain atau upload gambar langsung."
          );
        };
      } catch (fallbackErr) {
        console.error("Fallback export failed:", fallbackErr);
        alert(
          "Gagal membuat thumbnail. Coba foto lain atau upload gambar langsung."
        );
      }
    }
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-end p-4 bg-black/40 md:items-center md:justify-center">
      <div
        className="
     bg-white shadow-lg 
    rounded-t-2xl w-full p-6 
    max-h-[80vh] overflow-y-auto

    fixed bottom-0
    md:static md:bottom-auto

    md:rounded-xl md:max-w-md md:max-h-none
  "
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-500"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* ==== LIVE ZOOM / DRAG CANVAS ==== */}
        <div className="flex flex-col items-center">
          <div
            ref={canvasRef}
            className="overflow-hidden relative mb-3 border"
            style={{ width: 144, height: 144 }}
          >
            {/* LAYER ORDER BERDASARKAN TYPE */}
            {uploadType === "frame" ? (
              <>
                {/* Frame: Sample di belakang, frame di depan */}
                {(adjustedThumb || selectedThumb) && (
                  <div className="absolute inset-0">
                    <TransformWrapper
                      defaultScale={1}
                      minScale={0.5}
                      maxScale={5}
                      centerOnInit
                      wheel={{ disabled: true }}
                      doubleClick={{ disabled: true }}
                      pinch={{ disabled: true }}
                      panning={{ disabled: true }}
                    >
                      <TransformComponent>
                        <img
                          src={adjustedThumb || selectedThumb}
                          className="object-contain w-full h-full"
                          alt="thumb"
                          crossOrigin="anonymous"
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  </div>
                )}

                {/* Frame overlay di depan */}
                {frameSrc && (
                  <img
                    src={frameSrc}
                    className="object-cover absolute inset-0 z-10 w-full h-full pointer-events-none"
                    alt="frame"
                    crossOrigin="anonymous"
                  />
                )}
              </>
            ) : (
              <>
                {/* Background: Background di belakang, sample di depan */}
                {frameSrc && (
                  <img
                    src={frameSrc}
                    className="object-cover absolute inset-0 w-full h-full"
                    alt="background"
                    crossOrigin="anonymous"
                  />
                )}

                {(adjustedThumb || selectedThumb) && (
                  <div className="absolute inset-0 z-10">
                    <TransformWrapper
                      defaultScale={1}
                      minScale={0.5}
                      maxScale={5}
                      centerOnInit
                      limitToBounds={false}
                      wheel={{ disabled: true }}
                      doubleClick={{ disabled: true }}
                      pinch={{ disabled: true }}
                      panning={{ disabled: true }}
                    >
                      <TransformComponent>
                        <img
                          src={adjustedThumb || selectedThumb}
                          className="object-contain w-full h-full"
                          alt="thumb"
                          crossOrigin="anonymous"
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sesuaikan Button */}
          {selectedThumb && !isAdjusting && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setIsAdjusting(true)}
                className="px-6 py-2 font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600"
              >
                Sesuaikan
              </button>
            </div>
          )}
        </div>

        {/* Adjustment Modal */}
        {isAdjusting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
            <div className="p-6 w-full max-w-md bg-white rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-center">
                Sesuaikan Foto
              </h3>

              <div
                className="overflow-hidden relative mb-4 rounded-xl border"
                style={{
                  width: "100%",
                  maxWidth: 400,
                  height: 400,
                  margin: "0 auto",
                }}
              >
                {uploadType === "frame" ? (
                  <>
                    {selectedThumb && (
                      <div className="absolute inset-0">
                        <TransformWrapper
                          ref={transformRef}
                          defaultScale={1}
                          minScale={0.5}
                          maxScale={5}
                          centerOnInit
                          wheel={{ disabled: false }}
                          doubleClick={{ disabled: true }}
                          pinch={{ disabled: false }}
                          panning={{ disabled: false }}
                        >
                          <TransformComponent
                            wrapperStyle={{ width: "100%", height: "100%" }}
                          >
                            <img
                              src={selectedThumb}
                              className="object-contain w-full h-full"
                              alt="adjust"
                              crossOrigin="anonymous"
                            />
                          </TransformComponent>
                        </TransformWrapper>
                      </div>
                    )}

                    {frameSrc && (
                      <img
                        src={frameSrc}
                        className="object-cover absolute inset-0 z-10 w-full h-full pointer-events-none"
                        alt="frame"
                        crossOrigin="anonymous"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {frameSrc && (
                      <img
                        src={frameSrc}
                        className="object-cover absolute inset-0 w-full h-full"
                        alt="background"
                        crossOrigin="anonymous"
                      />
                    )}

                    {selectedThumb && (
                      <div className="absolute inset-0 z-10">
                        <TransformWrapper
                          ref={transformRef}
                          defaultScale={1}
                          minScale={0.5}
                          maxScale={5}
                          centerOnInit
                          limitToBounds={false}
                          wheel={{ disabled: false }}
                          doubleClick={{ disabled: true }}
                          pinch={{ disabled: false }}
                          panning={{ disabled: false }}
                        >
                          <TransformComponent
                            wrapperStyle={{ width: "100%", height: "100%" }}
                          >
                            <img
                              src={selectedThumb}
                              className="object-contain w-full h-full"
                              alt="adjust"
                              crossOrigin="anonymous"
                            />
                          </TransformComponent>
                        </TransformWrapper>
                      </div>
                    )}
                  </>
                )}
              </div>

              <p className="mb-4 text-sm text-center text-gray-600">
                Gunakan scroll untuk zoom, drag untuk menggeser foto
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsAdjusting(false)}
                  className="flex-1 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    // Capture the adjusted image
                    const adjustCanvas = document.createElement("canvas");
                    adjustCanvas.width = 144;
                    adjustCanvas.height = 144;
                    const ctx = adjustCanvas.getContext("2d");

                    try {
                      const blob = await toBlob(
                        document.querySelector(
                          ".fixed.inset-0.z-\\[60\\] .relative"
                        ),
                        {
                          pixelRatio: 2,
                          useCORS: true,
                          cacheBust: true,
                          backgroundColor: "transparent",
                        }
                      );

                      if (blob) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setAdjustedThumb(e.target.result);
                          setIsAdjusting(false);
                        };
                        reader.readAsDataURL(blob);
                      }
                    } catch (err) {
                      console.error("Failed to capture adjusted image:", err);
                      // Fallback: just use the selected thumb
                      setAdjustedThumb(selectedThumb);
                      setIsAdjusting(false);
                    }
                  }}
                  className="flex-1 py-2 font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600"
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Picker */}
        <div className="mt-6">
          <p className="mb-2 font-medium text-center">
            Select or Upload a Thumbnail
          </p>

          <div className="grid grid-cols-4 gap-3 px-2 mb-4">
            {displayThumbs.map((item, i) => (
              <div
                key={i}
                className={`p-1 border rounded-lg cursor-pointer ${
                  selectedThumb === item
                    ? "border-primary-500"
                    : "border-gray-300"
                }`}
                onClick={() => {
                  setSelectedThumb(item);
                  setAdjustedThumb(null);
                }}
              >
                <img src={item} className="object-cover w-20 h-20 rounded-md" />
              </div>
            ))}

            {/* Upload Button */}
            <label className="flex justify-center items-center w-full h-full text-gray-600 rounded-lg border border-gray-300 cursor-pointer">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // Validate file type
                  const allowedTypes = [
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/webp",
                  ];
                  if (!allowedTypes.includes(file.type)) {
                    alert(
                      "Format file tidak didukung. Gunakan PNG, JPG, JPEG, atau WEBP."
                    );
                    e.target.value = "";
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                    setSelectedThumb(reader.result);
                    setAdjustedThumb(null);
                  };
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }}
              />
              <Upload size={18} />
            </label>
          </div>

          {/* Shuffle button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleShuffle}
              className="flex gap-2 items-center px-4 py-2 text-white rounded-lg bg-primary-500"
            >
              <Shuffle size={18} />
              Shuffle
            </button>
          </div>

          {/* Publish */}
          <button
            onClick={handlePublish}
            disabled={!selectedThumb}
            className="py-3 mb-3 w-full font-medium text-white rounded-lg bg-primary-500 disabled:bg-gray-400"
          >
            Publish Campaign
          </button>

          <button
            onClick={onClose}
            className="py-3 w-full text-gray-700 bg-gray-200 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalThumbnailPreview;
