import React, { useState } from "react";
import Navbar from "../components/layoutpage/Navbar";

function CheckoutPage() {
  const [plan, setPlan] = useState("annual");

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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* LEFT CARD */}
          <div className="p-6 text-white shadow-lg bg-gradient-to-br to-[#7ecd67] from-[#11cefe] rounded-xl h-fit">
            <h2 className="mb-4 text-2xl font-semibold">Premium Supporter</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                ✅ Remove Watermark for your own account
              </li>
              <li className="flex items-center gap-2">
                ✅ Use Twibbonize without Ads
              </li>
            </ul>
          </div>

          {/* RIGHT CARD */}
          <div className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
            <h3 className="mb-4 text-lg font-semibold">Billing Option</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-purple-500">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    checked={plan === "monthly"}
                    onChange={() => setPlan("monthly")}
                  />
                  <span>Pay Monthly</span>
                </div>
                <span>Rp15,000 / Month</span>
              </label>

              <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-purple-500">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    checked={plan === "6months"}
                    onChange={() => setPlan("6months")}
                  />
                  <span>Pay 6 Months</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Rp35,000 / 6 Months</span>
                  <span className="px-2 py-1 text-xs text-black bg-yellow-400 rounded">
                    Save 62%
                  </span>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-purple-500">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    checked={plan === "annual"}
                    onChange={() => setPlan("annual")}
                  />
                  <span>Pay Annual</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Rp55,000 / Year</span>
                  <span className="px-2 py-1 text-xs text-black bg-yellow-400 rounded">
                    Save 70%
                  </span>
                </div>
              </label>
            </div>

            {/* Price and Button */}
            <div className="mt-6">
              <p className="text-xl font-bold">
                {plan === "monthly" && "Rp15,000 / Month"}
                {plan === "6months" && "Rp35,000 / 6 Months"}
                {plan === "annual" && "Rp55,000 / Year"}
              </p>
              <button className="w-full py-3 mt-4 font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600">
                Upgrade →
              </button>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                We’ll bill you every {plan === "monthly" ? "Month" : plan === "6months" ? "6 Months" : "Year"}, unless you cancel.
                You can cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CheckoutPage;
