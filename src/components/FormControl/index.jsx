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
    children,
    className,
    disabled,
    placeholder,
    name,
    control,
    error,
  } = props;

  const isTextarea = type === InputType.TEXTAREA;

  const classProps = twMerge(
    "w-full py-2 px-3 border focus:outline-none",
    "bg-white text-black placeholder-gray-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400",
    theme,
    size,
    isTextarea && "min-h-[10rem] resize-none",
    className
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = "", onChange, ref } }) => (
        <>
          {isTextarea ? (
            <textarea
              ref={ref}
              onClick={onClick}
              disabled={disabled}
              className={classProps}
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={onChange}
            />
          ) : (
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
            />
          )}
          <p className="mt-1 text-xs text-red-500">{error?.[name]?.message}</p>
        </>
      )}
    />
  );
};

export default Input;
