import InputWithLabel from '../components/FormControl/InputWithLabel';
import LoginImage from '../assets/images/Login_Image.svg';
import Logo from '../assets/images/logo/Logo_Icon.png';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../helper/store/global.store';
import { useModalStore } from '../helper/store/modal.store';
import { useNavigate, Link } from 'react-router-dom';
import { usePOST } from '../services/api';
import { useForm } from 'react-hook-form';
import { InputType } from '../components/FormControl';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '../helper/yup';

function ForgotPassword() {
    const { t } = useTranslation();
    const { openToast } = useModalStore();
    const token = localStorage.getItem('token');
    const { setEmail, setToken, setFullName, setRole } = useGlobalStore();
    const navigate = useNavigate();

    const { mutateAsync, isPending } = usePOST('/auth/forgot-password');

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(forgotPasswordSchema) });

    const onSubmit = async (data) => {
        try {
            let response;
            {
                response = await mutateAsync({
                    url: '/auth/forgot-password',
                    data: { email: data.email },
                });
            }
            console.log(response);
            if (response.status === 200) {
                openToast('toast', true, t('Silahkan Cek Email'), 'success');
            }
        } catch (error) {
            switch (error?.response.status) {
                case 401:
                    openToast(
                        'toast',
                        true,
                        t('auth.invalid_credentials'),
                        'info'
                    );
                    break;
                case 400:
                    openToast(
                        'toast',
                        true,
                        t('auth.not_registered'),
                        'warning'
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
                    alt={t('auth.login')}
                />
            </div>

            {/* Right Side - Scrollable Form */}
            <div className="flex-1 w-full overflow-y-auto bg-white lg:w-2/3 dark:bg-gray-900">
                <div className="flex flex-col min-h-full px-4 py-16 md:px-32 md:py-20">
                    <a href="/">
                        <img
                            src={Logo}
                            alt={t('common.logo')}
                            className="block w-20 h-full mx-auto md:w-28 md:h-28"
                        />
                    </a>

                    {/* Tombol kembali */}
                    <div className="">
                        <Link
                            to="/SignIn"
                            className="inline-block mt-10 text-sm font-medium rounded-lg text-primary-400 dark:hover:text-primary-400 hover:text-primary-800 transition-smooth"
                        >
                            ←{' '}
                            {t('common.back', {
                                defaultValue: 'Kembali Ke Login',
                            })}
                        </Link>
                    </div>
                    <div className="mt-4 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                            {t('auth.forgot_password_title', {
                                defaultValue: 'Kamu lupa password ?',
                            })}
                        </h2>
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                            {t('auth.forgot_password_description')}
                        </p>
                    </div>

                    <form
                        className="mt-6 md:mt-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col gap-5">
                            <InputWithLabel
                                htmlFor="email"
                                label={
                                    <span className="capitalize">
                                        {t('auth.email')}
                                    </span>
                                }
                                type={InputType.TEXT}
                                placeholder={t('auth.enter_email')}
                                name="email"
                                id="email"
                                style="rounded-xl"
                                control={control}
                                autoComplete="email"
                                error={errors}
                            />
                        </div>
                        <div className="flex flex-col gap-2 mt-4 md:flex-row">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="inline-flex items-center justify-center w-full gap-3 px-4 py-3 mt-5 font-semibold text-white rounded-full transition-smooth bg-primary-500 hover:bg-primary-600 disabled:opacity-50"
                            >
                                {isPending ? t('common.loading') : 'submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
