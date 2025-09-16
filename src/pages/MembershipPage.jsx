import React, { useEffect, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import NoWatermark from "../assets/vidios/Vidio_Remove_Watermark.mp4";
import Footer from "../components/layoutpage/Footer";
import AOS from "aos";
import { Link } from "react-router-dom";

export default function MembershipPage() {
  const [plan, setPlan] = useState("6months");
  useEffect(() => {
    AOS.init({
      duration: 800, // durasi animasi
      once: true, // hanya jalan sekali
    });
  }, []);
  return (
    <>
      {/* Navbar tetap di atas */}
      <Navbar />

      {/* Section Membership */}
      <main className="flex flex-col items-center min-h-screen bg-gray-900 ">
        <section
          className="flex flex-col items-center max-w-2xl mb-1 text-center text-white"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          <span className="mt-16 text-sm">PRICING</span>
          <span className="font-bold md:text-[72px] text-[32px] leading-none ">
            Find the right Premium plan for your need
          </span>
        </section>
        <div className=" w-[450px] bg-white dark:bg-gradient-to-b dark:from-[#1a2734] dark:to-[#0d1217] border border-gray-200 dark:border-0 rounded-3xl shadow-2xl text-gray-900 dark:text-white overflow-hidden dark:shadow-white dark:shadow-md dark:inset-shadow-lg m-16  z-30">
          {/* Header */}
          <div className="bg-gradient-to-br to-[#7ecd67] from-[#11cefe]">
            <div className="p-6 text-center">
              <p className="text-xs tracking-widest text-gray-800 uppercase">
                Premium
              </p>
              <h2 className="text-3xl font-bold">Supporter</h2>
              <p className="mt-1 text-sm text-gray-600">
                For people who want more out of Twibbonize
              </p>
            </div>

            {/* Plan Toggle */}
            <div className="flex justify-center gap-2 px-6">
              {["Monthly", "6 Months", "Annual"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPlan(item.toLowerCase().replace(" ", ""))}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    plan === item.toLowerCase().replace(" ", "")
                      ? "bg-black text-white"
                      : "bg-black text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="py-6 text-center">
              <p className="text-sm text-gray-800 line-through">Rp96.000</p>
              <p className="text-4xl font-bold">Rp 35.000</p>
              <p className="text-sm text-gray-600 ">per 6 Months</p>
            </div>
          </div>

          {/* Features */}
          <div className="px-6 space-y-4">
            <div className="flex flex-col items-center p-4 text-center bg-gray-100 dark:bg-black/40 rounded-xl">
              <video
                src={NoWatermark}
                className="mb-3 rounded-lg"
                autoPlay
                muted
                loop
                playsInline
              />
              <p className="font-semibold">Remove Watermark</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                on your own account
              </p>
            </div>

            <div className="flex flex-col items-center p-4 text-center bg-gray-100 dark:bg-black/40 rounded-xl">
              <p className="text-3xl">😔</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No Extra Features available
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 space-y-3">
            <Link
              to="/checkout"
              className="block w-full py-2 font-semibold text-center text-white transition bg-black rounded-full hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Upgrade →
            </Link>
            <button className="w-full py-2 text-gray-700 transition border border-gray-300 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800">
              Learn More
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
