import { twMerge } from "tailwind-merge";
import { Controller } from "react-hook-form";

export const InputSelectType = {
  EMAIL: "email",
  TEXT: "text",
  DATE: "date",
  PASSWORD: "password",
  NUMBER: "number",
  CHECKBOX: "checkbox",
};

export const InputSelectTheme = {
  DEFAULT: "rounded-md",
  BORDERED: "rounded-full",
};

export const InputSelectSize = {
  SMALL: "text-sm",
  MEDIUM: "text-md",
  LARGE: "text-lg",
};

const InputSelect = (props) => {
  const {
    type = InputSelectType.TEXT,
    theme = InputSelectTheme.DEFAULT,
    size = InputSelectSize.SMALL,
    onClick,
    className,
    disabled,
    placeholder,
    name,
    control,
    error,
    options,
    option_label,
    option_value,
    onChangeCustom, 
  } = props;
  const classProps = twMerge("w-full py-2 px-3 border", theme, size, className);


  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = "", onChange, ref } }) => (
        <>
          <select
            ref={ref}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classProps}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={(e) => {
              onChange(e); 
              onChangeCustom?.(e.target.value);
            }}
          >
            {options.map((option, key) => (
              <option key={key} value={option[option_value]}>
                {option[option_label]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-red-500">{error[name]?.message}</p>
        </>
      )}
    />
  );
};

export default InputSelect;
