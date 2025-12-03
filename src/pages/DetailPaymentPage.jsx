import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  if (!paymentId) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container px-4 pt-24 pb-10 mx-auto max-w-3xl">
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
          Back to History
        </button>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 animate-spin border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl dark:bg-red-900/20 dark:text-red-400">
            Failed to load payment details.
          </div>
        ) : detail ? (
          <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* Header Status */}
            <div className="flex flex-col gap-4 justify-between items-start p-6 border-b border-gray-100 dark:border-gray-700 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Payment Details
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  ID: #{detail.id}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  statusColors[detail.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {detail.status}
              </span>
            </div>

            <div className="p-6 space-y-8">
              {/* Amount Section */}
              <div className="flex flex-col justify-center items-center p-6 bg-gray-50 rounded-xl dark:bg-gray-700/30">
                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  Total Amount
                </p>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(detail.total_amount || detail.amount)}
                </div>
              </div>

              {/* Payment Info Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b border-gray-100 dark:text-white dark:border-gray-700">
                    Transaction Info
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Reference ID
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {detail.reference_id || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Payment Method
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
                        Created At
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {formatDate(detail.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Expired At
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {formatDate(detail.expiredAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b border-gray-100 dark:text-white dark:border-gray-700">
                    Additional Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Admin Fee
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
                        Updated At
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-200">
                        {formatDate(detail.updatedAt)}
                      </p>
                    </div>
                    {detail.callback_data?.data?.business_id && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                          Business ID
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
                    Proof of Payment
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
          <div className="text-center text-gray-500">No details found.</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default DetailPaymentPage;
