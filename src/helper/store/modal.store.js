import { create } from "zustand";

export const useModalStore = create((set) => ({
    toast: false,
    textToast: "",
    typeToast: "",

    modalLogout: false,

    openToast: (name, status, text, typeToast = "error") =>
        set({ [name]: status, textToast: text, typeToast }),
    openModal: (name, status) => set({ [name]: status }),
}));
