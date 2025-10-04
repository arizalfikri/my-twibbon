import React, { useEffect, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import NoWatermark from "../assets/vidios/Vidio_Remove_Watermark.mp4";
import Footer from "../components/layoutpage/Footer";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import { useGET, usePOST } from "../services/api";
import { useGlobalStore } from "../helper/store/global.store";
import { useModalStore } from "../helper/store/modal.store";
import ModalLogin from "../components/modal/modalLogin";
import LoadingPage from "../components/layoutpage/LoadingPage";

export default function MembershipPage() {
  const { data, isLoading } = useGET("/plans");
  const { data: dataSubscription, refetch: refetchSubscription } =
    useGET("/subscription");
  const { data: dataPayment, refetch: refetchPayment } = useGET("/payment");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const CheckoutMutation = usePOST("/subscribe");
  const [isProcessing, setIsProcessing] = useState(false);

  // ambil auth
  const { token, role } = useGlobalStore();
  const { openToast } = useModalStore();

  // modal login
  const [showLoginModal, setShowLoginModal] = useState(false);

  // default pilih plan pertama
  useEffect(() => {
    if (data?.data?.length > 0 && !selectedPlan) {
      setSelectedPlan(data.data[0]);
    }
  }, [data, selectedPlan]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      easing: "ease-in-out",
    });
    AOS.refresh();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    // cek login dulu
    if (!token || role !== "user") {
      openToast("toast", true, "Login Peserta Terlebih dahulu", "warning");
      setShowLoginModal(true);
      return;
    }

    // refetch data payment terbaru
    const { data: newPayment } = await refetchPayment();
    const paymentStatus = newPayment?.data?.status;
    const paymentPlanId = newPayment?.data?.subscription?.plan_id;

    if (paymentStatus === "active") {
      openToast("toast", true, "Kamu sudah memiliki langganan aktif", "info");
      return;
    }

    if (paymentStatus === "pending") {
      if (paymentPlanId === selectedPlan.id) {
        // plan sama → jangan post ulang, langsung redirect
        openToast("toast", true, "Langganan kamu sedang diproses", "warning");
        navigate("/checkout");
        return;
      } else {
        // plan beda → bikin subscribe baru
        setIsProcessing(true);
        try {
          const res = await CheckoutMutation.mutateAsync({
            url: "/subscribe",
            data: { plan_id: selectedPlan.id.toString() },
          });

          if (res.status === 201 || res.status === 200) {
            openToast("toast", true, "Redirecting to checkout...", "success");
            navigate("/checkout");
          }
        } catch (error) {
          console.error("Subscription failed:", error);
          openToast("toast", true, "Subscription failed", "error");
        } finally {
          setIsProcessing(false);
        }
        return;
      }
    }

    if (paymentStatus === "waiting_verification") {
      openToast(
        "toast",
        true,
        "Menunggu verifikasi pembayaran kamu",
        "warning"
      );
      return;
    }

    // kalau semua aman → bikin subscription baru
    setIsProcessing(true);
    try {
      const res = await CheckoutMutation.mutateAsync({
        url: "/subscribe",
        data: { plan_id: selectedPlan.id.toString() },
      });

      if (res.status === 201 || res.status === 200) {
        openToast("toast", true, "Redirecting to checkout...", "success");
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      openToast("toast", true, "Subscription failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);

    await handleSubscribe();
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center min-h-screen overflow-x-hidden bg-gray-900 ">
        {/* Hero */}
        <section
          className="flex flex-col items-center max-w-2xl mb-1 text-center text-white"
          data-aos="fade-up"
        >
          <span className="mt-16 text-sm">PRICING</span>
          <span className="font-bold md:text-[72px] text-[32px] leading-none mx-5">
            Find the right Premium plan for your need
          </span>
        </section>

        {/* Card */}
        <div className="w-screen md:w-[450px] bg-white dark:bg-gradient-to-b dark:from-[#1a2734] dark:to-[#0d1217] md:dark:shadow-white dark:border-0 md:rounded-3xl shadow-md text-gray-900 dark:text-white overflow-hidden m-8 z-30">
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
            <div className="flex flex-wrap justify-center gap-2 pb-4">
              {data?.data?.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    selectedPlan?.id === plan.id
                      ? "bg-white text-black shadow"
                      : "bg-black/30 text-white hover:bg-black/50"
                  }`}
                >
                  {plan.name} ({plan.duration_days}d)
                </button>
              ))}
            </div>

            {/* Price */}
            {selectedPlan && (
              <div className="py-6 text-center bg-white dark:bg-[#0f171f]">
                <p className="text-sm text-gray-500 line-through">
                  Rp{selectedPlan.price * 1.5}
                </p>
                <p className="text-4xl font-bold text-black dark:text-white">
                  Rp {selectedPlan.price.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  for {selectedPlan.duration_days} days
                </p>
              </div>
            )}
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
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="block w-full py-3 font-semibold text-center text-white transition bg-black rounded-full hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Upgrade →"}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal login muncul kalau belum login */}
      {showLoginModal && (
        <ModalLogin
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
