import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layoutpage/Navbar";
import Footer from "../components/layoutpage/Footer";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Download,
  Layers,
  Lock,
} from "lucide-react";
import { useGET } from "../services/api";
import { useGlobalStore } from "../helper/store/global.store";
import { useSubscriptionStore } from "../helper/store/subscription.store";

function AdvanceAnalyticsPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const { token } = useGlobalStore();
  const { hasActiveContributor } = useSubscriptionStore();

  const isLocked = !token || !hasActiveContributor;

  // Fetch Monthly Analytics for the Chart (Yearly view broken down by month)
  const { data: monthlyAnalyticsData, isLoading: isLoadingMonthly } = useGET(
    `/contributor/analytics/monthly?year=${selectedYear}`,
    { enabled: !isLocked }
  );

  // Fetch Summary Analytics for the Cards (Specific Month view)
  const { data: summaryData, isLoading: isLoadingSummary } = useGET(
    `/contributor/summary?month=${selectedMonth}&year=${selectedYear}`,
    { enabled: !isLocked }
  );

  const chartData = useMemo(() => {
    if (!monthlyAnalyticsData?.data) return [];
    return monthlyAnalyticsData.data;
  }, [monthlyAnalyticsData]);

  const summary = useMemo(() => {
    if (!summaryData?.data) {
      return {
        total_twibbon: 0,
        total_views: 0,
        total_supports: 0,
        total_download: 0,
      };
    }
    return summaryData.data;
  }, [summaryData]);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br via-blue-50 to-indigo-50 from-slate-50">
      <Navbar />
      <div className="container relative py-8 min-h-screen">
        {/* Locked Overlay */}
        {isLocked && (
          <div className="flex absolute inset-0 z-30 flex-col justify-center items-center rounded-3xl backdrop-blur-md bg-white/30">
            <div className="p-8 mx-4 max-w-md text-center bg-white rounded-2xl shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Lock className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900 font-outfit">
                Buka Analitik Lanjutan
              </h2>
              <p className="mb-8 text-gray-600 font-outfit">
                Dapatkan wawasan mendalam tentang performa twibbon Anda, tren
                pengunjung, dan lainnya dengan paket Kontributor kami.
              </p>
              <Link
                to="/membership"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-primary-600 rounded-xl transition-all hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5"
              >
                Tingkatkan ke Kontributor
              </Link>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-800 font-outfit">
            Analitik Lanjutan
          </h1>
          <p className="text-gray-600 font-outfit">
            Pantau performa twibbon Anda dengan wawasan mendalam
          </p>
        </div>

        {/* Filter Section */}
        <div className="p-6 mb-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex gap-3 items-center mb-4">
            <Calendar className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800 font-outfit">
              Periode Waktu
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 font-outfit">
                Tahun
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-3 w-full bg-white rounded-xl border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-outfit"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 font-outfit">
                Bulan (untuk Ringkasan)
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-3 w-full bg-white rounded-xl border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-outfit"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Twibbon */}
          <div className="p-6 text-white bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-xl backdrop-blur-sm bg-white/20">
                  <Layers size={24} />
                </div>
                <h3 className="text-lg font-semibold font-outfit">Twibbon</h3>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold font-outfit">
                {isLoadingSummary
                  ? "..."
                  : summary.total_twibbon.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-emerald-100 font-outfit">
              Total kampanye dibuat
            </p>
          </div>

          {/* Total Views */}
          <div className="p-6 text-white bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-xl backdrop-blur-sm bg-white/20">
                  <Eye size={24} />
                </div>
                <h3 className="text-lg font-semibold font-outfit">Dilihat</h3>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold font-outfit">
                {isLoadingSummary
                  ? "..."
                  : summary.total_views.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-purple-100 font-outfit">
              Total halaman dilihat
            </p>
          </div>

          {/* Total Supports */}
          <div className="p-6 text-white bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-xl backdrop-blur-sm bg-white/20">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-semibold font-outfit">Dukungan</h3>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold font-outfit">
                {isLoadingSummary
                  ? "..."
                  : summary.total_supports.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-blue-100 font-outfit">Total pendukung</p>
          </div>

          {/* Total Downloads */}
          <div className="p-6 text-white bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-xl backdrop-blur-sm bg-white/20">
                  <Download size={24} />
                </div>
                <h3 className="text-lg font-semibold font-outfit">Unduhan</h3>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold font-outfit">
                {isLoadingSummary
                  ? "..."
                  : summary.total_download.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-orange-100 font-outfit">Total unduhan</p>
          </div>
        </div>

        {/* Trends Graph */}
        <div className="p-6 mb-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex gap-3 items-center mb-6">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800 font-outfit">
              Tren Tahunan ({selectedYear})
            </h2>
          </div>
          <p className="mb-6 text-gray-600 font-outfit">
            Distribusi bulanan dilihat, dukungan, dan unduhan
          </p>
          <div className="w-full h-96">
            {isLoadingMonthly ? (
              <div className="flex justify-center items-center w-full h-full">
                <p className="text-gray-500 font-outfit">
                  Memuat data grafik...
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorSupports"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorDownloads"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#f97316"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: "12px", fontFamily: "Outfit" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "12px", fontFamily: "Outfit" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontFamily: "Outfit",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontFamily: "Outfit", paddingTop: "20px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                    name="Dilihat"
                  />
                  <Area
                    type="monotone"
                    dataKey="supports"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSupports)"
                    name="Dukungan"
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="#f97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDownloads)"
                    name="Unduhan"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdvanceAnalyticsPage;
