//#region Dependency list
import { FunctionComponent } from "react";
import { dateField } from "./DateInput";
//#endregion

const Day: FunctionComponent<dateField> = ({
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

    return (
        <input
            type="number"
            defaultValue={getDayDefaultValue(defaultValue)}
            id={id}
            min={min ?? 0}
            max={max ?? 32}
            onChange={update}
        />
    );
};

export default Day;
