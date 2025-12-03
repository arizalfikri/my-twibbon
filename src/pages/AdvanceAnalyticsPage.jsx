import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { useGET } from "../services/api";

function AdvanceAnalyticsPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Fetch Monthly Analytics for the Chart (Yearly view broken down by month)
  const { data: monthlyAnalyticsData, isLoading: isLoadingMonthly } = useGET(
    `/contributor/analytics/monthly?year=${selectedYear}`
  );

  // Fetch Summary Analytics for the Cards (Specific Month view)
  const { data: summaryData, isLoading: isLoadingSummary } = useGET(
    `/contributor/summary?month=${selectedMonth}&year=${selectedYear}`
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

  const years = Array.from({ length:5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br via-blue-50 to-indigo-50 from-slate-50">
      <Navbar />
      <div className="container py-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-800 font-outfit">
            Advanced Analytics
          </h1>
          <p className="text-gray-600 font-outfit">
            Monitor your campaign performance with detailed insights
          </p>
        </div>

        {/* Filter Section */}
        <div className="p-6 mb-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex gap-3 items-center mb-4">
            <Calendar className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800 font-outfit">
              Time Period
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 font-outfit">
                Year
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
                Month (for Summary Cards)
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
                <h3 className="text-lg font-semibold font-outfit">Twibbons</h3>
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
              Total campaigns created
            </p>
          </div>

          {/* Total Views */}
          <div className="p-6 text-white bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-xl backdrop-blur-sm bg-white/20">
                  <Eye size={24} />
                </div>
                <h3 className="text-lg font-semibold font-outfit">Views</h3>
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
              Total page views
            </p>
          </div>

          {/* Total Supports */}
          <div className="p-6 text-white bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-xl backdrop-blur-sm bg-white/20">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-semibold font-outfit">Supports</h3>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold font-outfit">
                {isLoadingSummary
                  ? "..."
                  : summary.total_supports.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-blue-100 font-outfit">
              Total supporters
            </p>
          </div>

          {/* Total Downloads */}
          <div className="p-6 text-white bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3 items-center">
                <div className="p-3 rounded-xl backdrop-blur-sm bg-white/20">
                  <Download size={24} />
                </div>
                <h3 className="text-lg font-semibold font-outfit">Downloads</h3>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold font-outfit">
                {isLoadingSummary
                  ? "..."
                  : summary.total_download.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-orange-100 font-outfit">
              Total downloads
            </p>
          </div>
        </div>

        {/* Trends Graph */}
        <div className="p-6 mb-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex gap-3 items-center mb-6">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800 font-outfit">
              Yearly Trends ({selectedYear})
            </h2>
          </div>
          <p className="mb-6 text-gray-600 font-outfit">
            Monthly distribution of views, supports, and downloads
          </p>
          <div className="w-full h-96">
            {isLoadingMonthly ? (
              <div className="flex justify-center items-center w-full h-full">
                <p className="text-gray-500 font-outfit">
                  Loading chart data...
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
                    name="Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="supports"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSupports)"
                    name="Supports"
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="#f97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDownloads)"
                    name="Downloads"
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
