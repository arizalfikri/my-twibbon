import React, { useState, useEffect } from "react";
import Navbar from "../components/layoutpage/Navbar";
import { useGET, usePOST } from "../services/api";
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
  const uploadProof = usePOST();
  const navigate = useNavigate();
  const { openToast } = useModalStore();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // cek apakah ada data payment
  useEffect(() => {
    if (!isLoading && (!payment || !payment.data)) {
      openToast({
        message: t("checkout.no_payment"),
        type: "error",
      });
      navigate("/membership");
    }
  }, [isLoading, payment, navigate, openToast, t]);

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadProof.mutateAsync({
        url: `/pay-subscription`,
        data: { image: file },
      });
      openToast({
        message: t("checkout.upload_success"),
        type: "success",
      });
      setFile(null);
      refetch();
    } catch (error) {
      console.error("Upload error:", error);
      openToast({ message: t("checkout.upload_fail"), type: "error" });
    }
  };

  const detail = payment?.data;

  if (isLoading) return <LoadingPage />;

  // Jika status waiting_verification, tampilkan pesan khusus
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
      <main className="px-6 py-10 mx-auto max-w-screen-2xl">
        <h1 className="mb-6 text-2xl font-bold">{t("checkout.title")}</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          {t("checkout.subtitle")}
        </p>

        {detail && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* LEFT CARD */}
            <div className="p-6 text-white shadow-lg bg-gradient-to-br to-[#7ecd67] from-[#11cefe] rounded-xl h-fit">
              <h2 className="mb-4 text-2xl font-semibold">
                {t("checkout.premium_title")}
              </h2>
              <ul className="space-y-3">
                <li>✅ {t("checkout.feature_remove_watermark")}</li>
                <li>✅ {t("checkout.feature_no_ads")}</li>
              </ul>
            </div>

            {/* RIGHT CARD */}
            <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <h3 className="mb-3 text-lg font-semibold">
                {t("checkout.detail_title")}
              </h3>
              <p className="text-sm font-medium">
                {t("checkout.total")}:{" "}
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  Rp{detail?.amount.toLocaleString("id-ID")}
                </span>
              </p>

              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {t("checkout.duration")}:{" "}
                <span className="font-semibold">
                  {detail?.subscription?.plan?.duration_days}{" "}
                  {t("checkout.days")}
                </span>
              </p>

              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {t("checkout.status")}:{" "}
                <span className="font-semibold">{detail?.status}</span>
              </p>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {t("checkout.expired_at")}:{" "}
                {new Date(detail?.expiredAt).toLocaleString()}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <b>BCA</b> 1801855585 a/n <b>Ahmad Qomaruddin</b>
                </p>
                <p>
                  <b>GOPAY</b> 085215090131 a/n <b>Ahmad Qomaruddin</b>
                </p>
              </div>

              {/* Upload bukti transfer */}
              <div className="mt-6">
                <label className="block mb-2 text-sm font-medium">
                  {t("checkout.upload_label")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-700 border-2 border-gray-300 rounded-lg dark:border-gray-400 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 dark:file:bg-purple-500 dark:file:text-black "
                />
                {file && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {t("checkout.file_selected")}: {file.name}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploadProof.isPending}
                  className={`w-full py-3 mt-4 font-medium text-white rounded-lg ${
                    uploadProof.isPending
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-700 hover:bg-purple-800"
                  }`}
                >
                  {uploadProof.isPending
                    ? t("checkout.uploading")
                    : t("checkout.upload_button")}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CheckoutPage;
