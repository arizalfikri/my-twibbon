import React, { useState, useEffect } from "react";
import Navbar from "../components/layoutpage/Navbar";
import { useGET, usePOST, usePATCH } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../helper/store/modal.store";
import LoadingPage from "../components/layoutpage/LoadingPage";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import { CircleCheckBig } from "lucide-react";

function CheckoutPage() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const { data: payment, isLoading, refetch } = useGET("/payment");
  const createInvoice = usePOST();
  const cancelPayment = usePATCH();
  const navigate = useNavigate();
  const { openToast } = useModalStore();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isLoading && (!payment || !payment.data)) {
      openToast({
        message: t("checkout.no_payment"),
        type: "error",
      });
      navigate("/membership");
    }
  }, [isLoading, payment, navigate, openToast, t]);

  const handleCreateInvoice = async () => {
    try {
      const response = await createInvoice.mutateAsync({
        url: `/create-invoice`,
        data: { amount: detail?.total_amount },
      });
      if (response?.data?.invoice_url) {
        window.open(response.data.invoice_url, "_blank");
        refetch();
      }
    } catch (error) {
      console.error("Create invoice error:", error);
      openToast({ message: t("checkout.invoice_fail"), type: "error" });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelPayment.mutateAsync({
        url: `/cancel-subscription`,
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

  const detail = payment?.data;

  if (isLoading) return <LoadingPage />;

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
      <main className="max-w-screen-lg px-6 py-10 mx-auto">
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

                <div className="py-4 space-y-3 border-gray-200 border-y dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("checkout.duration")}:
                    </span>
                    <span className="font-medium">
                      {detail?.subscription?.plan?.duration_days} {t("checkout.days")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("checkout.price")}:
                    </span>
                    <span className="font-medium">
                      Rp{detail?.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("checkout.admin_fee")}:
                    </span>
                    <span className="font-medium">
                      Rp{detail?.admin_fee.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("checkout.total")}:</span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      Rp{detail?.total_amount.toLocaleString("id-ID")}
                    </span>
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

                <div className="p-4 mb-6 space-y-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {t("checkout.status")}:
                    </span>
                    <span className="px-3 py-1 text-sm font-medium text-yellow-800 capitalize bg-yellow-100 rounded-full dark:bg-yellow-900/30 dark:text-yellow-300">
                      {detail?.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {t("checkout.expired_at")}:
                    </span>
                    <span className="font-medium">
                      {new Date(detail?.expiredAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {detail?.invoice_url ? (
                    <button
                      onClick={() => window.open(detail.invoice_url, "_blank")}
                      className="w-full py-3 font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
                    >
                      {t("checkout.pay_now")}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCreateInvoice}
                        disabled={createInvoice.isPending}
                        className={`w-full py-3 font-medium text-white rounded-lg transition-colors ${
                          createInvoice.isPending
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
                    </>
                  )}

                  <button
                    onClick={handleCancel}
                    disabled={cancelPayment.isPending}
                    className={`w-full py-3 font-medium rounded-lg transition-colors ${
                      cancelPayment.isPending
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
    </div>
  );
}

export default CheckoutPage;