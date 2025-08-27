import { create } from "zustand";

export const useGlobalStore = create((set) => ({
    email: localStorage.getItem("email") || "",
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    fullname: localStorage.getItem("fullname") || "",

    setEmail: (email) => set({ email: email }),
    setToken: (token) => set({ token: token }),
    setRole: (role) => set({ role: role }),
    setFullName: (fullname) => set({ fullname: fullname }),
}));
