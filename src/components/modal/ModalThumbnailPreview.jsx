import React, { useState, useRef, useEffect } from "react";
import { X, Shuffle } from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toPng, toBlob } from "html-to-image";

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

// Utility function to generate SVG thumbnail (ultra-lightweight)
const generateSvgThumbnail = async (canvas) => {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e) => {
        const base64 = e.target.result.split(",")[1];
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144">
          <image href="data:image/png;base64,${base64}" width="144" height="144"/>
        </svg>`;

        const svgBlob = new Blob([svg], { type: "image/svg+xml" });
        const svgFile = new File([svgBlob], "thumbnail.svg", {
          type: "image/svg+xml",
        });
        resolve(svgFile);
      };
    });
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
  const [compressionFormat, setCompressionFormat] = useState("png"); // "png" or "svg"

  const thumbnails = [
    // Male
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",

    // Female
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",

    // Neutral / Random portraits
    "https://picsum.photos/id/1005/600/600",
    "https://picsum.photos/id/1011/600/600",
    "https://picsum.photos/id/1027/600/600",
  ];

  const getRandomThree = () => {
    const shuffled = [...thumbnails].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    setDisplayThumbs(getRandomThree());
  }, []);

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
  };

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (!canvasRef.current || !selectedThumb) return;

    try {
      const blob = await toBlob(canvasRef.current, {
        pixelRatio: 2,
        useCORS: true,
        cacheBust: true,
        backgroundColor: "transparent",
        allowTaint: true,
      });

      if (!blob) throw new Error("Blob export failed");

      let finalFile;
      if (compressionFormat === "svg") {
        // Generate SVG version
        finalFile = await generateSvgThumbnail(canvasRef.current);
      } else {
        // Compress PNG to under 2MB
        const compressedBlob = await compressImage(blob);
        finalFile = new File([compressedBlob], "thumbnail.png", {
          type: "image/png",
        });
      }

      console.log(
        `Thumbnail created: ${finalFile.name} (${(finalFile.size / 1024).toFixed(2)} KB)`
      );
      onConfirm(finalFile);
    } catch (err) {
      console.error("Thumbnail export failed:", err);

      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = selectedThumb;

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

            let finalFile;
            if (compressionFormat === "svg") {
              finalFile = await generateSvgThumbnail(canvas);
            } else {
              const compressedBlob = await compressImage(blob);
              finalFile = new File([compressedBlob], "thumbnail.png", {
                type: "image/png",
              });
            }

            console.log(
              `Thumbnail created (fallback): ${finalFile.name} (${(finalFile.size / 1024).toFixed(2)} KB)`
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
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/40 md:items-center md:justify-center">
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
          className="absolute text-gray-500 top-3 right-3"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* ==== LIVE ZOOM / DRAG CANVAS ==== */}
        <div className="flex flex-col items-center">
          <div
            ref={canvasRef}
            className="relative mb-3 overflow-hidden border rounded-xl"
            style={{ width: 144, height: 144 }}
          >
            {/* LAYER ORDER BERDASARKAN TYPE */}
            {uploadType === "frame" ? (
              <>
                {/* Frame: Sample di belakang, frame di depan */}
                {selectedThumb && (
                  <div className="absolute inset-0">
                    <TransformWrapper
                      defaultScale={1}
                      minScale={0.5}
                      maxScale={8}
                      centerOnInit
                      wheel={{ disabled: false }}
                      doubleClick={{ disabled: true }}
                      pinch={{ disabled: false }}
                      panning={{ disabled: false }}
                    >
                      <TransformComponent>
                        <img
                          src={selectedThumb}
                          className="object-cover w-full h-full"
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
                    className="absolute inset-0 z-10 object-cover w-full h-full pointer-events-none"
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
                    className="absolute inset-0 object-cover w-full h-full"
                    alt="background"
                    crossOrigin="anonymous"
                  />
                )}

                {selectedThumb && (
                  <div className="absolute inset-0 z-10">
                    <TransformWrapper
                      defaultScale={1}
                      minScale={0.1}
                      maxScale={8}
                      centerOnInit
                      limitToBounds={false}
                      wheel={{ disabled: false }}
                      doubleClick={{ disabled: true }}
                      pinch={{ disabled: false }}
                      panning={{ disabled: false }}
                    >
                      <TransformComponent>
                        <img
                          src={selectedThumb}
                          className="object-cover w-full h-full"
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
        </div>

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
                onClick={() => setSelectedThumb(item)}
              >
                <img src={item} className="object-cover w-20 h-20 rounded-md" />
              </div>
            ))}

            {/* Upload Button */}
            <label className="flex items-center justify-center w-full h-20 border border-gray-300 rounded-lg cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => setSelectedThumb(reader.result);
                  reader.readAsDataURL(file);
                }}
              />
              Upload
            </label>
          </div>

  

          {/* Shuffle button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-primary-500"
            >
              <Shuffle size={18} />
              Shuffle
            </button>
          </div>

          {/* Publish */}
          <button
            onClick={handlePublish}
            disabled={!selectedThumb}
            className="w-full py-3 mb-3 font-medium text-white rounded-lg bg-primary-500 disabled:bg-gray-400"
          >
            Publish Campaign
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-gray-700 bg-gray-200 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalThumbnailPreview;
