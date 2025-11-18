import React from "react";
import { useTranslation } from "react-i18next";

export default function MembershipCards({
  type = "supporter", // "supporter" atau "creator"
  selectedPlan,
  plans,
  onSelectPlan,
  onSubscribe,
  isProcessing,
  videos = {},
}) {
  const { t } = useTranslation();

  const isCreator = type === "creator";

  const config = {
    supporter: {
      gradient: "from-blue-500 via-blue-600 to-purple-600",
      badge: t("membership.plan_premium"),
      title: "SUPPORTER",
      description: t("membership.desc"),
      accentColor: "blue",
      topBar: "from-blue-500 to-purple-500",
      buttonGradient: "bg-blue-500 ",
      buttonHover: "bg-blue-600 ",
      priceMultiplier: 1,
      priceOriginalMultiplier: 1.5,
    },
    creator: {
      gradient: "from-orange-500 via-orange-600 to-red-500",
      badge: "PRO CREATOR",
      title: "CREATOR",
      description: "Untuk content creator profesional",
      accentColor: "orange",
      topBar: "from-orange-500 to-red-500",
      buttonGradient: "bg-orange-500",
      buttonHover: "bg-orange-600 ",
      priceMultiplier: 1.5,
      priceOriginalMultiplier: 2,
    },
  };

  const currentConfig = config[type];

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col h-full bg-white dark:bg-gradient-to-b dark:from-[#1a2734] dark:to-[#0d1217] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className={`relative overflow-hidden text-white bg-gradient-to-br ${currentConfig.gradient}`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 transform rotate-45 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>

          <div className="relative min-h-[224px] p-6 text-center md:p-8 flex flex-col justify-center">
            <div className="inline-flex items-center justify-center px-4 py-2 mb-4 rounded-full bg-black/20 backdrop-blur-sm">
              <span className="text-sm font-semibold tracking-widest">
                {currentConfig.badge}
              </span>
            </div>
            <h2 className="mb-3 text-3xl font-bold md:text-4xl drop-shadow-lg">
              {currentConfig.title}
            </h2>
            <p
              className={`text-base font-medium md:text-lg text-${currentConfig.accentColor}-100`}
            >
              {currentConfig.description}
            </p>
          </div>

          {/* Toggle Plan */}
          <div className="relative px-4 pb-6 md:px-6">
            <div className="p-2 bg-black/20 rounded-2xl backdrop-blur-sm">
              <div className="flex p-1 bg-black/30 rounded-xl">
                {plans?.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => onSelectPlan(plan)}
                    className={`flex-1 py-3 md:py-4 px-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 transform ${
                      selectedPlan?.id === plan.id
                        ? "bg-white text-gray-900 shadow-lg scale-105"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Section */}
          {selectedPlan && (
            <div className="relative py-6 text-center bg-white md:py-8 dark:bg-gray-900">
              <div
                className={`absolute top-0 w-20 h-1 transform -translate-x-1/2 rounded-full md:w-24 left-1/2 bg-gradient-to-r ${currentConfig.topBar}`}
              ></div>
              <p className="mb-1 text-xs text-gray-500 line-through md:text-sm">
                Rp
                {(
                  selectedPlan.price * currentConfig.priceOriginalMultiplier
                ).toLocaleString("id-ID")}
              </p>
              <p className="mb-2 text-4xl font-black text-gray-900 md:text-5xl dark:text-white">
                Rp{" "}
                {(
                  selectedPlan.price * currentConfig.priceMultiplier
                ).toLocaleString("id-ID")}
              </p>
              <p className="text-sm font-medium text-gray-600 md:text-base dark:text-gray-400">
                {t("membership.for_days", {
                  days: selectedPlan.name,
                })}
              </p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="flex-1 px-4 py-6 space-y-4 bg-white md:px-6 md:py-8 md:space-y-6 dark:bg-gray-800">
          {/* Feature 1 - Remove Watermark */}
          <div
            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
          >
            <div
              className={`absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-${currentConfig.accentColor}-500/5 to-${
                currentConfig.accentColor === "blue" ? "purple" : "red"
              }-500/5 group-hover:opacity-100`}
            ></div>
            <video
              src={videos.noWatermark}
              className="object-cover w-full h-40 md:h-48 rounded-t-2xl md:rounded-t-3xl"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="p-4 space-y-2 text-center md:p-6 md:space-y-3">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div
                  className={`flex items-center justify-center w-6 h-6 bg-${currentConfig.accentColor}-500 rounded-full md:w-8 md:h-8`}
                >
                  <svg
                    className="w-3 h-3 text-white md:w-4 md:h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 md:text-xl dark:text-white">
                  {isCreator
                    ? "Remove Watermark Pro"
                    : t("membership.remove_watermark")}
                </h3>
              </div>
              <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">
                {isCreator
                  ? "Hapus watermark untuk semua campaign"
                  : t("membership.on_your_account")}
              </p>
            </div>
          </div>

          {/* Feature 2 - Ad-Free */}
          <div
            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
          >
            <div
              className={`absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-${currentConfig.accentColor}-500/5 to-${
                currentConfig.accentColor === "blue" ? "purple" : "red"
              }-500/5 group-hover:opacity-100`}
            ></div>
            <video
              src={videos.noAds}
              className="object-cover w-full h-40 md:h-48 rounded-t-2xl md:rounded-t-3xl"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="p-4 space-y-2 text-center md:p-6 md:space-y-3">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div
                  className={`flex items-center justify-center w-6 h-6 bg-${currentConfig.accentColor}-500 rounded-full md:w-8 md:h-8`}
                >
                  <svg
                    className="w-3 h-3 text-white md:w-4 md:h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 md:text-xl dark:text-white">
                  Ad-Free Experience
                </h3>
              </div>
              <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">
                {t("membership.on_your_account")}
              </p>
            </div>
          </div>

          {/* Feature 3 - Extra Feature */}
          {isCreator ? (
            <div
              className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
            >
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 group-hover:opacity-100"></div>
              <video
                src={videos.analytics}
                className="object-cover w-full h-40 md:h-48 rounded-t-2xl md:rounded-t-3xl"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="p-4 space-y-2 text-center md:p-6 md:space-y-3">
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-orange-500 rounded-full md:w-8 md:h-8">
                    <svg
                      className="w-3 h-3 text-white md:w-4 md:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 md:text-xl dark:text-white">
                    Advanced Analytics
                  </h3>
                </div>
                <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">
                  Analytics detail untuk campaign Anda
                </p>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center p-6 overflow-hidden text-center transition-all duration-300 border border-gray-200 md:p-8 group rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 hover:shadow-lg min-h-[240px] md: h-[304px]">
              <div className="space-y-3 md:space-y-4">
                <div className="text-4xl md:text-5xl">😔</div>
                <p className="text-sm font-semibold text-gray-600 md:text-base dark:text-gray-400">
                  {t("membership.no_extra_features")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Button Inside Card */}
        <div className="p-4 border-t border-gray-200 md:p-6 dark:border-gray-700">
          <button
            onClick={() => onSubscribe(type)}
            disabled={isProcessing}
            className={`w-full py-3 md:py-4 bg-gradient-to-r ${currentConfig.buttonGradient} hover:${currentConfig.buttonHover} text-white font-bold text-base md:text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white rounded-full md:w-5 md:h-5 border-t-transparent animate-spin"></div>
                <span className="text-sm md:text-base">
                  {t("membership.processing")}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm md:text-base">
                  Upgrade to {currentConfig.title}
                </span>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}