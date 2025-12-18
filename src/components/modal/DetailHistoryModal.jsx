import React from "react";

function DetailHistoryModal({ isOpen, onClose, payment }) {
  if (!isOpen || !payment) return null;

  const {
    id,
    user,
    subscription,
    amount,
    status,
    proof_url,
    createdAt,
    updatedAt,
  } = payment;

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
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

  return (
    <div
      className="
        fixed inset-0 z-[100] flex items-end justify-center p-4 
        bg-black/50 backdrop-blur-sm
        md:items-center md:justify-center
      "
      onClick={onClose}
    >
      <div
        className="
          w-full bg-white dark:bg-gray-800 shadow-xl p-6
          rounded-t-2xl max-h-[90vh] overflow-y-auto
          fixed bottom-0
          md:static md:rounded-xl md:max-w-lg md:max-h-none
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Payment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Status & Amount */}
          <div className="flex flex-col justify-center items-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50">
            <span
              className={`px-3 py-1 mb-2 text-sm font-medium rounded-full ${
                statusColors[status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(amount)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(createdAt)}
            </span>
          </div>

          {/* Transaction Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Transaction Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Transaction ID
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  #{id}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Plan</p>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  {subscription?.plan?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Duration</p>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  {subscription?.plan?.duration_days} Days
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Updated At</p>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  {formatDate(updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              User Information
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  {user?.fullname}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Proof of Payment */}
          {proof_url && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Proof of Payment
              </h3>
              <a
                href={proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={proof_url}
                  alt="Proof of Payment"
                  className="object-cover w-full h-48"
                />
              </a>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 w-full text-white rounded-lg transition-colors bg-primary hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailHistoryModal;
