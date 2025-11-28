import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, AlertCircle } from 'lucide-react';

function EwalletPage() {
const { referer } = useParams();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirectToDeeplink = () => {
      try {
        const deeplink = localStorage.getItem('payment_deeplink');
        
        if (deeplink) {
          // Redirect setelah delay kecil untuk UX yang lebih baik
          setTimeout(() => {
            window.location.href = deeplink;
          }, 1000);
        } else {
          setError('Link pembayaran tidak ditemukan');
          setRedirecting(false);
        }
      } catch (err) {
        setError('Terjadi kesalahan saat mengarahkan ke pembayaran');
        setRedirecting(false);
        console.error('Redirect error:', err);
      }
    };

    redirectToDeeplink();
  }, []);

  const handleManualRedirect = () => {
    const deeplink = localStorage.getItem('payment_deeplink');
    if (deeplink) {
      window.location.href = deeplink;
    }
  };

  if (redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary-500"></div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Mengarahkan ke QRIS...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Membuka aplikasi pembayaran Anda
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md p-6 text-center bg-white shadow-lg dark:bg-gray-800 rounded-xl">
          <div className="flex justify-center mb-4">
            <AlertCircle className="text-red-500" size={48} />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Gagal Mengarahkan
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleManualRedirect}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600"
            >
              <ExternalLink size={18} />
              Coba Buka Link Manual
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full px-4 py-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Kembali ke Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default EwalletPage;