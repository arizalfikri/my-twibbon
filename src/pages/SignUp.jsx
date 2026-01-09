import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Logo from '../assets/images/Logo/Logo_Icon.png';
import LoginImage from '../assets/images/login_image.svg';
import InputWithLabel from '../components/FormControl/InputWithLabel';
import InputPassword from '../components/FormControl/InputPassword';
import { useForm } from 'react-hook-form';
import { InputType } from '../components/FormControl';
import { usePOST } from '../services/api';
import { useModalStore } from '../helper/store/modal.store';
import { useNavigate, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '../helper/yup';

function SignUp() {
    const { t } = useTranslation();
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { openToast } = useModalStore();
    const { mutateAsync, isPending } = usePOST('/auth/register');
    const [selectedRole, setSelectedRole] = useState(null);

    // Ambil data dari state navigasi
    const { googleUser, fromGoogle } = location.state || {};

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signUpSchema),
        defaultValues: {
            fullname: googleUser?.name || '',
            email: googleUser?.email || '',
        },
    });

    // Auto-fill form jika ada data dari Google
    useEffect(() => {
        if (googleUser) {
            setValue('fullname', googleUser.name);
            setValue('email', googleUser.email);
        }
    }, [googleUser, setValue]);

    const forms = [
        {
            id: 'fullname',
            label: t('auth.full_name'),
            type: InputType.TEXT,
            placeholder: t('auth.enter_full_name'),
        },
        {
            id: 'email',
            label: t('auth.email'),
            type: InputType.EMAIL,
            placeholder: t('auth.enter_email'),
        },
        {
            id: 'password',
            label: t('auth.password'),
            type: InputType.PASSWORD,
            placeholder: '*******',
        },
        {
            id: 'confirm_password',
            label: t('auth.confirm_password'),
            type: InputType.PASSWORD,
            placeholder: '*******',
        },
    ];

    const handleOnSubmit = async (data) => {
        const { confirm_password, ...rest } = data;

        try {
            const response = await mutateAsync({
                url: '/auth/register',
                data: { ...rest, role: 'participant' },
            });

            if (response.status === 201) {
                if (fromGoogle) {
                    openToast(
                        'toast',
                        true,
                        'Pendaftaran berhasil! Silakan login dengan Google.',
                        'success'
                    );
                } else {
                    openToast(
                        'toast',
                        true,
                        t('auth.register_success'),
                        'success'
                    );
                }
                navigate('/signin');
            }
        } catch (error) {
            switch (error.status) {
                case 401:
                case 409:
                    openToast(
                        'toast',
                        true,
                        t('auth.email_already_registered')
                    );
                    break;
                default:
                    openToast('toast', true, t('auth.server_error'));
                    break;
            }
        }
    };

    return (
        <div id="root" className="flex w-screen h-screen overflow-hidden">
            {/* Left Side - Fixed Image */}
            <div className="flex-shrink-0 hidden w-1/2 bg-white lg:flex dark:bg-gray-900">
                <img
                    className="object-cover w-full h-full"
                    src={LoginImage}
                    alt={t('auth.login_image')}
                />
            </div>

            {/* Right Side - Scrollable Form */}
            <div className="flex-1 w-full overflow-y-auto text-gray-800 bg-white lg:w-2/3 dark:bg-gray-900 dark:text-gray-100">
                <div className="flex flex-col min-h-full px-4 py-16 md:px-32 md:py-20">
                    <a href="/">
                        <img
                            src={Logo}
                            alt={t('common.logo')}
                            className="block w-20 h-full mx-auto md:w-28 md:h-28"
                        />
                    </a>

                    {/* Info banner jika dari Google */}
                    {fromGoogle && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 mt-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300"
                        >
                            <p>
                                Informasi dari akun Google Anda telah diisi
                                otomatis. Silakan lengkapi password untuk
                                menyelesaikan pendaftaran.
                            </p>
                        </motion.div>
                    )}

                    <form
                        className="mt-10 md:mt-5"
                        onSubmit={handleSubmit(handleOnSubmit)}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <div className="flex flex-col gap-3 mt-10 md:gap-5 md:mt-5">
                                {forms.map(
                                    ({
                                        id,
                                        label,
                                        type,
                                        placeholder,
                                        disabled,
                                    }) =>
                                        type === 'password' ? (
                                            <InputPassword
                                                key={id}
                                                htmlFor={id}
                                                label={label}
                                                type={type}
                                                placeholder={placeholder}
                                                id={id}
                                                name={id}
                                                control={control}
                                                error={errors}
                                            />
                                        ) : (
                                            <InputWithLabel
                                                key={id}
                                                htmlFor={id}
                                                label={label}
                                                type={type}
                                                placeholder={placeholder}
                                                id={id}
                                                name={id}
                                                control={control}
                                                error={errors}
                                                disabled={disabled}
                                            />
                                        )
                                )}
                            </div>
                        </motion.div>

                        <div className="flex flex-col gap-2 mt-8 md:flex-row">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="inline-flex items-center justify-center w-full gap-3 px-4 py-3 mt-5 font-semibold text-white rounded-full transition-smooth bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
                            >
                                {isPending
                                    ? t('auth.registering')
                                    : t('auth.register')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-3 text-sm text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('auth.already_have_account')}{' '}
                            <a
                                href="/SignIn"
                                className="font-medium underline text-primary-700 dark:text-primary-400"
                            >
                                {t('auth.login')}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
