//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
import { year } from "../../types/DateInputTypes";
//#endregion

type thisProps = {
    defaultValue?: Date;
    id: string;
    min?: year;
    max?: year;
    updateYear(day: number): void;
};

const Year: FunctionComponent<thisProps> = ({
    defaultValue,
    id,
    min,
    max,
    updateYear,
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
            updateYear(numberValue);
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
