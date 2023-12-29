//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
import { day } from "../../types/DateInputTypes";
//#endregion

type thisProps = {
    defaultValue?: Date;
    id: string;
    min?: day;
    max?: day;
    updateDay(day: number): void;
};

const Day: FunctionComponent<thisProps> = ({
    defaultValue,
    id,
    min,
    max,
    updateDay,
}) => {
    function getDayDefaultValue(date?: Date): number {
        if (!date) return 1;
        const day = date.getDate();
        return day;
    }

    function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
        const { value } = target;
        try {
            const numberValue = Number(value);
            updateDay(numberValue);
        } catch (error) {
            throw new Error("Invalid input");
        }
    }

    return (
        <input
            type="number"
            defaultValue={getDayDefaultValue(defaultValue)}
            id={`day-${id}`}
            min={min ?? 1}
            max={max ?? 31}
            onChange={handleChange}
        />
    );
};

export default Day;
