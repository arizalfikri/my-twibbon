import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import id from "./locales/id/translation.json";
// import en from "./locales/en/translation.json"; // sementara nonaktif

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: id },
      // en: { translation: en }, // nonaktif dulu
    },
    lng: "id", // paksa selalu pakai Indonesia
    fallbackLng: "id",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
