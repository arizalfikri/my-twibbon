import { create } from "zustand";

export const useLanguageStore = create((set) => ({
    language: "id", 
    setLanguage: (lang) => set({ language: lang }),
    toggleLanguage: () =>
        set((state) => ({
            language: state.language === "id" ? "en" : "id",
        })),
}));
