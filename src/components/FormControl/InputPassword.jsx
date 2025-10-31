import { useState } from "react";
import PropTypes from "prop-types";

import { VscEye, VscEyeClosed } from "../icons";

import InputLabel from "./InputLabel";
import Input from ".";

const togglePasswordVisibilityOptions = [
  {
    setState: "text",
    state: "password",
    icon: <VscEyeClosed size={20} color="gray" />,
  },
  {
    setState: "password",
    state: "text",
    icon: <VscEye size={20} color="gray" />,
  },
];

const InputPassword = (props) => {
  const {
    htmlFor,
    label,
    type,
    placeholder,
    name,
    id,
    control,
    error,
    disabled,
  } = props;
  const [stateType, setStateType] = useState(type);

  return (
    <div className="flex flex-col gap-1">
      <InputLabel htmlFor={htmlFor} label={label} />
      <div className="relative">
        <Input
          type={stateType}
          placeholder={placeholder}
          name={name}
          id={id}
          control={control}
          error={error}
          disabled={disabled}
        />
        {togglePasswordVisibilityOptions.map(
          (toggle, index) =>
            stateType === toggle.state && (
              <div
                key={index}
                className="absolute top-2.5 flex items-center right-3"
              >
                <button
                  type="button"
                  onClick={() => setStateType(toggle.setState)}
                >
                  {toggle.icon}
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
};

InputPassword.propTypes = {
  htmlFor: PropTypes.string,
  label: PropTypes.element,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.object,
  disabled: PropTypes.object,
};

export default InputPassword;
