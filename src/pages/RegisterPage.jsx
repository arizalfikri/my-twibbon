import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import LogoGypem from '../assets/images/gypem_logo.png';
import LoginImage from '../assets/images/login_image.png';
import { Eye, EyeOff } from 'lucide-react';

function RegisterPage() {
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetch('/data/provinces.json')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error("Error ambil provinsi", err));
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const forms = [
        {
            id: "nama-lengkap",
            label: "Nama Lengkap",
            type: "text",
            placeholder: "Nama Lengkap",
        },
        {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "*******",
        },
        {
            id: "confirm-password",
            label: "Konfirmasi Password",
            type: "password",
            placeholder: "*******",
        }
    ];

    const renderInput = ({ id, label, type, placeholder, options }) => {
        const baseClasses = "block w-full p-3 mt-1 text-sm text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:bg-gray-100 focus:ring-purple-600";
        
        if (type === "password") {
            return (
                <div key={id} className="relative mb-3">
                    <label htmlFor={id} className='text-sm font-medium text-gray-700 capitalize'>
                        {label}
                    </label>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        id={id} 
                        name={id} 
                        placeholder={placeholder}
                        className={baseClasses}
                    />
                    <button 
                        type='button' 
                        className='absolute z-10 p-2 text-gray-700 border border-gray-300 rounded-lg bg-zinc-50 end-1 bottom-1' 
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            );
        }

        return (
            <div key={id} className="mb-3">
                <label htmlFor={id} className='text-sm font-medium text-gray-700 capitalize'>
                    {label}
                </label>
                {type === "select" ? (
                    <select id={id} name={id} className={baseClasses}>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : type === "textarea" ? (
                    <textarea 
                        id={id} 
                        name={id} 
                        placeholder={placeholder}
                        className={baseClasses}
                        style={{ height: '100px' }}
                    />
                ) : (
                    <input 
                        type={type} 
                        id={id} 
                        name={id} 
                        placeholder={placeholder}
                        className={baseClasses}
                    />
                )}
            </div>
        );
    };

    return (
        <div id='root'>
            <div className='grid h-screen grid-cols-1 overflow-x-hidden md:grid-cols-2 lg:grid-cols-3'>
                <img className='hidden object-cover w-full h-full col-span-1 lg:block' src={LoginImage} alt='Login' />
                <div className='flex flex-col col-span-3 px-4 py-16 overflow-auto lg:col-span-2 md:px-32 xl:px-52 md:py-20'>
                    <a href="/">
                        <img src={LogoGypem} alt="Logo" className='block w-20 h-full mx-auto md:w-28 md:h-28' />
                    </a>

                    <form className='mt-10 md:mt-5'>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <div className="flex flex-col gap-3 mt-10 md:gap-5 md:mt-5">
                                {forms.map(renderInput)}
                            </div>
                        </motion.div>

                        <div className='flex flex-col gap-2 mt-8 md:flex-row'>
                            <button type="button" className='inline-flex items-center justify-center gap-x-1 transition-smooth font-semibold bg-purple-700 text-white px-4 py-2.5 w-full rounded-xl hover:bg-purple-900'>
                                Daftar
                            </button>
                        </div>
                    </form>

                    <div className='mt-3 text-sm text-center'>
                        <p className='text-gray-400'>Sudah punya akun? <a href="/login" className='font-medium text-purple-700 underline'>Masuk</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;