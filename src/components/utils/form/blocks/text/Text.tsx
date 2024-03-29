//#region Dependency list
import { ChangeEvent, FunctionComponent } from "react";
import { inputProp } from "../../FormTypes";
import { text } from "./Types";
//#endregion

interface thisProps extends inputProp {
    fields: text;
    parentClass?: string;
}

const InputText: FunctionComponent<thisProps> = ({
    fields,
    parentClass,
    onUpdateAnswer,
}) => {
    const { isOptional, id, label, placeholder, min, max, defaultValue } =
        fields;

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
        <div className={parentClass}>
            <label htmlFor={id}>{label}</label>
            <input
                type="text"
                id={id}
                required={!isOptional}
                placeholder={placeholder ?? ""}
                minLength={min ?? 0}
                maxLength={max ?? 1000}
                onChange={(target) => handleInput(target)}
                defaultValue={defaultValue}
            ></input>
        </div>
    );
};

export default InputText;
