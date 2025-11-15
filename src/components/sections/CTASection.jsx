import { Plus, Search, Sparkles } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function CTASection() {
      const { t } = useTranslation();
    
  return (
    <section className="py-16 mt-20 text-center">
      <div className="w-full mx-auto">
        <div className="p-12 text-white shadow-xl bg-primary-400 dark:from-primary-500 dark:via-primary-600 dark:to-primary-500 rounded-3xl">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-white animate-pulse" />
          <h2 className="mb-4 text-3xl font-bold">{t("homepage.cta_title")}</h2>
          <p className="mb-8 text-xl text-blue-50">
            {t("homepage.cta_subtitle")}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/create">
              <button className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white transition-all bg-yellow-400 rounded-full shadow-lg dark:bg-yellow-500 dark:text-primary-700 hover:bg-yellow-300 dark:hover:bg-yellow-400 hover:scale-105">
                <Plus className="w-5 h-5" />
                {t("homepage.start_now")}
              </button>
            </Link>
            <Link to="/explore">
              <button className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all border-2 border-white rounded-full hover:bg-white hover:text-primary-500 dark:hover:bg-gray-100 dark:hover:text-primary-600 hover:scale-105">
                <Search className="w-5 h-5" />
                {t("homepage.view_templates")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
