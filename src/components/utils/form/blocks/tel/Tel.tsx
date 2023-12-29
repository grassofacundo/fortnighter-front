//#region Dependency list
import { ChangeEvent, FunctionComponent } from "react";
import { inputProp } from "../../types/FormTypes";
import { tel } from "../../types/TelTypes";
//#endregion

interface thisProps extends inputProp {
    fields: tel;
}

const Tel: FunctionComponent<thisProps> = ({ fields, onUpdateAnswer }) => {
    const { isOptional, id, placeholder, maxLength, label } = fields;

    const validInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
        onUpdateAnswer({ id: target.id, value: target.value, error: "" });
    };

    return (
        <div className="inputClass">
            <label htmlFor={id}>{label}</label>
            <input
                type="text"
                id={id}
                required={!isOptional}
                placeholder={placeholder}
                maxLength={maxLength}
                onChange={(target) => validInput(target)}
            ></input>
        </div>
    );
};

export default Tel;
