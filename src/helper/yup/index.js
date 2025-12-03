import * as yup from "yup";
import i18n from "../../i18n";

// Helper function to get translated messages
const t = (key, options = {}) => i18n.t(key, options);

export const signInSchema = yup.object({
    email: yup.string().required(() => t('validation.email_required')),
    password: yup
        .string()
        .required(() => t('validation.password_required'))
        .min(6, () => t('validation.password_min_length', { min: 6 })),
});

export const signUpSchema = yup.object({
    fullname: yup.string().required(() => t('validation.fullname_required')),
    email: yup.string().required(() => t('validation.email_required')),
    password: yup
        .string()
        .required(() => t('validation.password_required'))
        .min(6, () => t('validation.password_min_length', { min: 6 })),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("password"), null], () => t('validation.password_confirmation_mismatch'))
        .min(6, () => t('validation.password_min_length', { min: 6 }))
        .required(() => t('validation.password_confirmation_required')),
});

export const forgotPasswordSchema = yup.object({
    email: yup.string().required(() => t('validation.email_required')),
});

export const createTwiboneSchema = (uploadType = "frame") => {
    // Allowed types based on upload type
    const allowedTypes = uploadType === "frame"
        ? ["image/png", "image/webp"] // frame harus transparan
        : ["image/png", "image/jpeg", "image/jpg", "image/webp"]; // background bisa semua

    return yup.object({
        title: yup.string().required(() => t('validation.title_required')),
        caption: yup
            .string()
            .required(() => t('validation.caption_required'))
            .test("len", () => t('validation.caption_max_length', { max: 500 }), (val) => {
                return val ? val.length <= 500 : false;
            }),
        template: yup
            .mixed()
            .required(() => t('validation.image_required'))
            .test("fileType", () => t('validation.image_format_unsupported'), (value) => {
                return value && allowedTypes.includes(value.type);
            }),
        link: yup
            .string()
            .required(() => t('validation.link_required'))
            .matches(/^\S*$/, () => t('validation.link_no_spaces')),
    });
};

export const setCaptionSchema = yup.object({
    caption: yup
        .string()
        .required(() => t('validation.caption_required'))
        .max(500, () => t('validation.caption_max_length', { max: 500 })),
});

export const setPasswordSchema = yup.object({
    password: yup.string().required(() => t('validation.password_required')),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref("password"), null], () => t('validation.password_confirmation_mismatch'))
        .required(() => t('validation.password_confirmation_required')),
});

export const editTwiboneSchema = yup.object({
    title: yup.string().required(() => t('validation.title_required')),
    caption: yup
        .string()
        .required(() => t('validation.caption_required'))
        .max(500, () => t('validation.caption_max_length', { max: 500 })),
    link: yup
        .string()
        .required(() => t('validation.link_required'))
        .matches(/^\S*$/, () => t('validation.link_no_spaces')),
});