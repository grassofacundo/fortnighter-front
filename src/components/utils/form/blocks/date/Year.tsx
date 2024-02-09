//#region Dependency list
import { FunctionComponent } from "react";
import { year } from "./Types";
//#endregion

type thisProps = {
    defaultValue?: Date;
    id: string;
    min?: year;
    max?: year;
    update(): void;
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
