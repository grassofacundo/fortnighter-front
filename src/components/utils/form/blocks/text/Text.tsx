import { ChangeEvent, FunctionComponent } from "react";

interface thisProps extends inputProp {
    fields: text;
}

const InputText: FunctionComponent<thisProps> = ({
    fields,
    onUpdateAnswer,
}) => {
    const { isOptional, id, label, placeholder, min, max } = fields;

    function handleInput({ target }: ChangeEvent<HTMLInputElement>) {
        let error = "";

        if (!target.value.match(/^[a-zA-Z\s]*$/)) error = "Should be only text";
        if (!error && min && target.value.length < min)
            error = `Text should be at least ${min} characters`;
        if (!error && max && target.value.length > max)
            error = `Text cannot be longer than ${min} characters`;
        onUpdateAnswer({ id: target.id, value: target.value, error });
    }

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type="text"
                id={id}
                required={!isOptional}
                placeholder={placeholder}
                minLength={min}
                maxLength={max}
                onChange={(target) => handleInput(target)}
            ></input>
        </div>
    );
};

export default InputText;
