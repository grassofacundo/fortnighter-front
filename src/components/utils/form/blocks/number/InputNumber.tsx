//#region Dependency list
import { ChangeEvent, FunctionComponent } from "react";
import { inputNumber } from "../../types/InputNumberTypes";
import { inputProp } from "../../types/FormTypes";
//#endregion

interface thisProps extends inputProp {
    fields: inputNumber;
}

const InputNumber: FunctionComponent<thisProps> = ({
    fields,
    onUpdateAnswer,
}) => {
    const { isOptional, id, placeholder, label, defaultValue, step } = fields;

    const validInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
        onUpdateAnswer({ id: target.id, value: target.value, error: "" });
    };

    return (
        <div className="inputClass">
            <label htmlFor={id}>{label}</label>
            <input
                type="number"
                id={id}
                placeholder={placeholder}
                required={!isOptional}
                onChange={(target) => validInput(target)}
                defaultValue={defaultValue}
                step={step}
            ></input>
        </div>
    );
};

export default InputNumber;
