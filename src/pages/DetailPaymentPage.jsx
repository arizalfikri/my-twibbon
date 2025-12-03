import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logoHitam from "../assets/images/logo/Logo_Hitam.png";
import { useGET } from "../services/api";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";

function DetailPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentId = location.state?.paymentId;

  useEffect(() => {
    if (!paymentId) {
      navigate("/history");
    }
  }, [paymentId, navigate]);

  const { data, isLoading, error } = useGET(
    paymentId ? `/detail-payment/${paymentId}` : null,
    { enabled: !!paymentId }
  );

  const detail = data?.data?.detailPayment;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors = {
    PENDING: "bg-orange-100 text-orange-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
    SETTLED: "bg-blue-100 text-blue-800",
    VOIDED: "bg-gray-100 text-gray-800",
    SUCCEEDED: "bg-green-100 text-green-800",
  };

  const invoiceRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);

    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Calculate height based on width ratio to maintain aspect ratio
      const finalHeight = (imgHeight * pdfWidth) / imgWidth;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
      pdf.save(`Invoice-${detail.reference_id || detail.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!paymentId) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container px-4 py-5 mx-auto max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
        >
          <svg
            className="mr-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Riwayat
        </button>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 animate-spin border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl dark:bg-red-900/20 dark:text-red-400">
            Gagal memuat detail pembayaran.
          </div>
        ) : detail ? (
          <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* Header Status */}
            <div className="flex flex-col gap-4 justify-between items-start p-6 border-b border-gray-100 dark:border-gray-700 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detail Pembayaran
                </h1>
              
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  statusColors[detail.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {detail.status}
              </span>
            </div>

            <div className="flex justify-end px-6 pt-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="mr-2 w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Membuat PDF...
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Unduh Faktur
                  </>
                )}
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Amount Section */}
              <div className="flex flex-col justify-center items-center p-6 bg-gray-50 rounded-xl dark:bg-gray-700/30">
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  Total Jumlah
                </p>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(detail.total_amount || detail.amount)}
                </div>
              </div>

              {/* Payment Info Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b border-gray-100 dark:text-white dark:border-gray-700">
                    Info Transaksi
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        ID Referensi
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {detail.reference_id || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Metode Pembayaran
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {detail.callback_data?.data?.channel_code ||
                          detail.channel_code ||
                          detail.payment_method ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Dibuat Pada
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {formatDate(detail.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Kadaluarsa Pada
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {formatDate(detail.expiredAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b border-gray-100 dark:text-white dark:border-gray-700">
                    Detail Tambahan
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Biaya Admin
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {detail.admin_fee
                          ? formatCurrency(detail.admin_fee)
                          : detail.total_amount && detail.amount
                          ? formatCurrency(detail.total_amount - detail.amount)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Diperbarui Pada
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {formatDate(detail.updatedAt)}
                      </p>
                    </div>
                    {detail.callback_data?.data?.business_id && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                          ID Bisnis
                        </p>
                        <p className="font-medium text-gray-900 break-all dark:text-gray-200">
                          {detail.callback_data.data.business_id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Proof of Payment */}
              {detail.proof_url && (
                <div className="pt-4 space-y-3 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Bukti Pembayaran
                  </h3>
                  <a
                    href={detail.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-gray-200 transition-opacity dark:border-gray-700 hover:opacity-90"
                  >
                    <img
                      src={detail.proof_url}
                      alt="Proof of Payment"
                      className="object-contain w-full h-auto max-h-96 bg-gray-50 dark:bg-gray-900"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Detail tidak ditemukan.
          </div>
        )}
      </div>
      <Footer />

      {/* Hidden Invoice Template for PDF Generation */}
      <div
        className="absolute top-0 left-0 -z-50 w-[210mm] min-h-[297mm] bg-white p-10"
        ref={invoiceRef}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-8 border-b-2 border-gray-800">
          <div className="flex items-center">
            <img
              src={logoHitam}
              alt="MyTwibbon Logo"
              className="object-contain h-12"
            />
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold tracking-wide text-gray-800 uppercase">
              Faktur
            </h1>
            <p className="mt-1 text-gray-600">
              #{detail?.reference_id || detail?.id}
            </p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between mb-10">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
              Ditagih Ke:
            </h2>
            <p className="text-lg font-bold text-gray-800">
              {detail?.user?.fullname || "Customer"}
            </p>
            <p className="text-gray-600">{detail?.user?.email}</p>
          </div>
          <div className="text-right">
            <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
              Info Pembayaran:
            </h2>
            <p className="text-gray-600">
              <span className="font-semibold">Tanggal:</span>{" "}
              {formatDate(detail?.createdAt)}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`uppercase font-bold ${
                  detail?.status === "PAID" ||
                  detail?.status === "SUCCEEDED" ||
                  detail?.status === "SETTLED"
                    ? "text-green-600"
                    : "text-gray-800"
                }`}
              >
                {detail?.status}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Metode:</span>{" "}
              {detail?.callback_data?.data?.channel_code ||
                detail?.channel_code ||
                detail?.payment_method ||
                "-"}
            </p>
          </div>
        </div>

        {/* Order Details Table */}
        <div className="mb-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-left text-gray-700">
                  Deskripsi
                </th>
                <th className="px-4 py-3 font-semibold text-right text-gray-700">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-4 text-gray-800">
                  Pembayaran untuk Transaksi #
                  {detail?.reference_id || detail?.id}
                  {detail?.callback_data?.data?.business_id && (
                    <div className="mt-1 text-sm text-gray-500">
                      ID Bisnis: {detail.callback_data.data.business_id}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 font-medium text-right text-gray-800">
                  {formatCurrency(detail?.amount || detail?.total_amount)}
                </td>
              </tr>
              {/* Admin Fee if applicable */}
              {(detail?.admin_fee ||
                (detail?.total_amount &&
                  detail?.amount &&
                  detail.total_amount > detail.amount)) && (
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 text-gray-800">Biaya Admin</td>
                  <td className="px-4 py-4 font-medium text-right text-gray-800">
                    {detail.admin_fee
                      ? formatCurrency(detail.admin_fee)
                      : formatCurrency(detail.total_amount - detail.amount)}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-4 py-4 font-bold text-right text-gray-800">
                  Total
                </td>
                <td className="px-4 py-4 text-xl font-bold text-right text-primary-600">
                  {formatCurrency(detail?.total_amount || detail?.amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-8 mt-auto text-sm text-center text-gray-500 border-t border-gray-200">
          <p>Terima kasih atas kepercayaan Anda!</p>
          <p className="mt-2">MyTwibbon - Buat dan Bagikan Kampanye Anda</p>
        </div>
      </div>
    </div>
  );
}

export default DetailPaymentPage;
