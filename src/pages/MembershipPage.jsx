import React, { useEffect, useState } from "react";
import Navbar from "../components/layoutpage/Navbar";
import NoWatermark from "../assets/vidios/Vidio_Remove_Watermark2.mp4";
import Footer from "../components/layoutpage/Footer";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import { useGET, usePOST, useDELETE, usePATCH } from "../services/api";
import { useGlobalStore } from "../helper/store/global.store";
import { useModalStore } from "../helper/store/modal.store";
import ModalLogin from "../components/modal/modalLogin";
import LoadingPage from "../components/layoutpage/LoadingPage";
import { useTranslation } from "react-i18next";
import ModalPendingSubscription from "../components/modal/ModalPendingSubscription";

export default function MembershipPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGET("/plans");
  const { refetch: refetchPayment } = useGET("/payment");
  const { data: subscriptionData, refetch: refetchSubscription } =
    useGET("/subscription");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const CheckoutMutation = usePOST("/subscribe");
  const DeleteSubscriptionMutation = usePATCH();
  const [isProcessing, setIsProcessing] = useState(false);

  const { token, role } = useGlobalStore();
  const { openToast } = useModalStore();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingSubscriptionData, setPendingSubscriptionData] = useState(null);

  useEffect(() => {
    if (data?.data?.length > 0 && !selectedPlan) {
      setSelectedPlan(data.data[0]);
    }
  }, [data, selectedPlan]);

  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, easing: "ease-in-out" });
    AOS.refresh();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    if (!token || role !== "participant") {
      openToast("toast", true, t("membership.login_warning"), "warning");
      setShowLoginModal(true);
      return;
    }

    const { data: newSubscription } = await refetchSubscription();
    const { data: newPayment } = await refetchPayment();

    const paymentStatus = newPayment?.data?.status;
    const paymentPlanId = newPayment?.data?.subscription?.plan_id;
    const subscriptionStatus = newSubscription?.data?.status;
    if (subscriptionStatus === "ACTIVE") {
      openToast("toast", true, t("membership.active_subscription"), "info");
      return;
    }

    if (paymentStatus === "PENDING") {
      setPendingSubscriptionData({
        subscription: newPayment?.data?.subscription,
        payment: newPayment?.data,
        selectedPlan: selectedPlan,
      });
      setShowPendingModal(true);
      return;
    }

    if (paymentStatus === "PENDING") {
      if (paymentPlanId === selectedPlan.id) {
        openToast(
          "toast",
          true,
          t("membership.processing_subscription"),
          "warning"
        );
        navigate("/checkout");
        return;
      } else {
        setIsProcessing(true);
        try {
          const res = await CheckoutMutation.mutateAsync({
            url: "/subscribe",
            data: { plan_id: selectedPlan.id.toString() },
          });

          if (res.status === 201 || res.status === 200) {
            openToast(
              "toast",
              true,
              t("membership.redirecting_checkout"),
              "success"
            );
            navigate("/checkout");
          }
        } catch (error) {
          console.error("Subscription failed:", error);
          openToast("toast", true, t("membership.subscribe_failed"), "error");
        } finally {
          setIsProcessing(false);
        }
        return;
      }
    }

    if (paymentStatus === "waiting_verification") {
      openToast("toast", true, t("membership.waiting_verification"), "warning");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await CheckoutMutation.mutateAsync({
        url: "/subscribe",
        data: { plan_id: selectedPlan.id.toString() },
      });

      if (res.status === 201 || res.status === 200) {
        openToast(
          "toast",
          true,
          t("membership.redirecting_checkout"),
          "success"
        );
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      openToast("toast", true, t("membership.subscribe_failed"), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    await handleSubscribe();
  };

  const handleCancelSubscription = async () => {
    if (!pendingSubscriptionData?.subscription?.id) return;
    try {
      await DeleteSubscriptionMutation.mutateAsync({
        url: `/cancel-subscription`,
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

  const handleContinueSubscription = () => {
    setShowPendingModal(false);
    setPendingSubscriptionData(null);
    navigate("/checkout");
  };

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center min-h-screen overflow-x-hidden bg-gray-900 ">
        {/* Hero */}
        <section
          className="flex flex-col items-center max-w-2xl mb-1 text-center text-white"
          data-aos="fade-up"
        >
          <span className="mt-16 text-sm">{t("membership.pricing")}</span>
          <span className="font-bold md:text-[72px] text-[32px] leading-none mx-5">
            {t("membership.title")}
          </span>
        </section>

        {/* Card */}
        <div className="w-screen md:w-[450px] bg-white dark:bg-gradient-to-b dark:from-[#1a2734] dark:to-[#0d1217] md:dark:shadow-white dark:border-0 md:rounded-3xl shadow-md text-gray-900 dark:text-white overflow-hidden m-8 z-30">
          <div className="bg-gradient-to-br from-[#11cefe] to-[#7ecd67] text-white">
            <div className="p-6 text-center">
              <p className="text-xs tracking-widest uppercase opacity-90">
                {t("membership.plan_premium")}
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {t("membership.plan_supporter")}
              </h2>
              <p className="mt-1 text-sm opacity-90">{t("membership.desc")}</p>
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
                  {t("membership.for_days", {
                    days: selectedPlan.duration_days,
                  })}
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
              <p className="font-semibold">
                {t("membership.remove_watermark")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("membership.on_your_account")}
              </p>
            </div>

            <div className="flex flex-col items-center p-4 text-center bg-gray-100 shadow-sm dark:bg-black/40 rounded-xl">
              <p className="text-3xl">😔</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("membership.no_extra_features")}
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
              {isProcessing
                ? t("membership.processing")
                : t("membership.upgrade_button")}
            </button>
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
          subscriptionData={pendingSubscriptionData}
        />
      )}
    </>
  );
}
