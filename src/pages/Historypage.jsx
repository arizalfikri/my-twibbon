import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import CardHistory from "../components/cards/CardHistory";
import { useGET } from "../services/api";

function Historypage() {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const {
    data: paymentsData,
    isLoading,
    error,
  } = useGET(`/all-payments?status=${status}`);

  const statuses = [
    { label: "Semua Status", value: "" },
    { label: "Menunggu", value: "PENDING" },
    { label: "Dibayar", value: "PAID" },
    { label: "Gagal", value: "FAILED" },
    { label: "Kadaluarsa", value: "EXPIRED" },
    { label: "Diselesaikan", value: "SETTLED" },
    { label: "Dibatalkan", value: "VOIDED" },
    { label: "Berhasil", value: "SUCCEEDED" },
    { label: "Dibatalkan", value: "CANCELED" },
  ];

  const handleViewDetails = (payment) => {
    navigate("/history/detail", { state: { paymentId: payment.id } });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex flex-col gap-4 justify-between mb-8 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Riwayat Transaksi
            </h1>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
                  appearance-none w-full md:w-48 px-4 py-2.5 pr-8
                  bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 
                  rounded-lg shadow-sm
                  text-gray-700 dark:text-gray-200
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                  cursor-pointer
                "
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <div className="flex absolute inset-y-0 right-0 items-center px-2 text-gray-500 pointer-events-none dark:text-gray-400">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 rounded-full border-4 animate-spin border-primary border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                Gagal memuat riwayat. Silakan coba lagi nanti.
              </div>
            ) : paymentsData?.data?.length > 0 ? (
              paymentsData.data.map((payment) => (
                <CardHistory
                  key={payment.id}
                  payment={payment}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                Tidak ada riwayat pembayaran ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Historypage;
