import { CheckCircle, Search, Share2, Upload } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

function TUTORIALSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 mt-16 bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 dark:from-gray-800 dark:to-primary-900/30 rounded-3xl">
      <div className="max-w-screen-xl px-6 mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {t("homepage.tutorial_title")}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            {t("homepage.tutorial_subtitle")}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Step 1 */}
          <div className="relative group">
            <div className="absolute inset-0 transition-transform transform bg-gradient-to-r from-primary-400 to-primary-300 dark:from-primary-500 dark:to-primary-600 rounded-2xl rotate-1 group-hover:rotate-2"></div>
            <div className="relative p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-2xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-primary-400 to-primary-500 dark:from-primary-500 dark:to-primary-600">
                <Search className="w-8 h-8" />
              </div>
              <div className="absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full top-4 right-4 bg-primary-500 dark:bg-primary-600">
                1
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                {t("homepage.step1_title")}
              </h3>
              <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                {t("homepage.step1_description")}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                <CheckCircle className="w-4 h-4" />
                {t("homepage.step1_feature")}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="absolute inset-0 transition-transform transform bg-gradient-to-r from-sky-400 to-sky-500 dark:from-sky-500 dark:to-sky-600 rounded-2xl -rotate-1 group-hover:-rotate-2"></div>
            <div className="relative p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-white rounded-full shadow-lg bg-gradient-to-r from-sky-400 to-sky-500 dark:from-sky-500 dark:to-sky-600">
                <Upload className="w-8 h-8" />
              </div>
              <div className="absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full top-4 right-4 bg-primary-500 dark:bg-primary-600">
                2
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                {t("homepage.step2_title")}
              </h3>
              <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                {t("homepage.step2_description")}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                <CheckCircle className="w-4 h-4" />
                {t("homepage.step2_feature")}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="absolute inset-0 transition-transform transform bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600 rounded-2xl rotate-1 group-hover:rotate-2"></div>
            <div className="relative p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
              <div
                className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-white rounded-full shadow-lg bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600"
              >
                <Share2 className="w-8 h-8" />
              </div>
              <div className="absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full top-4 right-4 bg-primary-500 dark:bg-primary-600">
                3
              </div>

              <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                {t("homepage.step3_title")}
              </h3>
              <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                {t("homepage.step3_description")}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                <CheckCircle className="w-4 h-4" />
                {t("homepage.step3_feature")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TUTORIALSection;
