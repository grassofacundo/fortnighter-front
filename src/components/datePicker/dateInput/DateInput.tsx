//#region Dependency list
import { FunctionComponent } from "react";
import { getYesterday, setDateFromInput } from "../../../services/dateService";
import Day from "./Day";
import Month from "./Month";
import Year from "./Year";
import styles from "./DateInput.module.scss";
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
    label: string;
    onHandleDateChange(date: Date): void;
    onSetError: (errorMessage: string) => void;
};
type time = "day" | "month" | "year";
export type dateField = {
    defaultValue?: Date;
    id: string;
    min?: number;
    max?: number;
    update(): void;
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
    label,
    onHandleDateChange,
    onSetError,
}) => {
    const dayId = `day-${id}`;
    const monthId = `month-${id}`;
    const yearId = `year-${id}`;

    function update() {
        const inputDate = getDateAfterInput();
        const newDay = inputDate.getDate();
        setInputValue("day", newDay.toString());
        const inputMonth = inputDate.getMonth() + 1;
        setInputValue("month", inputMonth.toString());
        const inputYear = inputDate.getFullYear();
        setInputValue("year", inputYear.toString());

        onSetError("");
        onHandleDateChange(inputDate);
    }

    function getInputValue(time: time): string {
        const i = `${time}-${id}`;
        const input = document.getElementById(i) as HTMLInputElement;
        return input.value;
    }

    function setInputValue(time: time, value: string): void {
        const i = `${time}-${id}`;
        const input = document.getElementById(i) as HTMLInputElement;
        input.value = value;
    }

    function getDateAfterInput(): Date {
        let currentDay = getInputValue("day");
        if (currentDay.length === 1) currentDay = `0${currentDay}`;
        let currentMonth = getInputValue("month");
        if (currentMonth.length === 1) currentMonth = `0${currentMonth}`;
        const currentYear = getInputValue("year");
        if (currentDay === "00") {
            const inputDate = setDateFromInput(
                `${currentYear}-${currentMonth}-01`
            );
            return getYesterday(inputDate);
        } else if (currentMonth === "13") {
            const nextYear = Number(currentYear) + 1;
            const inputDate = setDateFromInput(`${nextYear}-01-${currentDay}`);
            return inputDate;
        } else {
            const inputDate = setDateFromInput(
                `${currentYear}-${currentMonth}-${currentDay}`
            );
            return inputDate;
        }
    }

    return (
        <div className={styles.dateInputBody}>
            <p>{label}</p>
            <div className={styles.inputWrapper}>
                <Day
                    defaultValue={defaultValue ?? undefined}
                    id={dayId}
                    min={dayMin}
                    max={dayMax}
                    update={update}
                />
                <span>/</span>
                <Month
                    defaultValue={defaultValue ?? undefined}
                    id={monthId}
                    min={monthMin}
                    max={monthMax}
                    update={update}
                />
                <span>/</span>
                <Year
                    defaultValue={defaultValue ?? undefined}
                    id={yearId}
                    min={yearMin}
                    max={yearMax}
                    update={update}
                />
            </div>
        </div>
    );
};

export default DateInput;
