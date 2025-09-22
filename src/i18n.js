import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import id from "./locales/id/translation.json";
import en from "./locales/en/translation.json";

const userLang = navigator.language || navigator.userLanguage;
const fallbackLanguage = userLang.startsWith("id") ? "id" : "en";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            id: { translation: id },
            en: { translation: en },
        },
        fallbackLng: fallbackLanguage,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;
