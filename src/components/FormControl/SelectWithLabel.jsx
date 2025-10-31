import InputLabel from "./InputLabel";
import InputSelect from "./Select";

const InputSelectWithLabel = (props) => {
    const { htmlFor, label, ...rest } = props;

    return (
        <div className="flex flex-col gap-1">
            <InputLabel htmlFor={htmlFor} label={label} />
            <InputSelect {...rest} />
        </div>
    );
};

export default InputSelectWithLabel;
