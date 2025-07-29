import React, { useState } from "react";
import LoginImage from "../assets/images/login_image.png";
import LogoGypem from "../assets/images/gypem_logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div id="root">
      <div className="grid items-center justify-center h-screen grid-cols-1 overflow-x-hidden md:grid-cols-2 lg:grid-cols-3">
        <img
          className="hidden object-cover w-full h-full col-span-1 lg:block"
          src={LoginImage}
          alt="Login"
        />

        <div className="flex flex-col col-span-3 px-4 py-16 overflow-auto lg:col-span-2 md:px-32 xl:px-52 md:py-20">
          <a href="/">
            <img
              src={LogoGypem}
              alt="Logo"
              className="block w-20 h-full mx-auto md:w-28 md:h-28"
            />
          </a>

          <form className="mt-10 md:mt-5">
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 capitalize"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  autoComplete="email"
                  className="block w-full p-3 mt-1 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 rounded-xl focus:bg-gray-100 bg-gray-50 focus:ring-purple-600"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 capitalize"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  className="block w-full p-3 mt-1 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 rounded-xl focus:bg-gray-100 bg-gray-50 focus:ring-purple-600"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button
                  type="button"
                  className="absolute z-10 p-2 text-gray-700 border border-gray-300 rounded-lg bg-zinc-50 end-1 bottom-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end my-5">
              <a href="#" className="text-sm text-purple-700 hover:underline">
                Lupa kata sandi?
              </a>
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-x-1 transition-smooth font-semibold bg-purple-700 text-white px-4 py-2.5 w-full rounded-xl hover:bg-purple-900"
              >
                Masuk
              </button>
            
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center w-full gap-3 px-4 py-3 mt-5 font-semibold text-gray-800 bg-white border border-gray-400 rounded-full shadow-sm hover:border-gray-100 hover:bg-gray-950 hover:text-white transition-smooth"
            >
              Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
