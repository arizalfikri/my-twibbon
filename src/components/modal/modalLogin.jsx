import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalAlert from "../../layout/ModalAlert";
import { Eye, EyeOff, Mail, Lock, Users, UserCheck, X } from "lucide-react";
import { useModalStore } from "../../helper/store/modal.store";
import { useGlobalStore } from "../../helper/store/global.store";
import { usePOST } from "../../services/api";
import { useForm } from "react-hook-form";
import InputPassword from "../FormControl/InputPassword";
import InputWithLabel from "../FormControl/InputWithLabel";
import { InputType } from "../FormControl";

export default function ModalLogin({ isOpen, onClose }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { openToast } = useModalStore();
  const { setToken, setEmail } = useGlobalStore();
  const navigate = useNavigate();

  const coordinatorLogin = usePOST("/auth/login");
  const participantLogin = usePOST("/auth/login-participant");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!selectedRole) {
      openToast("toast", true, "Silakan pilih peran terlebih dahulu");
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (selectedRole === "coordinator") {
        response = await coordinatorLogin.mutateAsync({
          url: "/auth/login",
          data: { email: data.email, password: data.password },
        });
      } else if (selectedRole === "participant") {
        response = await participantLogin.mutateAsync({
          url: "/auth/login-participant",
          data: { email: data.email, password: data.password },
        });
      }

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        setToken(response.data.token);
        setEmail(response.data.email);
        onClose();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        openToast("toast", true, "Email atau password tidak valid");
      } else {
        openToast("toast", true, "Terjadi kesalahan pada server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalAlert onClose={onClose}>
      <div className="relative w-full max-w-md p-6 mx-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute p-1 text-gray-500 transition-colors top-4 right-4 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Masuk ke Gypem
        </h2>

        {/* Role Selection */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("coordinator")}
            className={`flex items-center px-4 py-2 border rounded-lg transition ${
              selectedRole === "coordinator"
                ? "bg-purple-50 border-purple-600 text-purple-700"
                : "border-gray-300 text-gray-600 hover:border-purple-400"
            }`}
          >
            <UserCheck size={20} className="mr-2" />
            Koordinator
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("participant")}
            className={`flex items-center px-4 py-2 border rounded-lg transition ${
              selectedRole === "participant"
                ? "bg-purple-50 border-purple-600 text-purple-700"
                : "border-gray-300 text-gray-600 hover:border-purple-400"
            }`}
          >
            <Users size={20} className="mr-2" />
            Peserta
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <InputWithLabel
            htmlFor="email"
            label={<span className="capitalize">Email</span>}
            type={InputType.TEXT}
            placeholder="Masukkan email"
            name="email"
            id="email"
            style="rounded-xl"
            control={control}
            autoComplete="email"
            disabled={!selectedRole}
          />

          {/* Password Input */}
          <div className="relative">
            <InputPassword
              htmlFor="password"
              label="password"
              type={InputType.PASSWORD}
              placeholder="******"
              name="password"
              id="password"
              control={control}
              error={errors}
              disabled={!selectedRole}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isLoading
              ? "Loading..."
              : selectedRole
              ? `Masuk sebagai ${
                  selectedRole === "coordinator" ? "Koordinator" : "Peserta"
                }`
              : "Masuk"}
          </button>
        </form>
      </div>
    </ModalAlert>
  );
}