//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
import { dayNum } from "./Types";
//#endregion

type thisProps = {
    defaultValue?: Date;
    id: string;
    min?: dayNum;
    max?: dayNum;
    update(): void;
};

const Day: FunctionComponent<thisProps> = ({
    defaultValue,
    id,
    min,
    max,
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
        if (max && inputDay > max) input.value = max.toString();
        if (min && inputDay < min) input.value = min.toString();
        update();
    }

    return (
        <input
            type="number"
            defaultValue={getDayDefaultValue(defaultValue)}
            id={id}
            min={min ?? 1}
            max={max ?? 31}
            onChange={handleChange}
        />
    );
};

export default Day;
