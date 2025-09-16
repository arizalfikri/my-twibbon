import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/index";
import "./index.css";
import { ModalToast } from "./components/modal/ModalToast";
import "./i18n";
import "aos/dist/aos.css";

const theme = localStorage.getItem("theme") || "light";
if (theme === "dark") {
  document.documentElement.classList.add("dark");
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});
router.subscribe(({ location }) => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ModalToast />
    </QueryClientProvider>
  </React.StrictMode>
);
