import { create } from "zustand";

const useImageStore = create((set) => ({
  image: null,
  setImage: (image) => set({ image }),

  resultImage: null,
  setResultImage: (img) => set({ resultImage: img }),
}));

export default useImageStore;
