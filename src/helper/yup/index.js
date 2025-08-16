import * as yup from "yup";

export const signInSchema = yup.object({
    email: yup.string().required("Email harus diisi"),
    password: yup.string().required("Password harus diisi"),
});

export const signUpSchema = yup.object({
    fullname: yup.string().required("Nama Lengkap harus diisi"),
    email: yup.string().required("Email harus diisi"),
    password: yup.string().required("Password harus diisi"),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("password"), null], "Konfirmasi Password tidak cocok")
        .required("Konfirmasi Password wajib diisi"),
});

export const forgotPasswordSchema = yup.object({
    email: yup.string().required("email harus diisi"),
});
export const createTwiboneSchema = yup.object({
    title: yup.string().required("Judul harus diisi"),
    caption: yup
        .string()
        .required("Caption harus diisi")
        .max(500, "Caption maksimal 500 karakter"),
    image: yup
        .mixed()
        .required("Gambar harus diunggah")
        .test("fileType", "Format gambar tidak didukung", (value) => {
            return value && ["image/jpeg", "image/png", "image/webp"].includes(value.type);
        }),
    link: yup
        .string()
        .required("Link harus diisi")
        .matches(/^\S*$/, "Link tidak boleh mengandung spasi"),

});

export const setCaptionSchema = yup.object({
    caption: yup.string().required("caption harus diisi")
        .max(500, "Caption maksimal 500 karakter"),

});

export const setPasswordSchema = yup.object({
    password: yup.string().required("password harus diisi"),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref("password"), null], "Konfirmasi Password tidak cocok")
        .required("Konfirmasi Password wajib diisi"),
});
