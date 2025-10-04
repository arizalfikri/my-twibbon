import React, { useState, useEffect } from "react";
import Navbar from "../components/layoutpage/Navbar";
import { useGET, usePOST } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../helper/store/modal.store";
import LoadingPage from "../components/layoutpage/LoadingPage";

function CheckoutPage() {
  const [file, setFile] = useState(null);
  const { data: payment, isLoading, refetch } = useGET("/payment");
  const uploadProof = usePOST();
  const navigate = useNavigate();
  const { openToast } = useModalStore();
  
  useEffect(() => {
    refetch();
  }, [refetch]);

  // cek apakah ada data payment
  useEffect(() => {
    if (!isLoading && (!payment || !payment.data)) {
      openToast({
        message:
          "Kamu belum punya pembayaran aktif, silakan pilih membership dulu.",
        type: "error",
      });
      navigate("/membership");
    }
  }, [isLoading, payment, navigate, openToast]);

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadProof.mutateAsync({
        url: `/pay-subscription`,
        data: { image: file },
      });
      openToast({
        message: "Bukti transfer berhasil diupload!",
        type: "success",
      });
      setFile(null);
      refetch();
    } catch (error) {
      console.error("Upload error:", error);
      openToast({ message: "Upload gagal, coba lagi.", type: "error" });
    }
  };

  const detail = payment?.data;

  if (isLoading) {
    return <LoadingPage />;
  }

  // Jika status waiting_verification, tampilkan pesan khusus
  if (detail?.status === "waiting_verification") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="px-6 py-10 mx-auto max-w-screen-2xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="max-w-md p-8 text-center bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <div className="mb-4 text-6xl">⏳</div>
              <h1 className="mb-4 text-2xl font-bold text-green-600 dark:text-green-400">
                Pembayaran Berhasil!
              </h1>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Harap tunggu, pembayaran Anda sedang dalam proses verifikasi.
              </p>
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam.
                  Anda akan mendapatkan notifikasi setelah verifikasi selesai.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="px-6 py-10 mx-auto max-w-screen-2xl">
        <h1 className="mb-6 text-2xl font-bold">
          Upgrade to Premium Supporter
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Gather your supporters and scale up your campaign with our exclusive
          features
        </p>

        {detail && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* LEFT CARD */}
            <div className="p-6 text-white shadow-lg bg-gradient-to-br to-[#7ecd67] from-[#11cefe] rounded-xl h-fit">
              <h2 className="mb-4 text-2xl font-semibold">Premium Supporter</h2>
              <ul className="space-y-3">
                <li>✅ Remove Watermark</li>
                <li>✅ No Ads</li>
              </ul>
            </div>

            {/* RIGHT CARD */}
            <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
              <h3 className="mb-3 text-lg font-semibold">Detail Pendaftaran</h3>
              <p className="text-sm font-medium">
                Total:{" "}
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  Rp{detail?.amount.toLocaleString("id-ID")}
                </span>
              </p>

              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Durasi:{" "}
                <span className="font-semibold">
                  {detail?.subscription?.plan?.duration_days} hari
                </span>
              </p>

              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Status: <span className="font-semibold">{detail?.status}</span>
              </p>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Expired At: {new Date(detail?.expiredAt).toLocaleString()}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <b>BCA</b> 1801855585 a/n <b>Ahmad Qomaruddin</b>
                </p>
                <p>
                  <b>GOPAY</b> 085215090131 a/n <b>Ahmad Qomaruddin</b>
                </p>
              </div>

              {/* Upload bukti transfer */}
              <div className="mt-6">
                <label className="block mb-2 text-sm font-medium">
                  Upload Bukti Transfer
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-700 border-2 border-gray-300 rounded-lg dark:border-gray-400 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 dark:file:bg-purple-500 dark:file:text-black "
                />
                {file && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    File dipilih: {file.name}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleUpload}
                  className="w-full py-3 mt-4 font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800"
                >
                  Upload Bukti Transfer →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CheckoutPage;
