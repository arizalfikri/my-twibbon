import { twMerge } from "tailwind-merge";

const InputLabel = (props) => {
  const { htmlFor, label, className } = props;

  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        "capitalize font-semibold text-sm text-gray-700 dark:text-gray-300",
        className
      )}
    >
      {label}
    </label>
  );
};

export default InputLabel;
