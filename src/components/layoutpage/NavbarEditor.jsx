import React from "react";
import { X } from "lucide-react";
import ModalKeluarEditor from "../modal/modalKeluarEditor";
import { useModalStore } from "../../helper/store/modal.store";
import LogoGypem from "../../assets/images/gypem_logo_putih.png";

function NavbarEditor({ title, onExit, disableModalExit = false }) {
  const { openModal } = useModalStore();

  const handleExit = () => {
    if (disableModalExit && onExit) {
      onExit();
    } else {
      openModal("modalLogout", true);
    }
  };

  return (
    <>
      <nav className="bg-[#4C0D68] dark:bg-gray-900 shadow-lg border-b border-purple-600/30 dark:border-gray-700">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop */}
            <div className="items-center hidden md:flex">
              <h1 className="flex items-center justify-center gap-3 text-lg font-semibold text-white truncate dark:text-gray-100">
                <img
                  src={LogoGypem}
                  alt="Logo Gypem"
                  className="object-contain w-12 h-12"
                />
                {title}
              </h1>
            </div>

            {/* Mobile */}
            <div className="flex flex-1 md:hidden">
              <h1 className="flex items-center gap-2 text-base font-semibold text-white dark:text-gray-100 max-w-[300px] truncate">
                <img
                  src={LogoGypem}
                  alt="Logo Gypem"
                  className="object-contain w-8 h-8"
                />
                <span className="truncate">{title}</span>
              </h1>
            </div>

            {/* Exit */}
            <div className="flex items-center">
              <button
                onClick={handleExit}
                className="flex items-center justify-center p-2 text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                aria-label="Exit"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {!disableModalExit && <ModalKeluarEditor />}
    </>
  );
}

export default NavbarEditor;
