import React, { useState } from 'react';
import ModalAlert from '../../layout/ModalAlert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

function ModalLogin({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterClick = () => {
    onSwitchToRegister();
  };

  if (!isOpen) return null;

  return (
    <ModalAlert onClose={onClose}>
      <div className="w-full max-w-md p-6 mx-auto ">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Masuk ke Gypem
          </h2>
          <p className="text-gray-600">
            Masuk untuk posting foto twibbon Anda
          </p>
        </div>

        <form  className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Masukkan email Anda"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                className="w-full py-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Masukkan password Anda"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-sm text-purple-600 hover:underline">
              Lupa password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">atau</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            Belum punya akun?
          </p>
          <button
            type="button"
            onClick={handleRegisterClick}
            className="w-full px-4 py-3 font-medium text-purple-600 transition-colors border-2 border-purple-600 rounded-lg hover:bg-purple-50"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </ModalAlert>
  );
}

export default ModalLogin;