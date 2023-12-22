//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
import { dateField } from "./DateInput";
//#endregion

const Month: FunctionComponent<dateField> = ({
    defaultValue,
    id,
    min = 0,
    max = 13,
    update,
}) => {
    function getMonthDefaultValue(date?: Date): number {
        if (!date) return 1;
        const month = date.getMonth() + 1;
        return month;
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        const input = document.getElementById(id) as HTMLInputElement;
        if (!input) return;

        let inputMonth = 0;
        try {
            inputMonth = Number(event.target.value);
        } catch (error) {
            return;
        }
        if (inputMonth > max) input.value = max.toString();
        if (inputMonth < min) input.value = min.toString();
        update();
    }

    return (
        <input
            type="number"
            defaultValue={getMonthDefaultValue(defaultValue)}
            id={id}
            min={min}
            max={max}
            onChange={handleChange}
        />
    );
};

export default Month;
