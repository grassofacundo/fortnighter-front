import { ChangeEvent, FunctionComponent } from "react";

interface thisProps extends inputProp {
    fields: inputNumber;
}

const InputNumber: FunctionComponent<thisProps> = ({
    fields,
    onUpdateAnswer,
}) => {
    const { isOptional, id, placeholder, /*maxLength,*/ label } = fields;

    const validInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
        onUpdateAnswer({ id: target.id, value: target.value, error: "" });
    };

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type="number"
                id={id}
                placeholder={placeholder}
                required={!isOptional}
                onChange={(target) => validInput(target)}
            ></input>
        </div>
    );
};

export default InputNumber;
