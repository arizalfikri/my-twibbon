import React from "react";
import Skeleton from "../common/Skeleton";

const CheckoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container py-10 mx-auto px-4">
        {/* Title and Subtitle */}
        <div className="mb-8 space-y-2">
          <Skeleton variant="text" height="2.5rem" width="30%" />
          <Skeleton variant="text" height="1rem" width="50%" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
              <Skeleton variant="text" height="1.5rem" width="40%" />

              {/* Premium Card Placeholder */}
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-3">
                <Skeleton variant="text" height="1.25rem" width="60%" />
                <Skeleton variant="text" height="0.875rem" width="80%" />
                <Skeleton variant="text" height="0.875rem" width="70%" />
              </div>

              {/* Payment Methods Placeholder */}
              <div className="space-y-4 pt-4">
                <Skeleton variant="text" height="1.25rem" width="30%" />
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height="4rem"
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
              <Skeleton variant="text" height="1.5rem" width="60%" />

              {/* Details List */}
              <div className="py-4 space-y-4 border-y border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <Skeleton variant="text" height="1rem" width="40%" />
                  <Skeleton variant="text" height="1rem" width="30%" />
                </div>
                <div className="flex justify-between">
                  <Skeleton variant="text" height="1rem" width="40%" />
                  <Skeleton variant="text" height="1rem" width="30%" />
                </div>
                <div className="flex justify-between">
                  <Skeleton variant="text" height="1rem" width="40%" />
                  <Skeleton variant="text" height="1rem" width="30%" />
                </div>
              </div>

              {/* Total and Buttons */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton variant="text" height="1rem" width="30%" />
                  <Skeleton
                    variant="rectangular"
                    height="1.5rem"
                    width="60px"
                    className="rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton variant="text" height="1.25rem" width="40%" />
                  <Skeleton variant="text" height="1.5rem" width="50%" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton
                  variant="rectangular"
                  height="3.5rem"
                  className="rounded-lg"
                />
                <div className="flex justify-center">
                  <Skeleton variant="text" height="1rem" width="10%" />
                </div>
                <Skeleton
                  variant="rectangular"
                  height="3.5rem"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutSkeleton;
