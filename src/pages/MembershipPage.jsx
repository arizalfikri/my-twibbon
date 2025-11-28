import React, { useEffect, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import NoWatermark from "../assets/vidios/Vidio_Remove_Watermark2.mp4";
import NoAds from "../assets/vidios/pricing-no-ads.mp4";
import Analytics from "../assets/vidios/pricing-Analytics.mp4";
import Footer from "../components/layoutpage/Footer";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import { useGET, usePOST, usePATCH } from "../services/api";
import { useGlobalStore } from "../helper/store/global.store";
import { useModalStore } from "../helper/store/modal.store";
import ModalLogin from "../components/modal/modalLogin";
import LoadingPage from "../components/layoutpage/LoadingPage";
import { useTranslation } from "react-i18next";
import ModalPendingSubscription from "../components/modal/ModalPendingSubscription";
import MembershipCards from "../components/cards/MembershipCards";

export default function MembershipPage() {
  const { t } = useTranslation();
  const { data: plansContributor, isLoading } = useGET(
    "/plans?type=Contributor"
  );
  const { data: plansParticipant } = useGET("/plans?type=participant");

  const { refetch: refetchPayment } = useGET("/payment", {
    enabled: false,
  });
  const { data: subscriptionData, refetch: refetchSubscription } = useGET(
    "/detail-subscription",
    { enabled: false }
  );
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const CheckoutMutation = usePOST("/subscribe");
  const PatchSubscriptionMutation = usePATCH();
  const [isProcessing, setIsProcessing] = useState(false);

  const { token, role } = useGlobalStore();
  const { openToast } = useModalStore();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingSubscriptionData, setPendingSubscriptionData] = useState(null);
  const [isContinueLoading, setIsContinueLoading] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState({
    supporter: null,
    creator: null,
  });

  // State untuk menyimpan planType yang sedang diproses
  const [currentPlanType, setCurrentPlanType] = useState("supporter");

  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, easing: "ease-in-out" });
    AOS.refresh();
  }, []);

  const handleSubscribe = async (planType = "supporter") => {
    // Simpan planType yang sedang diproses
    setCurrentPlanType(planType);

    const selectedPlan = selectedPlans[planType];

    if (!selectedPlan) {
      openToast("toast", true, t("membership.please_select_plan"), "warning");
      return;
    }

    if (!token || role !== "user") {
      openToast("toast", true, t("membership.login_warning"), "warning");
      setShowLoginModal(true);
      return;
    }

    const { data: newSubscription } = await refetchSubscription();
    const { data: newPayment } = await refetchPayment();

    // Cek subscription berdasarkan type
    const subscriptionType =
      planType === "supporter" ? "participant" : "contributor";
    const userSubscriptions = newSubscription?.data || [];

    // Cari subscription aktif berdasarkan type
    const activeSubscription = userSubscriptions.find(
      (sub) =>
        sub.status === "ACTIVE" &&
        sub.plan?.type?.toLowerCase() === subscriptionType
    );

    // Cari subscription pending berdasarkan type
    const pendingSubscription = userSubscriptions.find(
      (sub) =>
        sub.status === "PENDING" &&
        sub.plan?.type?.toLowerCase() === subscriptionType
    );

    const paymentStatus = newPayment?.data?.payment?.status;
    const paymentPlanId = newPayment?.data?.subscription?.plan_id;

    // Jika sudah ada subscription aktif dengan type yang sama
    if (activeSubscription) {
      openToast("toast", true, t("membership.active_subscription"), "info");
      return;
    }

    // Jika ada subscription pending dengan type yang sama
    if (pendingSubscription) {
      if (paymentPlanId === selectedPlan.id) {
        openToast(
          "toast",
          true,
          t("membership.processing_subscription"),
          "warning"
        );
        // navigate to checkout with the correct type
        const payloadType = planType === "supporter" ? "participant" : "contributor";
        navigate(`/checkout?type=${payloadType}`);
      } else {
        setPendingSubscriptionData({
          subscription: newPayment?.data?.payment?.subscription,
          payment: newPayment?.data?.payment,
          selectedPlan,
          planType,
        });
        setShowPendingModal(true);
      }
      return;
    }

    // Boleh subscribe jika:
    // 1. Belum ada subscription dengan type yang sama, atau
    // 2. Ingin subscribe ke type yang berbeda (supporter bisa punya creator, dan sebaliknya)

    if (paymentStatus === "waiting_verification") {
      openToast("toast", true, t("membership.waiting_verification"), "warning");
      return;
    }

    setIsProcessing(true);
    try {
      // Tentukan type payload berdasarkan planType
      const payloadType =
        planType === "supporter" ? "participant" : "contributor";

      const res = await CheckoutMutation.mutateAsync({
        url: "/subscribe",
        data: {
          plan_id: selectedPlan.id.toString(),
          type: payloadType, // Tambahkan type di payload
        },
      });

      if (res.status === 201 || res.status === 200) {
        openToast(
          "toast",
          true,
          t("membership.redirecting_checkout"),
          "success"
        );
        await Promise.all([refetchPayment(), refetchSubscription()]);
        // Navigate to checkout and include type so checkout loads correct flow
        navigate(`/checkout?type=${payloadType}`);
      }
    } catch (error) {
      console.error("Subscription failed:", error);

      if (error?.response?.status === 403) {
        openToast("toast", true, t("membership.login_warning"), "warning");
        setShowLoginModal(true);
        localStorage.removeItem("token");
        return;
      }

      openToast("toast", true, t("membership.subscribe_failed"), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Update handleSelectPlan untuk menerima planType
  const handleSelectPlan = (plan, planType) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [planType]: plan,
    }));
  };

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    // Gunakan currentPlanType yang sudah disimpan
    await handleSubscribe(currentPlanType);
  };

  const handleCancelSubscription = async () => {
    const planId = pendingSubscriptionData?.subscription?.plan?.id;
    setShowPendingModal(false);

    if (!planId) {
      console.error("Plan ID for pending subscription not found");
      return;
    }
    try {
      await PatchSubscriptionMutation.mutateAsync({
        url: `/cancel-subscription`,
        data: { plan_id: planId.toString() },
      });
      openToast(
        "toast",
        true,
        t("membership.subscription_cancelled"),
        "success"
      );
      setShowPendingModal(false);
      setPendingSubscriptionData(null);
      await refetchPayment();
    } catch (error) {
      console.error("Cancel subscription error:", error);
      openToast("toast", true, t("membership.cancel_failed"), "error");
    }
  };

  const handleContinueSubscription = async () => {
    // Keep modal open, show loading, refresh payment then navigate
    setIsContinueLoading(true);
    try {
      await refetchPayment();

      const planType = pendingSubscriptionData?.planType || pendingSubscriptionData?.planType;
      const payloadType = planType === "supporter" ? "participant" : "contributor";

      setShowPendingModal(false);
      setPendingSubscriptionData(null);
      navigate(`/checkout?type=${payloadType}`);
    } catch (err) {
      console.error("Continue subscription error:", err);
    } finally {
      setIsContinueLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  // Videos object for PricingCard
  const videos = {
    noWatermark: NoWatermark,
    noAds: NoAds,
    analytics: Analytics,
  };

  return (
    <>
      <Navbar />

      <main className="relative flex flex-col items-center min-h-screen bg-gray-900">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full top-1/4 -left-40 w-[500px] h-[500px] bg-blue-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute rounded-full bottom-1/4 -right-40 w-[500px] h-[500px] bg-orange-500/20 blur-3xl animate-pulse [animation-delay:1000ms]"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full top-1/2 left-1/4 bg-green-500/15 blur-3xl animate-pulse [animation-delay:2000ms]"></div>
          <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-3xl animate-bounce [animation-duration:3s]"></div>
          <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl animate-bounce [animation-duration:4s] [animation-delay:500ms]"></div>
          <div className="absolute top-1/3 right-1/3 w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse [animation-delay:1500ms]"></div>
          <div className="absolute top-20 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-2xl animate-spin [animation-duration:20s]"></div>
          <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full blur-2xl animate-spin [animation-duration:25s]"></div>
          <div className="absolute w-16 h-16 rounded-full top-1/3 left-1/4 bg-blue-400/30 blur-xl animate-ping"></div>
          <div className="absolute top-2/3 right-1/3 w-20 h-20 bg-orange-400/30 rounded-full blur-xl animate-ping [animation-delay:1s]"></div>
          <div className="absolute top-1/2 left-2/3 w-16 h-16 bg-purple-400/30 rounded-full blur-xl animate-ping [animation-delay:2s]"></div>
          <div className="absolute bottom-1/3 left-1/2 w-14 h-14 bg-green-400/30 rounded-full blur-xl animate-ping [animation-delay:3s]"></div>
          <div className="absolute top-1/4 right-1/2 w-16 h-16 bg-yellow-400/30 rounded-full blur-xl animate-ping [animation-delay:1.5s]"></div>
          <div className="absolute w-8 h-8 rounded-full top-40 left-20 bg-blue-300/40 blur-md animate-pulse"></div>
          <div className="absolute top-60 right-40 w-10 h-10 bg-purple-300/40 rounded-full blur-md animate-pulse [animation-delay:500ms]"></div>
          <div className="absolute bottom-40 left-40 w-8 h-8 bg-orange-300/40 rounded-full blur-md animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-60 right-20 w-10 h-10 bg-green-300/40 rounded-full blur-md animate-pulse [animation-delay:1.5s]"></div>
          <div className="absolute top-3/4 left-3/4 w-12 h-12 bg-pink-300/40 rounded-full blur-md animate-pulse [animation-delay:2s]"></div>
          <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-cyan-300/40 rounded-full blur-md animate-pulse [animation-delay:2.5s]"></div>
        </div>

        {/* Hero */}
        <section
          className="container flex flex-col items-center px-4 mb-10 text-center text-white font-outfit"
          data-aos="fade-up"
        >
          <span className="mt-16 text-lg">{t("membership.pricing")}</span>

          <span className="font-bold md:text-[72px] text-[32px] leading-none mx-5 whitespace-pre-line capitalize">
            {t("membership.title")}
          </span>
        </section>

        {/* Cards Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-6 px-4 mb-8 lg:flex-row lg:items-start lg:justify-center lg:gap-8 sm:px-6">
            {/* Supporter Card */}
            <MembershipCards
              type="supporter"
              selectedPlan={selectedPlans.supporter}
              plans={plansParticipant?.data}
              onSelectPlan={(plan) => handleSelectPlan(plan, "supporter")}
              onSubscribe={() => handleSubscribe("supporter")}
              isProcessing={isProcessing}
              videos={videos}
            />

            {/* Creator Card */}
            <MembershipCards
              type="creator"
              selectedPlan={selectedPlans.creator}
              plans={plansContributor?.data}
              onSelectPlan={(plan) => handleSelectPlan(plan, "creator")}
              onSubscribe={() => handleSubscribe("creator")}
              isProcessing={isProcessing}
              videos={videos}
            />
          </div>
        </div>
      </main>

      <Footer />

      {showLoginModal && (
        <ModalLogin
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showPendingModal && (
        <ModalPendingSubscription
          visible={showPendingModal}
          onClose={() => {
            setShowPendingModal(false);
            setPendingSubscriptionData(null);
          }}
          onCancel={handleCancelSubscription}
          onContinue={handleContinueSubscription}
          isProcessing={isContinueLoading}
          subscriptionData={pendingSubscriptionData}
        />
      )}
    </>
  );
}
