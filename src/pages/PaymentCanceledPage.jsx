import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Clock,
  House,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layoutpage/Navbar";

function PaymentCanceledPage() {
  const containerRef = useRef(null);
  const canceledIconRef = useRef(null);
  const titleRef = useRef(null);
  const messageRef = useRef(null);
  const buttonRef = useRef(null);
  const infoRef = useRef(null);
  const finalMessageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline();

    // Animasi container masuk
    tl.fromTo(
      containerRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: 50,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );

    // Animasi icon clock
    tl.fromTo(
      canceledIconRef.current,
      {
        scale: 0,
        rotation: -180,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.8)",
      },
      "-=0.3"
    );

    // Animasi title
    tl.fromTo(
      titleRef.current,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // Animasi message
    tl.fromTo(
      messageRef.current,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // Animasi info
    tl.fromTo(
      infoRef.current,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // Animasi final message
    tl.fromTo(
      finalMessageRef.current,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // Animasi button
    tl.fromTo(
      buttonRef.current,
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "-=0.2"
    );

    // Animasi floating particles
    gsap.to(".floating-particle", {
      y: -15,
      rotation: 180,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 1.5,
        from: "random",
      },
    });
  }, []);

  const handleBackToMembership = () => {
    const tl = gsap.timeline();
    tl.to(containerRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.6,
      ease: "power2.in",
    }).then(() => {
      navigate("/membership");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full floating-particle opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container flex items-center justify-center min-h-screen px-4">
        <div
          ref={containerRef}
          className="relative w-full max-w-md p-8 bg-white shadow-xl rounded-2xl dark:bg-gray-800"
        >
          {/* Canceled Icon */}
          <div ref={canceledIconRef} className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping dark:bg-yellow-900"></div>
              <Clock className="relative z-10 w-24 h-24 text-yellow-500" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1
              ref={titleRef}
              className="mb-4 text-3xl font-bold text-gray-900 dark:text-white"
            >
              Pembayaran Dibatalkan
            </h1>

            <p
              ref={messageRef}
              className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
            >
              Proses pembayaran telah dibatalkan. Anda dapat mencoba lagi kapan saja.
            </p>

            <div 
              ref={infoRef}
              className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
            >
              <p className="text-yellow-700 dark:text-yellow-300">
                <strong>Perhatian:</strong> Pembayaran dibatalkan karena waktu transaksi telah habis atau Anda membatalkan proses secara manual.
              </p>
            </div>

            <p 
              ref={finalMessageRef}
              className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
            >
              Tidak ada yang dikenakan biaya. Anda dapat mengulangi proses pembayaran kapan saja.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                ref={buttonRef}
                onClick={handleBackToMembership}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 bg-yellow-500 rounded-lg hover:bg-yellow-600 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                Kembali ke Membership
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95"
              >
                <House className="w-5 h-5" />
                Kembali Ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCanceledPage;