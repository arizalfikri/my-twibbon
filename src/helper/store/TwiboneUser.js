import { create } from "zustand";

const useTwibbonStore = create((set) => ({
    twibbonData: null,

    setTwibbonData: (data) => set({ twibbonData: data }),
    clearTwibbonData: () => set({ twibbonData: null }),
}));

export default useTwibbonStore;
