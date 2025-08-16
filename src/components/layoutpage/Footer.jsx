import React from 'react'
import LogoGypem from '../../assets/images/gypem_logo.png';
function Footer() {
    return (
        <footer className="bg-[#4C0D68] w-full">
            <div className="px-4 py-8 mx-auto text-white max-w-screen-2xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    <div className="text-xs font-normal leading-loose md:text-sm">
                        <img src={LogoGypem} alt="Gypem" className="w-[61px] h-[59px]" />
                        <span className="flex items-center gap-1 mt-5">
                            Powered By
                            <p className="ml-1 font-semibold">Digital Edu Indonesia</p>
                        </span>
                        <p className="mt-5 font-light">
                            Gedung Jaya Lantai 9 Blok A02 Jl. M.H. Thamrin No. 12 RT 002/001, Kel. Kebon Sirih, Kec. Menteng, Jakarta Pusat 10340
                        </p>
                    </div>


                    <div>
                        <h5 className="mb-3 font-semibold">Navigasi</h5>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-xs font-normal transition-all duration-200 hover:font-semibold">Beranda</a></li>
                            <li><a href="/create" className="text-xs font-normal transition-all duration-200 hover:font-semibold">Create Twibone</a></li>
                          
                        </ul>
                    </div>


                    <div>
                        <h5 className="mb-3 font-semibold">Lainnya</h5>
                        <ul className="space-y-2">
                            <li><a href="/SignIn" className="text-xs font-normal transition-all duration-200 hover:font-semibold">Login</a></li>
                            <li><a href="/SignUp" className="text-xs font-normal transition-all duration-200 hover:font-semibold">Daftar</a></li>
                          
                        </ul>
                    </div>
                    
                </div>
            </div>
        </footer>


    )
}

export default Footer
