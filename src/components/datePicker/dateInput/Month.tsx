//#region Dependency list
import { FunctionComponent } from "react";
import { dateField } from "./DateInput";
//#endregion

const Month: FunctionComponent<dateField> = ({
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

    return (
        <input
            type="number"
            defaultValue={getMonthDefaultValue(defaultValue)}
            id={id}
            min={min ?? 0}
            max={max ?? 13}
            onChange={update}
        />
    );
};

export default Month;
