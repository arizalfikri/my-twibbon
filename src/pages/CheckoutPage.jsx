import React, { useState, useEffect } from "react";
import Navbar from "../components/layoutpage/Navbar";
import { useGET, usePOST, usePATCH } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useModalStore } from "../helper/store/modal.store";
import LoadingPage from "../components/layoutpage/LoadingPage";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CircleCheckBig } from "lucide-react";

// Modal Konfirmasi Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  detail,
  selectedMethod,
  selectedBank,
  totalWithFee,
  feeAmount,
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-xl dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {t("checkout.confirm_payment_title") || "Konfirmasi Pembayaran"}
        </h3>

        <div className="mb-6 space-y-3">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {t("checkout.payment_method") || "Metode Pembayaran"}:
            </p>
            <div className="flex items-center gap-2">
              {selectedMethod?.logo && (
                <img
                  src={selectedMethod.logo}
                  alt={selectedMethod.method}
                  className="object-contain w-8 h-8"
                />
              )}
              <span className="font-medium capitalize">
                {selectedMethod?.method.replace(/_/g, " ")}
              </span>
            </div>
            {selectedBank && (
              <div className="flex items-center gap-2 mt-2">
                {selectedBank.logo && (
                  <img
                    src={selectedBank.logo}
                    alt={selectedBank.name}
                    className="object-contain w-6 h-6"
                  />
                )}
                <span className="text-sm">{selectedBank.name}</span>
              </div>
            )}
          </div>

          <div className="p-4 space-y-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {t("checkout.price")}:
              </span>
              <span className="font-medium">
                Rp{(detail?.amount ?? 0).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {t("checkout.admin_fee")}:
              </span>
              <span className="font-medium">
                Rp{feeAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between">
                <span className="font-semibold">{t("checkout.total")}:</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  Rp{totalWithFee.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          {t("checkout.confirm_payment_message") ||
            "Apakah Anda yakin ingin melanjutkan pembayaran dengan metode ini?"}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {t("checkout.cancel") || "Batal"}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
          >
            {t("checkout.confirm") || "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal to choose subscription type when /checkout opened without ?type=
function TypeChoiceModal({ visible, onClose, onChoose }) {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-xl dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {t("checkout.choose_type_title") || "Pilih Tipe Langganan"}
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {t("checkout.choose_type_message") ||
            "Pilih tipe langganan untuk melanjutkan pembayaran:"}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => onChoose("participant")}
            className="flex-1 px-4 py-2 font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600"
          >
            {t("membership.supporter") || "Supporter / Participant"}
          </button>
          <button
            onClick={() => onChoose("contributor")}
            className="flex-1 px-4 py-2 font-medium border rounded-lg text-primary-600 border-primary-500 hover:bg-primary-50"
          >
            {t("membership.creator") || "Creator / Contributor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const queryType = new URLSearchParams(location.search).get("type");
  const [selectedType, setSelectedType] = useState(queryType || null);

  useEffect(() => {
    setSelectedType(new URLSearchParams(location.search).get("type"));
  }, [location.search]);

  const [showTypeModal, setShowTypeModal] = useState(!queryType);

  useEffect(() => {
    const hasType = !!new URLSearchParams(location.search).get("type");
    setShowTypeModal(!hasType);
  }, [location.search]);

  const navigate = useNavigate();

  // Fetch payment data untuk kedua tipe saat modal type choice terbuka
  const {
    data: paymentParticipantData,
    isLoading: isLoadingParticipant,
    error: errorParticipant,
  } = useGET("/payment?type=participant", {
    enabled: showTypeModal,
  });

  const {
    data: paymentContributorData,
    isLoading: isLoadingContributor,
    error: errorContributor,
  } = useGET("/payment?type=contributor", {
    enabled: showTypeModal,
  });

  // Auto redirect logic berdasarkan hasil payment API
  useEffect(() => {
    if (!showTypeModal) return;

    // Tunggu sampai kedua request selesai
    if (isLoadingParticipant || isLoadingContributor) return;

    const participantExists =
      !errorParticipant && paymentParticipantData?.data?.payment;
    const contributorExists =
      !errorContributor && paymentContributorData?.data?.payment;

    // Jika kedua tipe tidak ada (404), redirect ke membership
    if (!participantExists && !contributorExists) {
      navigate("/membership");
      return;
    }

    // Jika hanya satu tipe yang ada, auto redirect ke tipe tersebut
    if (participantExists && !contributorExists) {
      handleChooseType("participant");
    } else if (!participantExists && contributorExists) {
      handleChooseType("contributor");
    }
    // Jika kedua tipe ada, biarkan modal terbuka untuk user memilih
  }, [
    showTypeModal,
    paymentParticipantData,
    paymentContributorData,
    isLoadingParticipant,
    isLoadingContributor,
    errorParticipant,
    errorContributor,
    navigate,
  ]);

  // Fetch payment data berdasarkan tipe yang dipilih
  const {
    data: payment,
    isLoading,
    error: paymentError,
    refetch,
  } = useGET(selectedType ? `/payment?type=${selectedType}` : "/payment", {
    enabled: !!selectedType,
    staleTime: 30000,
    cacheTime: 60000,
  });

  // Handle 404 error untuk payment yang dipilih
  useEffect(() => {
    if (selectedType && paymentError?.response?.status === 404) {
      navigate("/membership");
    }
  }, [paymentError, selectedType, navigate]);

  const createInvoice = usePOST();
  const cancelPayment = usePATCH();
  const { openToast } = useModalStore();

  const handleCreateInvoice = async () => {
    setShowModal(true);
  };

  const handleChooseType = (type) => {
    // Close modal dan navigate ke halaman yang sama dengan type param
    setShowTypeModal(false);
    setSelectedType(type);
    navigate(`/checkout?type=${type}`);
  };

  const handleConfirmPayment = async () => {
    setShowModal(false);

    try {
      if (!selectedMethod) {
        openToast({
          message: "Silakan pilih metode pembayaran terlebih dahulu",
          type: "error",
        });
        return;
      }

      const totalAmountWithFee = calculateTotalWithFee();

      let channelCode = null;

      if (selectedMethod.method === "QRIS") {
        channelCode = selectedMethod.channel_code;
      } else if (selectedBank) {
        channelCode = selectedBank?.channel_code || selectedBank?.code;
      }

      const payload = {
        payment_id: detail?.id,
        amount: totalAmountWithFee,
        method: selectedMethod.method,
        channel_code: channelCode,
      };

      const response = await createInvoice.mutateAsync({
        url: `/create-payment`,
        data: payload,
      });

      const referenceId = response.data?.reference_id || response.data?.id;
      const deeplink = response.data?.actions?.[0]?.value;

      if (deeplink) {
        localStorage.setItem("payment_deeplink", deeplink);
      }
      if (response?.data?.invoice_url) {
        window.open(response.data.invoice_url, "_blank");
      }

      if (referenceId) {
        const method = selectedMethod.method.toLowerCase();

        if (method.includes("virtual_account") || method.includes("va")) {
          navigate(`/checkout/va/${referenceId}`);
        } else if (method.includes("ewallet") || method.includes("e-wallet")) {
          navigate(`/checkout/ewallet/${referenceId}`);
        } else if (method.includes("qris") || method.includes("qr")) {
          navigate(`/checkout/qris/${referenceId}`);
        } else {
          navigate(`/checkout/payment/${referenceId}`);
        }
      } else {
        refetch();
      }
    } catch (error) {
      console.error("Create invoice error:", error);
      openToast({ message: t("checkout.invoice_fail"), type: "error" });
    }
  };

  const handleCancel = async () => {
    try {
      const planId = detail?.subscription?.plan?.id;

      await cancelPayment.mutateAsync({
        url: `/cancel-subscription`,
        data: {
          plan_id: planId,
        },
      });

      openToast({
        message: t("checkout.cancel_success"),
        type: "success",
      });

      navigate("/membership");
    } catch (error) {
      console.error("Cancel error:", error);
      openToast({ message: t("checkout.cancel_fail"), type: "error" });
    }
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setSelectedBank(null);

    if (expandedMethod !== method.method) {
      setExpandedMethod(method.method);
    }

    if (method.banks && method.banks.length === 1) {
      setSelectedBank(method.banks[0]);
    }
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
  };

  const toggleMethodExpand = (methodName, e) => {
    e.stopPropagation();

    if (expandedMethod === methodName) {
      setExpandedMethod(null);
    } else {
      setExpandedMethod(methodName);
    }
  };

  const calculateTotalWithFee = () => {
    const baseAmount = detail?.amount || 0;
    return baseAmount + calculateFeeAmount();
  };

  const calculateFeeAmount = () => {
    if (detail?.admin_fee || 0) {
      return detail.admin_fee || 0;
    }

    const baseAmount = detail?.amount || 0;

    if (selectedBank && selectedBank.fee && selectedMethod) {
      if (selectedMethod.type_fee === "percentage") {
        return Math.round((baseAmount * selectedBank.fee) / 100);
      }
      return selectedBank.fee;
    }

    if (selectedMethod && selectedMethod.fee) {
      if (selectedMethod.type_fee === "percentage") {
        return Math.round((baseAmount * selectedMethod.fee) / 100);
      }
      return selectedMethod.fee;
    }

    return 0;
  };

  const isPaymentMethodValid = () => {
    if (!selectedMethod) return false;

    if (selectedMethod.method === "QRIS") {
      return true;
    }

    if (selectedMethod.banks && selectedMethod.banks.length > 0) {
      return !!selectedBank;
    }

    return true;
  };

  const detail = payment?.data?.payment;
  const methods = payment?.data?.methods;

  // Tampilkan loading jika masih fetching data
  if (isLoading) return <LoadingPage />;

  // Jika payment error dan bukan 404 (karena 404 sudah dihandle redirect)
  if (paymentError && paymentError.response?.status !== 404) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="px-6 py-10 mx-auto max-w-screen-2xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="max-w-md p-8 text-center bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <h1 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
                Error
              </h1>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Terjadi kesalahan saat memuat data pembayaran.
              </p>
              <button
                onClick={() => navigate("/membership")}
                className="px-6 py-2 font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600"
              >
                Kembali ke Membership
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (detail?.status === "waiting_verification") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="px-6 py-10 mx-auto max-w-screen-2xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="max-w-md p-8 text-center bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <div className="flex items-center justify-center mb-4 text-6xl">
                <CircleCheckBig size={100} color="#02f72b" />
              </div>
              <h1 className="mb-4 text-2xl font-bold text-green-600 dark:text-green-400">
                {t("checkout.payment_success")}
              </h1>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {t("checkout.waiting_verification")}
              </p>
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t("checkout.verification_notice")}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="container py-10 mx-auto">
        <h1 className="mb-2 text-3xl font-bold">{t("checkout.title")}</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          {t("checkout.subtitle")}
        </p>

        {detail && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* LEFT CARD - ORDER SUMMARY */}
            <div className="lg:col-span-2">
              <div className="sticky p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl top-20">
                <h3 className="mb-4 text-lg font-semibold">
                  {t("checkout.detail_title")}
                </h3>

                <div className="p-4 mb-6 text-white shadow-md bg-gradient-to-br to-[#7ecd67] from-[#11cefe] rounded-lg">
                  <h2 className="mb-3 text-xl font-semibold">
                    {t("checkout.premium_title")}
                  </h2>
                  <ul className="space-y-2 text-sm">
                    <li>✅ {t("checkout.feature_remove_watermark")}</li>
                    <li>✅ {t("checkout.feature_no_ads")}</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="mb-4 font-medium text-gray-700 dark:text-gray-300">
                    {t("checkout.choose_payment")}
                  </h4>

                  {!selectedMethod && (
                    <div className="p-3 mb-4 text-sm text-yellow-700 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">
                      ⚠️{" "}
                      {t("checkout.please_select_payment") ||
                        "Silakan pilih metode pembayaran terlebih dahulu"}
                    </div>
                  )}

                  <div className="space-y-3">
                    {methods?.map((method) => (
                      <div key={method.method} className="space-y-2">
                        {/* Method Header */}
                        <div
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedMethod?.method === method.method
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                          }`}
                          onClick={() => handleMethodSelect(method)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {method.logo && (
                                <img
                                  src={method.logo}
                                  alt={method.method}
                                  className="object-contain w-8 h-8"
                                />
                              )}
                              <span className="font-medium capitalize">
                                {method.method.replace(/_/g, " ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedMethod?.method === method.method && (
                                <FaCheckCircle className="text-primary-500" />
                              )}
                              {method.banks && method.banks.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMethodSelect(method);
                                    toggleMethodExpand(method.method, e);
                                  }}
                                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                  {expandedMethod === method.method ? (
                                    <FaChevronUp size={12} />
                                  ) : (
                                    <FaChevronDown size={12} />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bank Options */}
                        {expandedMethod === method.method &&
                          method.banks &&
                          method.banks.length > 0 && (
                            <div className="ml-4 space-y-2">
                              {method.banks.map((bank) => (
                                <div
                                  key={bank.channel_code || bank.code}
                                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    selectedBank === bank
                                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                                  }`}
                                  onClick={() => handleBankSelect(bank)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {bank.logo && (
                                        <img
                                          src={bank.logo}
                                          alt={bank.name}
                                          className="object-contain w-6 h-6"
                                        />
                                      )}
                                      <span className="text-sm">
                                        {bank.name}
                                      </span>
                                    </div>
                                    {selectedBank === bank && (
                                      <FaCheckCircle
                                        className="text-primary-500"
                                        size={14}
                                      />
                                    )}
                                  </div>
                                  {bank.fee && (
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                      Biaya admin: {bank.fee}
                                      {method.type_fee === "percentage"
                                        ? "%"
                                        : ""}
                                      {method.type_fee === "percentage" &&
                                        bank.fee > 0 && (
                                          <span>
                                            {" "}
                                            (Rp
                                            {Math.round(
                                              (detail?.amount * bank.fee) / 100
                                            ).toLocaleString("id-ID")}
                                            )
                                          </span>
                                        )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CARD - PAYMENT DETAILS */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
                <h3 className="mb-6 text-xl font-semibold">
                  {t("checkout.payment_details")}
                </h3>

                <div className="py-4 space-y-3 border-gray-200 border-y dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("checkout.duration")}:
                    </span>
                    <span className="font-medium">
                      {detail?.subscription?.plan?.duration_days}{" "}
                      {t("checkout.days")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("checkout.price")}:
                    </span>
                    <span className="font-medium">
                      Rp{(detail?.amount ?? 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("checkout.admin_fee")}:
                    </span>
                    <span className="font-medium">
                      Rp{calculateFeeAmount().toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="p-4 mb-6 space-y-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {t("checkout.status")}:
                    </span>
                    <span className="px-3 py-1 text-sm font-medium text-yellow-800 capitalize bg-yellow-100 rounded-full dark:bg-yellow-900/30 dark:text-yellow-300">
                      {detail?.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {t("checkout.total")}:
                      </span>
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        Rp{calculateTotalWithFee().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCreateInvoice}
                    disabled={
                      createInvoice.isPending ||
                      cancelPayment.isPending ||
                      !isPaymentMethodValid()
                    }
                    className={`w-full py-3 font-medium text-white rounded-lg transition-colors ${
                      createInvoice.isPending ||
                      cancelPayment.isPending ||
                      !isPaymentMethodValid()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-500 hover:bg-primary-600"
                    }`}
                  >
                    {createInvoice.isPending
                      ? t("checkout.creating_invoice")
                      : t("checkout.create_invoice")}
                  </button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 text-gray-500 bg-white dark:bg-gray-800">
                        {t("checkout.or")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCancel}
                    disabled={
                      createInvoice.isPending || cancelPayment.isPending
                    }
                    className={`w-full py-3 font-medium rounded-lg transition-colors ${
                      createInvoice.isPending || cancelPayment.isPending
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    }`}
                  >
                    {cancelPayment.isPending
                      ? t("checkout.canceling")
                      : t("checkout.cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmPayment}
        detail={detail}
        selectedMethod={selectedMethod}
        selectedBank={selectedBank}
        totalWithFee={calculateTotalWithFee()}
        feeAmount={calculateFeeAmount()}
      />

      {/* Type choice modal (shows when no ?type= present) */}
      <TypeChoiceModal
        visible={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        onChoose={handleChooseType}
      />
    </div>
  );
}

export default CheckoutPage;
