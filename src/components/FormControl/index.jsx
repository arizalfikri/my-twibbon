import { twMerge } from "tailwind-merge";
import { Controller } from "react-hook-form";

export const InputType = {
    EMAIL: "email",
    TEXT: "text",
    DATE: "date",
    PASSWORD: "password",
    NUMBER: "number",
    CHECKBOX: "checkbox",
};

export const InputTheme = {
    DEFAULT: "rounded-md",
    BORDERED: "rounded-full",
};

export const InputSize = {
    SMALL: "text-sm",
    MEDIUM: "text-md",
    LARGE: "text-lg",
};

const Input = (props) => {
    const {
        type = InputType.TEXT,
        theme = InputTheme.DEFAULT,
        size = InputSize.SMALL,
        onClick,
        children,
        className,
        disabled,
        placeholder,
        name,
        control,
        error,
    } = props;
    const classProps = twMerge(
        "w-full py-2 px-3 border",
        theme,
        size,
        className
    );

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value = "", onChange, ref } }) => (
                <>
                    <input
                        ref={ref}
                        type={type}
                        onClick={onClick}
                        disabled={disabled}
                        className={classProps}
                        placeholder={placeholder}
                        name={name}
                        value={value}
                        onChange={onChange}
                    >
                        {children}
                    </input>
                    <p className="mt-1 text-xs text-red-500">
                        {error?.[name]?.message}
                    </p>
                </>
            )}
        />
    );
};

export default Input;
