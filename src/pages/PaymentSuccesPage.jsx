import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CheckCircle, House } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layoutpage/Navbar";
import { useQueryClient } from "@tanstack/react-query";

function PaymentSuccessPage() {
  const containerRef = useRef(null);
  const successIconRef = useRef(null);
  const titleRef = useRef(null);
  const messageRef = useRef(null);
  const buttonRef = useRef(null);
  const listItem1Ref = useRef(null);
  const listItem2Ref = useRef(null);
  const finalMessageRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Refetch ads after successful payment
    queryClient.invalidateQueries(["/ads"]);

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

    // Animasi icon centang
    tl.fromTo(
      successIconRef.current,
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

    // Animasi list items dengan stagger
    tl.fromTo(
      [listItem1Ref.current, listItem2Ref.current],
      {
        x: -30,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: "back.out(1.5)",
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

  const handleContinueShopping = () => {
    const tl = gsap.timeline();
    tl.to(containerRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.6,
      ease: "power2.in",
    }).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full floating-particle opacity-60"
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
          {/* Success Icon */}
          <div ref={successIconRef} className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping dark:bg-green-900"></div>
              <CheckCircle className="relative z-10 w-24 h-24 text-green-500" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1
              ref={titleRef}
              className="mb-4 text-3xl font-bold text-gray-900 dark:text-white"
            >
              Pembayaran Berhasil!
            </h1>

            <p
              ref={messageRef}
              className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
            >
              Selamat! Membership Anda telah berhasil diaktifkan. Pembayaran
              Anda sudah kami konfirmasi dan akun Anda kini memiliki status{" "}
              <strong className="text-green-600 dark:text-green-400">
                Member Aktif
              </strong>
              . Dengan membership aktif, Anda mendapatkan akses ke:
            </p>

            <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-300">
              <li
                ref={listItem1Ref}
                className="flex items-center justify-center gap-2 p-3 transition-all duration-300 rounded-lg bg-green-50 dark:bg-green-900/20 hover:scale-105"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Fitur premium tanpa batas</span>
              </li>
              <li
                ref={listItem2Ref}
                className="flex items-center justify-center gap-2 p-3 transition-all duration-300 rounded-lg bg-green-50 dark:bg-green-900/20 hover:scale-105"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Bebas Iklan</span>
              </li>
            </ul>

            <p
              ref={finalMessageRef}
              className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
            >
              Jika Anda tidak melihat perubahan pada akun, silakan refresh
              halaman atau login ulang untuk memuat pembaruan terbaru.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button
                ref={buttonRef}
                onClick={handleContinueShopping}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-primary-500 hover:bg-primary-600 hover:shadow-lg hover:scale-105 active:scale-95"
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

export default PaymentSuccessPage;
