import { useNavigate } from 'react-router-dom';
import iconFrame from '../../assets/images/icon/icon_frame.svg';
import iconBackground from '../../assets/images/icon/icon_background.svg';
import Kartini from '../../assets/images/BannerScroll/Kartini-Scroll.png';
import LOF6 from '../../assets/images/BannerScroll/LOF6-Scroll.webp';
import Pahlawan from '../../assets/images/BannerScroll/Pahlawan-Scroll.png';
import NatalBG from '../../assets/images/BannerScroll/Natal_Bg.png';
import ltbg from '../../assets/images/BannerScroll/Lt_bg.png';
import MuhaBg from '../../assets/images/BannerScroll/Muha_bg.png';

export default function ModalTwibbonChoice({ open, onClose }) {
    const navigate = useNavigate();
    if (!open) return null;

    return (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50 md:px-4">
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
                    className="absolute top-4 right-4 z-10 p-2 rounded-lg transition md:hidden hover:bg-gray-100"
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
                <div className="hidden justify-between items-center mb-6 md:flex">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Mau membuat apa?
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg transition hover:bg-gray-100"
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

                <p className="mx-auto mb-8 max-w-lg text-sm text-center text-gray-500 md:text-base">
                    Bikin Twibbon online makin menarik, bukan hanya dengan
                    frame, tetapi juga background kreatif.
                </p>

                {/* Options */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Frame Twibbon */}
                    <button
                        onClick={() => navigate('/create/frame')}
                        className="flex flex-col items-center gap-4 p-6 transition-all border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg hover:scale-[1.02]"
                    >
                        <div className="flex justify-center items-center w-20 h-20 rounded-2xl bg-primary-500/10">
                            <img
                                src={iconFrame}
                                alt="Frame Icon"
                                className="w-12 h-12"
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800">
                            Frame Twibbon
                        </h3>
                        <p className="text-sm text-center text-gray-500">
                            Twibbon klasik berupa frame yang ditempel di foto
                            kamu
                        </p>

                        {/* Sample Images - Square dengan efek menarik */}
                        <div className="flex gap-3 mt-2">
                            <div className="relative group">
                                <img
                                    src={Kartini}
                                    alt="Sample frame 1"
                                    className="object-cover w-14 h-14 rounded-lg shadow-md transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-lg opacity-0 transition-opacity from-black/20 group-hover:opacity-100" />
                            </div>
                            <div className="relative group">
                                <img
                                    src={LOF6}
                                    alt="Sample frame 2"
                                    className="object-cover w-14 h-14 rounded-lg shadow-md transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-lg opacity-0 transition-opacity from-black/20 group-hover:opacity-100" />
                            </div>
                            <div className="relative group">
                                <img
                                    src={Pahlawan}
                                    alt="Sample frame 3"
                                    className="object-cover w-14 h-14 rounded-lg shadow-md transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-lg opacity-0 transition-opacity from-black/20 group-hover:opacity-100" />
                            </div>
                        </div>
                    </button>

                    {/* Background Twibbon */}
                    <button
                        onClick={() => navigate('/create/background')}
                        className="relative flex flex-col items-center gap-4 p-6 transition-all border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg hover:scale-[1.02]"
                    >
                        <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r rounded-full shadow-sm from-primary-500 to-primary-600">
                            Baru!
                        </span>

                        <div className="flex justify-center items-center w-20 h-20 rounded-2xl bg-primary-500/10">
                            <img
                                src={iconBackground}
                                alt="Background Icon"
                                className="w-12 h-12"
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800">
                            Background Twibbon
                        </h3>
                        <p className="text-sm text-center text-gray-500">
                            Variasi baru Twibbon berupa gambar background di
                            belakang foto kamu
                        </p>

                        {/* Sample Images - Square dengan efek menarik */}
                        <div className="flex gap-3 mt-2">
                            <div className="relative group">
                                <img
                                    src={NatalBG}
                                    alt="Sample background 1"
                                    className="object-cover w-14 h-14 rounded-lg shadow-md transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-lg opacity-0 transition-opacity from-black/20 group-hover:opacity-100" />
                            </div>
                            <div className="relative group">
                                <img
                                    src={ltbg}
                                    alt="Sample background 2"
                                    className="object-cover w-14 h-14 rounded-lg shadow-md transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-lg opacity-0 transition-opacity from-black/20 group-hover:opacity-100" />
                            </div>
                            <div className="relative group">
                                <img
                                    src={MuhaBg}
                                    alt="Sample background 3"
                                    className="object-cover w-14 h-14 rounded-lg shadow-md transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t to-transparent rounded-lg opacity-0 transition-opacity from-black/20 group-hover:opacity-100" />
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <button
                    onClick={onClose}
                    className="w-full py-3.5 mt-8 font-medium text-gray-600 transition-all border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                >
                    Batal
                </button>
            </div>
        </div>
    );
}
