import { twMerge } from "tailwind-merge";
import { Controller } from "react-hook-form";

export const InputType = {
  EMAIL: "email",
  TEXT: "text",
  DATE: "date",
  PASSWORD: "password",
  NUMBER: "number",
  CHECKBOX: "checkbox",
  TEXTAREA: "textarea",
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
    className,
    disabled,
    placeholder,
    name,
    control,
    error,
    prefix,
  } = props;

  const isTextarea = type === InputType.TEXTAREA;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = "", onChange, ref } }) => (
        <div>
          {/* WRAPPER */}
          <div
            className={twMerge(
              "flex w-full border bg-white dark:bg-gray-900 dark:border-gray-700",
              "focus-within:ring-2 focus-within:ring-primary-400",
              theme,
              className
            )}
          >
            {/* PREFIX */}
            {prefix && (
              <div className="flex items-center px-3 text-gray-700 bg-gray-200 border-r dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                {prefix}
              </div>
            )}

            {/* INPUT / TEXTAREA */}
            {isTextarea ? (
              <textarea
                ref={ref}
                disabled={disabled}
                onClick={onClick}
                className={twMerge(
                  "w-full py-2 px-3 focus:outline-none resize-none min-h-[10rem]",
                  "bg-white dark:bg-gray-900 text-black dark:text-white",
                  size
                )}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
              />
            ) : (
              <input
                ref={ref}
                type={type}
                disabled={disabled}
                onClick={onClick}
                className={twMerge(
                  "w-full py-2 px-3 focus:outline-none",
                  "bg-white dark:bg-gray-900 text-black dark:text-white",
                  size
                )}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
              />
            )}
          </div>

          {/* ERROR TEXT */}
          <p className="mt-1 text-xs text-red-500">{error?.[name]?.message}</p>
        </div>
      )}
    />
  );
};

export default Input;
