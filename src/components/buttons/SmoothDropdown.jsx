import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const SmoothDropdown = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  // klik di luar dropdown => tutup
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative md:w-40" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full px-4 py-2 transition-all bg-white border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 "
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm capitalize">
          {options.find((op) => op.value === value)?.label}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 z-50 w-full mt-1 overflow-hidden bg-white border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 rounded-xl animate-fade-slide"
        >
          {options.map((op) => (
            <div
              key={op.value}
              className={`px-4 py-2 text-sm cursor-pointer transition-all
                ${
                  value === op.value
                    ? "bg-primary-400 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
              onClick={() => handleSelect(op.value)}
            >
              {op.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default SmoothDropdown