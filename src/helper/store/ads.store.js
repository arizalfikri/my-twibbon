import { create } from "zustand";

export const useAdsStore = create((set) => ({
    ads: [],
    isAdsLoaded: false,

    setAds: (data) => set({ ads: data, isAdsLoaded: true }),
    clearAds: () => set({ ads: [], isAdsLoaded: false }),
}));
