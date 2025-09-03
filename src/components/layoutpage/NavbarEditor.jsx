import React from "react";
import { X } from "lucide-react";
import ModalKeluarEditor from "../modal/modalKeluarEditor";
import { useModalStore } from "../../helper/store/modal.store";
import LogoGypem from "../../assets/images/gypem_logo_putih.png";

function NavbarEditor({ title }) {
  const { openModal } = useModalStore();

  const handleOpenExitModal = () => {
    openModal("modalLogout", true);
  };

  return (
    <>
      <nav className="bg-[#4C0D68] shadow-lg border-b border-purple-600/30">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop: Logo di kiri */}
            <div className="items-center hidden md:flex">
              <h1 className="flex items-center justify-center gap-3 text-lg font-semibold text-white truncate">
                <img
                  src={LogoGypem}
                  alt="Logo Gypem"
                  className="object-contain w-12 h-12"
                />
                {title}
              </h1>
            </div>

            {/* Mobile: Logo di tengah */}
            <div className="flex flex-1 md:hidden">
              <h1 className="flex items-center gap-2 text-base font-semibold text-white max-w-[300px] truncate">
                <img
                  src={LogoGypem}
                  alt="Logo Gypem"
                  className="object-contain w-8 h-8"
                />
                <span className="truncate">{title}</span>
              </h1>
            </div>

            {/* Desktop: Spacer untuk push exit button ke kanan */}
            <div className="flex-1 hidden md:flex"></div>

            {/* Exit Button - Selalu di kanan */}
            <div className="flex items-center">
              <button
                onClick={handleOpenExitModal}
                className="flex items-center justify-center p-2 text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700"
                aria-label="Exit"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Component */}
      <ModalKeluarEditor />
    </>
  );
}

export default NavbarEditor;
