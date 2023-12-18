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

const Year: FunctionComponent<thisProps> = ({
    defaultValue,
    id,
    min,
    max,
    update,
}) => {
    function getYearDefaultValue(date?: Date): number {
        if (!date) return 1;
        const year = date.getFullYear();
        return year;
    }

    function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
        const { value } = target;
        try {
            const numberValue = Number(value);
            update("year", numberValue);
        } catch (error) {
            throw new Error("Invalid input");
        }
    }

    return (
        <input
            type="number"
            defaultValue={getYearDefaultValue(defaultValue)}
            id={`year-${id}`}
            min={min ?? 1900}
            max={max ?? 2500}
            onChange={handleChange}
        />
    );
};

export default Year;
