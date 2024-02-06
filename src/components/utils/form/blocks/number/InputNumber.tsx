//#region Dependency list
import { ChangeEvent, FunctionComponent, useRef } from "react";
import { inputNumber } from "../../types/InputNumberTypes";
import { inputProp } from "../../types/FormTypes";
import styles from "./InputNumber.module.scss";
//#endregion

interface thisProps extends inputProp {
    fields: inputNumber;
}

const InputNumber: FunctionComponent<thisProps> = ({
    fields,
    onUpdateAnswer,
}) => {
    const { isOptional, id, placeholder, label, defaultValue, step } = fields;
    const wrapper = useRef<HTMLDivElement>(null);

    const validInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (wrapper.current) {
            const newWidth =
                target.value.length < 4
                    ? 4
                    : target.value.length > 6
                    ? 8
                    : target.value.length + 2;
            wrapper.current.style.setProperty(`--width`, `${newWidth}rem`);
        }
        onUpdateAnswer({ id: target.id, value: target.value, error: "" });
    };

    function handleDefaultValue() {
        if (!defaultValue) return "";
        if (typeof defaultValue === "number") {
            return Number(defaultValue).toString();
        }
        return defaultValue;
    }

    return (
        <div ref={wrapper} className={`${styles.wrapper} inputClass`}>
            <label htmlFor={id}>{label}</label>
            <input
                type="number"
                id={id}
                placeholder={placeholder}
                required={!isOptional}
                onChange={(target) => validInput(target)}
                defaultValue={handleDefaultValue()}
                step={step}
            ></input>
        </div>
    );
};

export default InputNumber;
