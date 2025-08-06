import React from "react";
import { X } from "lucide-react";
import ModalKeluarEditor from "../modal/modalKeluarEditor";
import { useModalStore } from "../../helper/store/modal.store";
function NavbarEditor({title}) {
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
              <h1 className="text-lg font-semibold text-white truncate">
                {title}
              </h1>
            </div>

            {/* Mobile: Logo di tengah */}
            <div className="flex flex-1 md:hidden">
              <h1 className="text-base font-semibold text-white ">
                {title}
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
