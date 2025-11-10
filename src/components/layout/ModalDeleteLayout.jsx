import { useTranslation } from "react-i18next";

export default function ModalDeleteLayout({ children }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-lg mx-auto overflow-hidden bg-white border border-gray-200 shadow-2xl dark:bg-gray-900 rounded-3xl dark:border-gray-700">
      {/* Header Section */}
      <div className="relative px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          {/* Icon Warning */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center border border-red-200 w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl dark:border-red-500/20">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23675 20.5467 2.53773 20.7239C2.83871 20.9011 3.18082 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.9011 21.4623 20.7239C21.7632 20.5467 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-1 text-left">
            <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
              {t("deletelayout.title")}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {t("deletelayout.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Button Section */}
      <div className="">
        {children}
      </div>
    </div>
  );
}