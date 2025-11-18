import { useEffect, useRef, useState } from "react";
import AOS from "aos";

export default function FeatureCard({
  video,
  title,
  description,
  onClick,
  buttonText,
  isProcessing,
}) {
  const cardRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  // AOS Animation
  useEffect(() => {
    AOS.init({ duration: 800, offset: 120, easing: "ease-in-out" });
    AOS.refresh();
  }, []);

  // Sticky Button Behavior Like Twibbonize
  useEffect(() => {
    const target = cardRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // kalau 50% card terlihat → aktifkan sticky button
          setIsSticky(entry.intersectionRatio > 0.5);
        });
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      data-aos="fade-up"
      className="relative flex flex-col items-center p-4 text-center bg-gray-100 shadow-sm dark:bg-black/40 rounded-xl"
    >
      {/* Video Preview */}
      {video && (
        <video
          src={video}
          className="mb-3 rounded-lg shadow-md"
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Title & Description */}
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>

      {/* Sticky Button */}
      {buttonText && (
        <button
          onClick={onClick}
          disabled={isProcessing}
          className={`
            mt-4 py-2 px-4 rounded-full font-semibold transition shadow-lg
            text-white
            ${isSticky 
              ? "fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-black dark:bg-white dark:text-black z-50" 
              : "bg-black dark:bg-white dark:text-black hover:bg-gray-800"}
            disabled:opacity-50
          `}
        >
          {isProcessing ? "Processing..." : buttonText}
        </button>
      )}
    </div>
  );
}
