import React, { useEffect, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import NoWatermark from "../assets/vidios/Vidio_Remove_Watermark.mp4";
import Footer from "../components/layoutpage/Footer";
import AOS from "aos";
import { Link } from "react-router-dom";

export default function MembershipPage() {
  const [plan, setPlan] = useState("6months");

  // data plan
  const plans = {
    monthly: { oldPrice: "Rp16.000", price: "Rp 10.000", label: "per Month" },
    "6months": { oldPrice: "Rp96.000", price: "Rp 35.000", label: "per 6 Months" },
    annual: { oldPrice: "Rp192.000", price: "Rp 60.000", label: "per Year" },
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center min-h-screen overflow-x-hidden bg-gray-900 ">
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

        <div className="w-screen md:w-[450px] bg-white dark:bg-gradient-to-b dark:from-[#1a2734] dark:to-[#0d1217] md:dark:shadow-white dark:border-0 md:rounded-3xl shadow-md text-gray-900 dark:text-white overflow-hidden m-8 z-30">
          {/* Card */}
          <div className="bg-gradient-to-br from-[#11cefe] to-[#7ecd67] text-white">
            <div className="p-6 text-center">
              <p className="text-xs tracking-widest uppercase opacity-90">
                Premium
              </p>
              <h2 className="mt-1 text-3xl font-bold">Supporter</h2>
              <p className="mt-1 text-sm opacity-90">
                For people who want more out of Twibbonize
              </p>
            </div>

            {/* Toggle plan */}
            <div className="flex justify-center gap-2 pb-4">
              {["Monthly", "6 Months", "Annual"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPlan(item.toLowerCase().replace(" ", ""))}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    plan === item.toLowerCase().replace(" ", "")
                      ? "bg-white text-black shadow"
                      : "bg-black/30 text-white hover:bg-black/50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="py-6 text-center bg-white dark:bg-[#0f171f]">
              <p className="text-sm text-gray-500 line-through">
                {plans[plan].oldPrice}
              </p>
              <p className="text-4xl font-bold text-black dark:text-white">
                {plans[plan].price}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plans[plan].label}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="px-6 py-6 space-y-4">
            <div className="flex flex-col items-center p-4 text-center bg-gray-100 shadow-sm dark:bg-black/40 rounded-xl">
              <video
                src={NoWatermark}
                className="mb-3 rounded-lg shadow-md"
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

            <div className="flex flex-col items-center p-4 text-center bg-gray-100 shadow-sm dark:bg-black/40 rounded-xl">
              <p className="text-3xl">😔</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No Extra Features available
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 space-y-3 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/checkout"
              className="block w-full py-3 font-semibold text-center text-white transition bg-black rounded-full hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Upgrade →
            </Link>
            <button className="w-full py-3 text-gray-700 transition border border-gray-300 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800">
              Learn More
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
