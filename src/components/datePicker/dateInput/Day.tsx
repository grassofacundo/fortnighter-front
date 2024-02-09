//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
import { dateField } from "./DateInput";
//#endregion

const Day: FunctionComponent<dateField> = ({
    defaultValue,
    id,
    min = 0,
    max = 32,
    update,
}) => {
    function getDayDefaultValue(date?: Date): number {
        if (!date) return 1;
        const day = date.getDate();
        return day;
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        const input = document.getElementById(id) as HTMLInputElement;
        if (!input) return;

        let inputDay = 0;
        try {
            inputDay = Number(event.target.value);
        } catch (error) {
            return;
        }
        if (inputDay > max) input.value = max.toString();
        if (inputDay < min) input.value = min.toString();
        update();
    }

    return (
        <input
            type="number"
            defaultValue={getDayDefaultValue(defaultValue)}
            id={id}
            min={min}
            max={max}
            onChange={handleChange}
        />
    );
};

export default Day;
