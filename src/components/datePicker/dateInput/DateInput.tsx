//#region Dependency list
import { FunctionComponent } from "react";
import styles from "./DateInput.module.scss";
import Day from "./Day";
import Month from "./Month";
import Year from "./Year";
//#endregion

type thisProps = {
    id: string;
    defaultValue?: Date;
    dayMin?: number;
    dayMax?: number;
    monthMin?: number;
    monthMax?: number;
    yearMin?: number;
    yearMax?: number;
    currentAnswer: Date;
    label: string;
    onHandleDateChange(date: Date): void;
    onSetError: (errorMessage: string) => void;
};

const DateInput: FunctionComponent<thisProps> = ({
    id,
    dayMin,
    dayMax,
    monthMin,
    monthMax,
    yearMin,
    yearMax,
    defaultValue,
    currentAnswer,
    label,
    onHandleDateChange,
    onSetError,
}) => {
    function update(time: "day" | "month" | "year", value: number) {
        const currentAnswerCopy = structuredClone(currentAnswer);
        if (time === "day") currentAnswerCopy.setDate(value);
        if (time === "month") currentAnswerCopy.setMonth(value);
        if (time === "year") currentAnswerCopy.setFullYear(value);
        onSetError("");
        onHandleDateChange(currentAnswer);
    }

    return (
        <div className={styles.dateInputBody}>
            <p>{label}</p>
            <div className={styles.inputWrapper}>
                <Day
                    defaultValue={defaultValue ?? undefined}
                    id={id}
                    min={dayMin}
                    max={dayMax}
                    update={update}
                />
                <span>/</span>
                <Month
                    defaultValue={defaultValue ?? undefined}
                    id={id}
                    min={monthMin}
                    max={monthMax}
                    update={update}
                />
                <span>/</span>
                <Year
                    defaultValue={defaultValue ?? undefined}
                    id={id}
                    min={yearMin}
                    max={yearMax}
                    update={update}
                />
            </div>
        </div>
    );
};

export default DateInput;
