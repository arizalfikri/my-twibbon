import PropTypes from "prop-types";
import InputLabel from "./InputLabel";
import Input from ".";

const InputWithLabel = (props) => {
    const {
        htmlFor,
        label,
        type,
        placeholder,
        name,
        id,
        value,
        style,
        control,
        onChange,
        error,
    } = props;

    return (
        <div className="flex flex-col gap-1">
            <InputLabel htmlFor={htmlFor} label={label} />
            <Input
                type={type}
                placeholder={placeholder}
                name={name}
                id={id}
                value={value}
                style={style}
                onChange={onChange}
                control={control}
                error={error}
            />
        </div>
    );
};

InputWithLabel.propTypes = {
    value: PropTypes.string,
    htmlFor: PropTypes.string,
    label: PropTypes.element,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    control: PropTypes.object,
    error: PropTypes.object,
};

export default InputWithLabel;
