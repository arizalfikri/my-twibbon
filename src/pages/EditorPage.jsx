import React, { useEffect } from "react";
import CardEditor from "../components/cards/CardEditor";
import useImageStore from "../helper/store/imagestore";
import { useNavigate } from "react-router-dom";
import NavbarEditor from "../components/layoutpage/NavbarEditor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function EditorPage() {
  const { image, frameImage } = useImageStore();
  const navigate = useNavigate();

  // Jika belum ada gambar, redirect user ke halaman upload
  useEffect(() => {
    if (!image) {
      navigate("/");
    }
  }, [image, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <NavbarEditor />

        <div className="md:hidden h-[calc(100vh-64px)] flex flex-col">
          <CardEditor frameImage={frameImage} />
        </div>

        <div className="hidden gap-6 p-6 mx-auto md:grid md:grid-cols-3 max-w-7xl">
          <div className="md:col-span-2">
            <CardEditor frameImage={frameImage} />
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Pengaturan
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 font-medium text-gray-700">
                  Filter & Efek
                </h3>
                <p className="text-sm text-gray-600">
                  Segera hadir - filter dan efek untuk mempercantik gambar Anda.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 font-medium text-gray-700 ">Penyesuaian</h3>
                <p className="text-sm text-gray-600">
                  Atur brightness, contrast, dan saturasi gambar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default EditorPage;
