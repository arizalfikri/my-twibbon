import React, { useState } from "react";
import LoginImage from "../assets/images/login_image.png";
import LogoGypem from "../assets/images/gypem_logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePOST } from "../services/api";
import { useGlobalStore } from "../helper/store/global.store";
import { useModalStore } from "../helper/store/modal.store";
import InputWithLabel from "../components/FormControl/InputWithLabel";
import { q } from "motion/react-client";
import { useForm } from "react-hook-form";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { openToast } = useModalStore();
  const { setEmail: setGlobalEmail, setToken } = useGlobalStore();
  const {
     control,
     formState: { errors },
   } = useForm()
  const navigate = useNavigate();
  const { mutateAsync, isPending } = usePOST("/auth/login");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    mutateAsync({ url: "/auth/login", data: { email, password } })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("email", response.data.user.email);
          setGlobalEmail(response.data.user.email);
          setToken(response.data.token);
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          openToast("toast", true, "Akun tidak terdaftar");
        } else {
          openToast("toast", true, "Kesalahan Server");
        }
      });
  };

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

          <form className="mt-10 md:mt-5" onSubmit={handleOnSubmit}>
            <div className="flex flex-col gap-5">
              <InputWithLabel
                htmlFor="email"
                label={<span className="capitalize">Email</span>}
                type="text"
                placeholder="Masukkan email"
                name="email"
                id="email"
                value={email}
                style="rounded-xl"
                control={control}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <InputWithLabel
                  htmlFor="password"
                  label={<span className="capitalize">Password</span>}
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  name="password"
                  id="password"
                  value={password}
                  style="rounded-xl"
                  control={control}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute z-10 p-2 text-gray-700 border border-gray-300 rounded-lg bg-zinc-50 end-1 bottom-2"
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
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-x-1 transition-smooth font-semibold bg-purple-700 text-white px-4 py-2.5 w-full rounded-xl hover:bg-purple-900 disabled:opacity-50"
              >
                {isPending ? "Loading..." : "Masuk"}
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

export default SignIn;
