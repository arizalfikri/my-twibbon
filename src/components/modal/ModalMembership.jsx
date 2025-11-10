import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "../../helper/store/global.store";
import { useNavigate } from "react-router-dom";
import { useGET, usePOST, usePATCH } from "../../services/api";
import { useModalStore } from "../../helper/store/modal.store";
import ModalLogin from "./modalLogin";
import ModalAlert from "../../layout/ModalAlert";
import ModalPendingSubscription from "./ModalPendingSubscription";
import { X, Crown, Download, Zap } from "lucide-react";

const ModalMembership = ({ isOpen, onClose, onDownloadWatermark }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, role } = useGlobalStore();
  const { openToast } = useModalStore();
  const CheckoutMutation = usePOST("/subscribe");
  const CancelSubscriptionMutation = usePATCH();

  // API
  const { data: plansData, isLoading } = useGET("/plans", { enabled: isOpen });
  const { data: dataSubscription, refetch: refetchSubscription } = useGET(
    "/subscription",
    { enabled: isOpen }
  );
  const { data: dataPayment, refetch: refetchPayment } = useGET("/payment", {
    enabled: isOpen,
  });

  const plans = plansData?.data || [];
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingSubscriptionData, setPendingSubscriptionData] = useState(null);

  useEffect(() => {
    if (dataSubscription?.data?.status === "expired") {
      openToast("toast", true, "Langganan kamu sudah berakhir", "info");
    }
  }, [dataSubscription, openToast]);

  const handleSubscribe = async (planId) => {
    if (!token || role !== "participant") {
      openToast("toast", true, "Login Peserta Terlebih dahulu", "warning");
      setSelectedPlanId(planId);
      setShowLoginModal(true);
      return;
    }

    const { data: newSubscription } = await refetchSubscription();
    const { data: newPayment } = await refetchPayment();

    const paymentStatus = newPayment?.data?.status;
    const paymentPlanId = newPayment?.data?.subscription?.plan_id;
    const subscriptionStatus = newSubscription?.data?.status;

    if (subscriptionStatus === "ACTIVE") {
      openToast("toast", true, "Kamu sudah memiliki langganan aktif", "info");
      return;
    }

    // --- Handle Pending Subscription ---
    if (paymentStatus === "PENDING") {
      setPendingSubscriptionData({
        subscription: newPayment?.data?.subscription,
        payment: newPayment?.data,
        selectedPlan: plans.find((p) => p.id === planId),
      });
      setShowPendingModal(true);
      return;
    }

    if (paymentStatus === "waiting_verification") {
      openToast(
        "toast",
        true,
        "Pembayaranmu sedang menunggu verifikasi",
        "warning"
      );
      return;
    }

    // --- Normal Subscribe Flow ---
    setIsProcessing(true);
    try {
      const res = await CheckoutMutation.mutateAsync({
        url: "/subscribe",
        data: { plan_id: planId.toString() },
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
    if (selectedPlanId) {
      await handleSubscribe(selectedPlanId);
    }
  };

  const handleCancelSubscription = async () => {
    if (!pendingSubscriptionData?.subscription?.id) return;
    try {
      await CancelSubscriptionMutation.mutateAsync({
        url: `/cancel-subscription`,
      });
      openToast("toast", true, "Langganan dibatalkan", "success");
      setShowPendingModal(false);
      setPendingSubscriptionData(null);
      await refetchPayment();
    } catch (error) {
      console.error("Cancel subscription error:", error);
      openToast("toast", true, "Gagal membatalkan langganan", "error");
    }
  };

  const handleContinueSubscription = () => {
    setShowPendingModal(false);
    setPendingSubscriptionData(null);
    navigate("/checkout");
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const getPlanIcon = (name) => {
    switch (name.toLowerCase()) {
      case "daily":
        return <Zap size={20} className="text-yellow-500" />;
      case "mount":
      case "monthly":
        return <Crown size={20} className="text-primary-300" />;
      default:
        return <Crown size={20} className="text-blue-400" />;
    }
  };

  const getPlanColor = (name) => {
    switch (name.toLowerCase()) {
      case "daily":
        return "from-yellow-400 to-orange-500";
      case "mount":
      case "monthly":
        return "from-primary-300 to-primary-400";
      default:
        return "from-blue-400 to-blue-500";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalAlert onClose={onClose}>
        <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white rounded-md shadow-2xl md:w-96 dark:bg-gray-900">
          {/* Header */}
          <div className="relative px-8 py-6 bg-gradient-to-r from-primary-400 to-primary-500">
            <button
              onClick={onClose}
              className="absolute p-2 text-white transition-colors rounded-full top-5 right-3 hover:text-primary-200 hover:bg-white/10"
            >
              <X size={20} />
            </button>

            <div className="px-2 text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <Crown size={24} className="mr-2" />
                <h2 className="text-2xl font-bold">
                  {t("membership.remove_watermark", "Remove Watermark")}
                </h2>
              </div>
              <p className="text-sm opacity-90">
                {t("membership.choose_plan", "Choose your preferred plan")}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 rounded-full border-primary-600 border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="pr-2 space-y-3 overflow-y-auto max-h-72 ">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isProcessing}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 ${
                        isProcessing
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-primary-400 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getPlanIcon(plan.name)}
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-800 capitalize dark:text-gray-200">
                              {plan.name === "mount" ? "Monthly" : plan.name}{" "}
                              Plan
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {plan.duration_days}{" "}
                              {plan.duration_days === 1 ? "day" : "days"} access
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold bg-gradient-to-r ${getPlanColor(
                              plan.name
                            )} bg-clip-text text-transparent`}
                          >
                            {formatPrice(plan.price)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {plan.duration_days === 1
                              ? "per day"
                              : `for ${plan.duration_days} days`}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">
                        {t("membership.or", "or")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Download */}
                <button
                  onClick={() => {
                    onDownloadWatermark();
                    onClose();
                  }}
                  className="w-full p-4 text-gray-700 transition-all duration-200 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Download size={20} className="text-gray-500" />
                    <div className="text-center">
                      <div className="font-medium">
                        {t("membership.free_download", "Download Free")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("membership.with_watermark", "with watermark")}
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onClose}
                  className="w-full mt-4 text-sm text-center text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {t("common.cancel", "Cancel")}
                </button>
              </div>
            )}
          </div>
        </div>
      </ModalAlert>

      {/* Modal Login */}
      {showLoginModal && (
        <ModalLogin
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            setSelectedPlanId(null);
            setIsProcessing(false);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Modal Pending Subscription */}
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
};

export default ModalMembership;
