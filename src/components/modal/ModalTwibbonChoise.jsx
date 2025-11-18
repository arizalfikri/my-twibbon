import { useNavigate } from "react-router-dom";

export default function ModalTwibbonChoice({ open, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 md:px-4">
      {/* Wrapper → mobile full-screen */}
      <div
        className="
          bg-white shadow-xl md:rounded-2xl animate-fadeIn 
          p-6 md:p-10
          w-full md:max-w-2xl
          h-[100dvh] md:h-auto 
          rounded-none 
          overflow-y-auto md:overflow-visible
          relative
        "
      >
        {/* X untuk mobile (pojok kanan atas) */}
        <button 
          onClick={onClose} 
          className="absolute z-10 p-2 transition rounded-lg md:hidden top-4 right-4 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-700"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header Desktop */}
        <div className="items-center justify-between hidden mb-6 md:flex">
          <h2 className="text-xl font-semibold text-gray-800">
            Mau membuat apa?
          </h2>
          <button 
            onClick={onClose}
            className="p-2 transition rounded-lg hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-500 hover:text-gray-700"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Header Mobile */}
        <div className="pt-8 mb-6 md:hidden">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Mau membuat apa?
          </h2>
        </div>

        <p className="max-w-lg mx-auto mb-8 text-sm text-center text-gray-500 md:text-base">
          Bikin Twibbon online makin menarik, bukan hanya dengan frame, tetapi
          juga background kreatif.
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Frame Twibbon */}
          <button
            onClick={() => navigate("/create/frame")}
            className="flex flex-col items-center gap-3 p-6 transition border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-md"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10">
              {/* SVG Frame Icon - Lebih jelas */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 10h10M7 14h10" />
                <circle cx="12" cy="12" r="3" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              Frame Twibbon
            </h3>
            <p className="text-sm text-center text-gray-500">
              Twibbon klasik berupa frame yang ditempel di foto kamu
            </p>

            <div className="flex gap-2 mt-3">
              <img src="/sample/frame1.jpg" alt="Sample frame 1" className="object-cover w-12 h-10 rounded-md" />
              <img src="/sample/frame2.jpg" alt="Sample frame 2" className="object-cover w-12 h-10 rounded-md" />
              <img src="/sample/frame3.jpg" alt="Sample frame 3" className="object-cover w-12 h-10 rounded-md" />
            </div>
          </button>

          {/* Background Twibbon */}
          <button
            onClick={() => navigate("/create/background")}
            className="relative flex flex-col items-center gap-3 p-6 transition border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-md"
          >
            <span className="absolute px-2 py-1 text-xs font-semibold text-white rounded-md bg-primary-500 top-3 right-3">
              Baru!
            </span>

            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10">
              {/* SVG Background Icon - Lebih jelas */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 21V9" />
                <circle cx="15" cy="15" r="2" fill="currentColor" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              Background Twibbon
            </h3>
            <p className="text-sm text-center text-gray-500">
              Variasi baru Twibbon berupa gambar background di belakang foto
              kamu
            </p>

            <div className="flex gap-2 mt-3">
              <img src="/sample/bg1.jpg" alt="Sample background 1" className="object-cover w-12 h-10 rounded-md" />
              <img src="/sample/bg2.jpg" alt="Sample background 2" className="object-cover w-12 h-10 rounded-md" />
              <img src="/sample/bg3.jpg" alt="Sample background 3" className="object-cover w-12 h-10 rounded-md" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 mt-8 font-medium text-gray-600 transition border-2 border-gray-200 rounded-xl hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </div>
  );
}