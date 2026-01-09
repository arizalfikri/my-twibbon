import { useTranslation } from 'react-i18next';
import Logo from '../../assets/images/Logo/Logo_putih.png';
import { Link } from 'react-router-dom';

function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="relative mt-auto text-white bg-primary-500 dark:bg-gray-900">
            {/* Top decorative wave */}
            <div className="absolute top-0 left-0 w-full overflow-hidden">
                <svg
                    className="relative block w-full h-16"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        fill="#ffffff"
                        fillOpacity="0.1"
                    ></path>
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative max-w-screen-lg px-4 py-16 mx-auto">
                {/* Top Section - Company Info Centered */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <img
                            src={Logo}
                            alt="MyTwibbon Logo"
                            className="object-contain w-56 h-20 md:w-72 drop-shadow-lg"
                        />
                    </div>
                </div>

                {/* Navigation Cards Layout */}
                <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Quick Links Card */}
                    <div className="p-6 transition-all duration-300 border rounded-2xl bg-primary-600 border-primary-400 hover:bg-primary-700 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700">
                        <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-white">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            {t('footer.navigation')}
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 text-sm text-white transition-colors duration-200 hover:text-yellow-400 group"
                                >
                                    <svg
                                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                    </svg>
                                    {t('footer.home')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/create"
                                    className="flex items-center gap-2 text-sm text-white transition-colors duration-200 hover:text-yellow-400 group"
                                >
                                    <svg
                                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    {t('footer.create_twibone')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/explore"
                                    className="flex items-center gap-2 text-sm text-white transition-colors duration-200 hover:text-yellow-400 group"
                                >
                                    <svg
                                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Explore
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account Card */}
                    <div className="p-6 transition-all duration-300 border rounded-2xl bg-primary-600 border-primary-400 hover:bg-primary-700 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700">
                        <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-white">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            {t('account')}
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/SignIn"
                                    className="flex items-center gap-2 text-sm text-white transition-colors duration-200 hover:text-yellow-400 group"
                                >
                                    <svg
                                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    {t('login')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/SignUp"
                                    className="flex items-center gap-2 text-sm text-white transition-colors duration-200 hover:text-yellow-400 group"
                                >
                                    <svg
                                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                                    </svg>
                                    {t('footer.register')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/membership"
                                    className="flex items-center gap-2 text-sm text-white transition-colors duration-200 hover:text-yellow-400 group"
                                >
                                    <svg
                                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Membership
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Card */}
                    <div className="p-6 transition-all duration-300 border rounded-2xl bg-primary-600 border-primary-400 hover:bg-primary-700 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 lg:col-span-2">
                        <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-white">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            {t('footer.our_location')}
                        </h3>
                        <div className="flex items-start gap-3 text-sm text-white">
                            <svg
                                className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <div className="leading-relaxed opacity-90">
                                <p className="mb-1 font-medium">
                                    {t('footer.address.building')}
                                </p>
                                <p>{t('footer.address.street')}</p>
                                <p>{t('footer.address.district')}</p>
                                <p>{t('footer.address.city_postal')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-primary-500 dark:border-gray-600">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="text-sm text-center text-white opacity-80 md:text-left">
                            <p>
                                {t('footer.copyright', {
                                    year: new Date().getFullYear(),
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <a
                                href="/privacy-policy"
                                className="text-sm text-white transition-colors duration-200 hover:text-yellow-400"
                            >
                                {t('footer.privacy_policy')}
                            </a>

                            <a
                                href={`https://wa.me/6285195910141`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white transition-colors duration-200 hover:text-yellow-400"
                            >
                                {t('footer.contact_us')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
