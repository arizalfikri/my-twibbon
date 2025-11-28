import React, { useState, useEffect } from "react";
import { useGET } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layoutpage/Navbar";
import LoadingPage from "../components/layoutpage/LoadingPage";
import { useTranslation } from "react-i18next";
import { Copy, CheckCircle, AlertCircle, Clock } from "lucide-react";

function VirtualAccountPage() {
  const { referer } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState(null);

  const { data, refetch, isLoading } = useGET(`/payment-status/${referer}`);
  const storedDeeplink = localStorage.getItem("payment_deeplink");

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // 🔄 AUTO REFRESH every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (data?.status === "ACTIVE") {
      navigate("/payment-success");
    }
  }, [data, navigate]);

  // 🎯 Redirect ketika status ACTIVE
  useEffect(() => {
    if (data?.status === "ACTIVE") {
      navigate("/payment-success");
    }
  }, [data, navigate]);

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-xl px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {t("virtual_account.title") || "Pembayaran Virtual Account"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("virtual_account.subtitle") ||
              "Silakan lakukan pembayaran menggunakan Virtual Account berikut"}
          </p>
        </div>

        {/* Payment Status Card */}
        <div className="p-6 mb-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Clock size={24} />
              <span className="font-semibold">
                {t("virtual_account.waiting_payment") || "Menunggu Pembayaran"}
              </span>
            </div>
          </div>

          {/* Virtual Account Number */}
          <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("virtual_account.va_number") || "Nomor Virtual Account"}
            </label>
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                {storedDeeplink || "Loading..."}
              </span>
              <button
                onClick={() => copyToClipboard(storedDeeplink, "va")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
              >
                {copiedField === "va" ? (
                  <CheckCircle size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copiedField === "va" ? "Tersalin!" : "Salin"}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h3 className="flex items-center gap-2 mb-3 font-semibold text-blue-900 dark:text-blue-100">
            <AlertCircle size={18} />
            {t("virtual_account.instructions") || "Cara Pembayaran"}
          </h3>
          <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside dark:text-blue-200">
            <li>
              {t("virtual_account.step1") ||
                "Buka aplikasi mobile banking atau internet banking bank Anda"}
            </li>
            <li>
              {t("virtual_account.step2") ||
                "Pilih menu Transfer atau Pembayaran"}
            </li>
            <li>
              {t("virtual_account.step3") ||
                "Masukkan nomor Virtual Account di atas"}
            </li>
            <li>
              {t("virtual_account.step4") ||
                "Masukkan jumlah yang harus dibayar"}
            </li>
            <li>
              {t("virtual_account.step5") ||
                "Konfirmasi dan selesaikan pembayaran"}
            </li>
            <li>
              {t("virtual_account.step6") ||
                "Status pembayaran akan diperbarui secara otomatis"}
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/membership")}
            className="flex-1 px-4 py-3 font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
          >
            {t("virtual_account.back_to_membership") || "Kembali ke Membership"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("virtual_account.note") ||
              "Pembayaran akan diproses otomatis. Jika mengalami kendala, silakan hubungi customer service."}
          </p>
        </div>
      </main>
    </div>
  );
}

export default VirtualAccountPage;
