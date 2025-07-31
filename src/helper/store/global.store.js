import { create } from "zustand";

export const useGlobalStore = create((set) => ({
    email: localStorage.getItem("email") || "",
    token: localStorage.getItem("token") || "",

    setEmail: (email) => set({ email: email }),
    setToken: (token) => set({ token: token }),
}));
