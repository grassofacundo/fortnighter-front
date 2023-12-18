//#region Dependency list
import { FunctionComponent } from "react";
import { inputProp } from "../../../../../types/form/FormTypes";
import { dateInput } from "../../../../../types/form/DateInputTypes";
import Day from "./Day";
import Month from "./Month";
import Year from "./Year";
import styles from "./DateInput.module.scss";
//#endregion

interface thisProps extends inputProp {
    fields: dateInput;
}

const DateInput: FunctionComponent<thisProps> = ({
    fields,
    formAnswers,
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
    const prevAnswer = formAnswers.find((answer) => answer.id === id);
    const prevValue = prevAnswer?.value as string;

    function getDateAsInputValue(date: Date): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${date.getFullYear()}-${month > 9 ? month : `0${month}`}-${
            day > 9 ? day : `0${day}`
        }`; //T00:00
    }

    function setDateFromInput(targetValue?: string): Date {
        return new Date(`${targetValue}T00:00`);
    }

    function updateDay(day: number) {
        const prevDate = setDateFromInput(prevValue);
        prevDate.setDate(day);
        handleChange(getDateAsInputValue(prevDate));
    }

    function updateMonth(month: number) {
        const prevDate = setDateFromInput(prevValue);
        prevDate.setMonth(month - 1); //Month index starts from 0
        handleChange(getDateAsInputValue(prevDate));
    }

    function updateYear(year: number) {
        const prevDate = setDateFromInput(prevValue);
        prevDate.setFullYear(year);
        handleChange(getDateAsInputValue(prevDate));
    }

    function handleChange(value: string) {
        const error = "";
        onUpdateAnswer({ id, value, error });
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
                    id={id}
                    min={dayMin}
                    max={dayMax}
                    updateDay={updateDay}
                />
                <Month
                    defaultValue={
                        defaultValue
                            ? setDateFromInput(defaultValue)
                            : undefined
                    }
                    id={id}
                    min={monthMin}
                    max={monthMax}
                    updateMonth={updateMonth}
                />
                <Year
                    defaultValue={
                        defaultValue
                            ? setDateFromInput(defaultValue)
                            : undefined
                    }
                    id={id}
                    min={yearMin}
                    max={yearMax}
                    updateYear={updateYear}
                />
            </div>
        </div>
    );
};

export default DateInput;
