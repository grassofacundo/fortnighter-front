//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
import { monthNum } from "./Types";
//#endregion

type thisProps = {
    defaultValue?: Date;
    id: string;
    min?: monthNum;
    max?: monthNum;
    update(): void;
};

const Month: FunctionComponent<thisProps> = ({
    defaultValue,
    id,
    min,
    max,
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
        if (max && inputMonth > max) input.value = max.toString();
        if (min && inputMonth < min) input.value = min.toString();
        update();
    }

    return (
        <input
            type="number"
            defaultValue={getMonthDefaultValue(defaultValue)}
            id={id}
            min={min ?? 1}
            max={max ?? 12}
            onChange={handleChange}
        />
    );
};

export default Month;
