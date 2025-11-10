import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

function ModalPendingSubscription({
  visible,
  onClose,
  onCancel,
  onContinue,
  subscriptionData,
}) {
  const { t } = useTranslation();

  if (!visible || !subscriptionData) return null;

  const subscription = subscriptionData?.subscription;
  const payment = subscriptionData?.payment;
  const plan = subscription?.plan;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white dark:bg-[#1a2734] rounded-2xl shadow-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("modal.pending_subscription", "Subscription Pending")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Warning Message */}
        <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {t(
              "modal.pending_warning",
              "You have an active pending subscription. Please complete or cancel it before subscribing to another plan."
            )}
          </p>
        </div>

        {/* Subscription Details */}
        <div className="p-4 mb-6 space-y-3 bg-gray-100 rounded-lg dark:bg-black/40">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {t("modal.current_subscription", "Current Subscription")}
          </h3>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("modal.plan", "Plan")}:
            </span>
            <span className="font-medium text-gray-900 capitalize dark:text-white">
              {plan?.name}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("modal.duration", "Duration")}:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {plan?.duration_days} {t("modal.days", "days")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("modal.amount", "Amount")}:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(payment?.amount)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("modal.admin_fee", "Admin Fee")}:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(payment?.admin_fee)}
            </span>
          </div>

          <div className="flex justify-between pt-2 text-sm font-semibold border-t border-gray-300 dark:border-gray-600">
            <span className="text-gray-900 dark:text-white">
              {t("modal.total", "Total")}:
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatCurrency(payment?.total_amount)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("modal.started", "Started")}:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDate(subscription?.start_date)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("modal.expires", "Expires")}:
            </span>
            <span className="font-medium text-red-600 dark:text-red-400">
              {formatDate(subscription?.end_date)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("modal.status", "Status")}:
            </span>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-yellow-800 uppercase bg-yellow-100 rounded-full dark:bg-yellow-900/50 dark:text-yellow-200">
              {subscription?.status}
            </span>
          </div>
        </div>

    
        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 font-semibold text-red-600 transition border-2 border-red-500 rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            {t("modal.cancel_subscription", "Cancel Subscription")}
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-3 font-semibold text-white transition rounded-lg bg-primary-500 hover:bg-primary-600"
          >
            {t("modal.continue_payment", "Continue Payment")}
          </button>
        </div>

        {/* Footer Info */}
        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          {t(
            "modal.subscription_info",
            "You can continue your payment in the checkout page or cancel this subscription to choose a different plan."
          )}
        </p>
      </div>
    </div>
  );
}

export default ModalPendingSubscription;