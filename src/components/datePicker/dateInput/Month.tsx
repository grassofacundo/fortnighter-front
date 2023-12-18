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

    function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
        const { value } = target;
        try {
            const numberValue = Number(value);
            update("month", numberValue);
        } catch (error) {
            throw new Error("Invalid input");
        }
    }

    return (
        <input
            type="number"
            defaultValue={getMonthDefaultValue(defaultValue)}
            id={`month-${id}`}
            min={min ?? 1}
            max={max ?? 12}
            onChange={handleChange}
        />
    );
};

export default Month;
