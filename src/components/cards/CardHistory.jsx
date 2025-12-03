import React from "react";

function CardHistory({ payment, onViewDetails }) {
  if (!payment) return null;

  const { id, amount, status, createdAt, subscription } = payment;

  const planName = subscription?.plan?.name || "Unknown Plan";
  const expirationDate = subscription?.end_date;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statusConfig = {
    PENDING: { label: "Pending", color: "bg-orange-100 text-orange-800" },
    PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
    FAILED: { label: "Failed", color: "bg-red-100 text-red-800" },
    EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-800" },
    SETTLED: { label: "Settled", color: "bg-blue-100 text-blue-800" },
    VOIDED: { label: "Voided", color: "bg-gray-100 text-gray-800" },
    SUCCEEDED: { label: "Succeeded", color: "bg-green-100 text-green-800" },
    CANCELED: { label: "Canceled", color: "bg-red-100 text-red-800" },
  };

  const statusInfo = statusConfig[status] || {
    label: status,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="p-6 w-full bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {/* Header dengan judul dan status */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {planName}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Informasi Membership */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300 sm:flex-row sm:items-center">
          <div className="flex gap-2 items-center">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Date: {formatDate(createdAt)}</span>
          </div>

          {expirationDate && (
            <div className="flex gap-2 items-center">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Expires: {formatDate(expirationDate)}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Transaction ID: #{id}
        </div>
      </div>

      {/* Footer dengan harga dan actions */}
      <div className="flex flex-col gap-4 justify-between items-start pt-4 border-t border-gray-100 dark:border-gray-700 sm:flex-row sm:items-center">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatCurrency(amount)}
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => onViewDetails(payment)}
            className="text-sm text-gray-600 underline transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardHistory;
