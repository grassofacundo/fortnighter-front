//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
//#endregion

type thisProps = {
    defaultValue?: Date;
    id: string;
    min?: number;
    max?: number;
    update(time: "day" | "month" | "year", value: number): void;
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

    function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
        const { value } = target;
        try {
            const numberValue = Number(value);
            update("day", numberValue);
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
