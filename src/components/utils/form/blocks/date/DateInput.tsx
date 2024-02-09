//#region Dependency list
import { FunctionComponent } from "react";
import { inputProp } from "../../FormTypes";
import { dateInput, monthNum, time, year } from "./Types";
import Day from "./Day";
import Month from "./Month";
import Year from "./Year";
import styles from "./DateInput.module.scss";
import {
    getDateAsInputValue,
    getLastDayOfMonth,
    getLastMonth,
    getNextMonth,
    getTomorrow,
    getYesterday,
    isValid,
    setDateFromInput,
} from "./Methods";
//#endregion

interface thisProps extends inputProp {
    fields: dateInput;
}

const DateInput: FunctionComponent<thisProps> = ({
    fields,
    onUpdateAnswer,
}) => {
    const {
        id,
        dayMin,
        dayMax,
        monthMin,
        monthMax,
        yearMin,
        yearMax,
        defaultValue,
        label,
    } = fields;

    const dayId = `day-${id}`;
    const monthId = `month-${id}`;
    const yearId = `year-${id}`;

    function update(changingTime: "day" | "month" | "year"): void {
        const inputDate = getDateAfterInput(changingTime);
        if (isValid(inputDate)) {
            const newDay = inputDate.getDate();
            setInputValue("day", newDay.toString());
            const inputMonth = inputDate.getMonth() + 1;
            setInputValue("month", inputMonth.toString());
            const inputYear = inputDate.getFullYear();
            setInputValue("year", inputYear.toString());

            onUpdateAnswer({
                id,
                value: getDateAsInputValue(inputDate),
                error: "",
            });
        } else {
            onUpdateAnswer({ id, value: "", error: "Date format not valid" });
        }
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

    function getDateAfterInput(changingTime: "day" | "month" | "year"): Date {
        let currentDay = getInputValue("day");
        if (currentDay.length === 1) currentDay = `0${currentDay}`;
        let currentMonth = getInputValue("month");
        if (currentMonth.length === 1) currentMonth = `0${currentMonth}`;
        const currentYear = getInputValue("year");
        const lastDayOfMonth = getLastDayOfMonth(
            (Number(currentMonth) - 1) as monthNum,
            currentYear as year
        );
        if (currentDay === "00") {
            const inputDate = setDateFromInput(
                `${currentYear}-${currentMonth}-01`
            );
            return getYesterday(inputDate);
        } else if (Number(currentDay) > lastDayOfMonth) {
            const inputDate = setDateFromInput(
                `${currentYear}-${currentMonth}-${lastDayOfMonth}`
            );
            return changingTime === "day" ? getTomorrow(inputDate) : inputDate;
        } else if (currentMonth === "13") {
            const inputDate = setDateFromInput(
                `${currentYear}-12-${currentDay}`
            );
            const nextMonth = getNextMonth(inputDate);
            return nextMonth;
        } else if (currentMonth === "00") {
            const inputDate = setDateFromInput(
                `${currentYear}-01-${currentDay}`
            );
            const nextMonth = getLastMonth(inputDate);
            return nextMonth;
        } else {
            const inputDate = setDateFromInput(
                `${currentYear}-${currentMonth}-${currentDay}`
            );
            return inputDate;
        }
    }

    return (
        <div className={`inputClass ${styles.dateInputBody}`}>
            {label && <p>{label}</p>}
            <div className={styles.inputWrapper}>
                <Day
                    defaultValue={
                        defaultValue
                            ? setDateFromInput(defaultValue)
                            : undefined
                    }
                    id={dayId}
                    min={dayMin}
                    max={dayMax}
                    update={() => update("day")}
                />
                <span>/</span>
                <Month
                    defaultValue={
                        defaultValue
                            ? setDateFromInput(defaultValue)
                            : undefined
                    }
                    id={monthId}
                    min={monthMin}
                    max={monthMax}
                    update={() => update("month")}
                />
                <span>/</span>
                <Year
                    defaultValue={
                        defaultValue
                            ? setDateFromInput(defaultValue)
                            : undefined
                    }
                    id={yearId}
                    min={yearMin}
                    max={yearMax}
                    update={() => update("year")}
                />
            </div>
        </div>
    );
};

export default DateInput;
