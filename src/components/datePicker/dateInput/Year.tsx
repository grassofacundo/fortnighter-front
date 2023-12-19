//#region Dependency list
import { FunctionComponent } from "react";
import { dateField } from "./DateInput";
//#endregion

const Year: FunctionComponent<dateField> = ({
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

    return (
        <input
            type="number"
            defaultValue={getYearDefaultValue(defaultValue)}
            id={id}
            min={min ?? 1900}
            max={max ?? 2500}
            onChange={update}
        />
    );
};

export default Year;
