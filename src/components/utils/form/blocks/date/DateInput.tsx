//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
import { inputProp } from "../../../../../types/form/FormTypes";
import { dateInput } from "../../../../../types/form/DateInputTypes";
//#endregion

interface thisProps extends inputProp {
    fields: dateInput;
}

const DateInput: FunctionComponent<thisProps> = ({
    fields,
    onUpdateAnswer,
}) => {
    const { isOptional, id, min, max, defaultValue, label } = fields;

    function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
        const error = "";
        onUpdateAnswer({ id: target.id, value: target.value, error });
    }

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type="date"
                value={defaultValue}
                id={id}
                min={min}
                max={max}
                required={!isOptional}
                onChange={handleChange}
            />
        </div>
    );
};

export default DateInput;
