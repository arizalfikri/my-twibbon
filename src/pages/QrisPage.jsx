import React, { useState, useEffect, useRef } from "react";
import { useGET } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layoutpage/Navbar";
import LoadingPage from "../components/layoutpage/LoadingPage";
import { useTranslation } from "react-i18next";
import {
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

function QrisPage() {
  const { referer } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const qrImageRef = useRef(null);

  const { data, refetch, isLoading } = useGET(`/payment-status/${referer}`);
  const storedDeeplink = localStorage.getItem("payment_deeplink");

  // Generate QR Code dari deeplink string
  useEffect(() => {
    if (storedDeeplink) {
      // Jika deeplink adalah URL, gunakan langsung untuk generate QR
      try {
        // Coba parse sebagai URL
        new URL(storedDeeplink);
        setQrImageUrl(storedDeeplink);
      } catch {
        // Jika bukan URL, generate QR code dari string
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          storedDeeplink
        )}`;
        setQrImageUrl(qrCodeUrl);
      }
    }
  }, [storedDeeplink]);

  // 🔄 AUTO REFRESH every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  // 🎯 Redirect ketika status ACTIVE
  useEffect(() => {
    if (data?.status === "ACTIVE") {
      navigate("/payment-success");
    }
  }, [data, navigate]);

  const handleDownloadQR = async () => {
    if (!qrImageUrl) return;

    setDownloading(true);
    try {
      // Fetch the QR image
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.download = `qris-payment-${timestamp}.png`;

      // Trigger download
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-xl px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {t("qris.title") || "Pembayaran QRIS"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("qris.subtitle") ||
              "Scan QR Code berikut untuk melakukan pembayaran"}
          </p>
        </div>

        {/* Payment Status Card */}
        <div className="p-6 mb-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Clock size={24} />
              <span className="font-semibold">
                {t("qris.waiting_payment") || "Menunggu Pembayaran"}
              </span>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center mb-6">
            {qrImageUrl ? (
              <div className="relative p-4 bg-white rounded-lg shadow-md">
                <img
                  ref={qrImageRef}
                  src={qrImageUrl}
                  alt="QR Code Pembayaran"
                  className="w-64 h-64 mx-auto"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg dark:bg-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  Generating QR Code...
                </p>
              </div>
            )}

            {/* Amount */}
            {data?.data?.payment?.amount && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Pembayaran
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  Rp{data.data.payment.amount.toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>

         <div className="flex w-full">
  <button
    onClick={handleDownloadQR}
    disabled={!qrImageUrl || downloading}
    className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    {downloading ? (
      <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
    ) : (
      <Download size={18} />
    )}
    {downloading ? "Mengunduh..." : "Download QR"}
  </button>
</div>


          {/* Deeplink Info */}
          {storedDeeplink && (
            <div className="p-3 mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-center text-blue-800 dark:text-blue-200">
                QR Code berisi link pembayaran yang dapat di-scann oleh aplikasi
                e-wallet atau mobile banking
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h3 className="flex items-center gap-2 mb-3 font-semibold text-blue-900 dark:text-blue-100">
            <AlertCircle size={18} />
            {t("qris.instructions") || "Cara Pembayaran"}
          </h3>
          <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside dark:text-blue-200">
            <li>
              {t("qris.step1") ||
                "Download QR Code atau scan langsung dari layar"}
            </li>
            <li>
              {t("qris.step2") ||
                "Buka aplikasi e-wallet atau mobile banking Anda"}
            </li>
            <li>
              {t("qris.step3") || "Pilih menu Scan QRIS atau Pembayaran QR"}
            </li>
            <li>{t("qris.step4") || "Scan QR Code yang sudah didownload"}</li>
            <li>
              {t("qris.step5") || "Periksa detail pembayaran dan konfirmasi"}
            </li>
            <li>
              {t("qris.step6") || "Tunggu hingga pembayaran berhasil diproses"}
            </li>
          </ol>
        </div>

        {/* Back Button */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/membership")}
            className="flex-1 px-4 py-3 font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
          >
            {t("qris.back_to_membership") || "Kembali ke Membership"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("qris.note") ||
              "Pembayaran akan diproses otomatis. Jika mengalami kendala, silakan hubungi customer service."}
          </p>
        </div>
      </main>
    </div>
  );
}

export default QrisPage;
