//#region Dependency list
import { FunctionComponent, useState, ChangeEvent, useEffect } from "react";
import {
    getDateAsInputValue,
    getFutureDate,
    getPastDate,
    getToday,
} from "../../services/dateService";
import styles from "./DatePicker.module.scss";
//#endregion

type thisProps = {
    onChange: (start: Date, end: Date) => void;
    initialLapseBetweenDated?: number;
    maxDistanceBetweenDates?: number;
    pastDaysLimit?: number;
    futureDaysLimit?: number;
    endDate?: Date;
};

const DatePicker: FunctionComponent<thisProps> = ({
    onChange,
    initialLapseBetweenDated = 0,
    pastDaysLimit = 0,
    futureDaysLimit = 0,
    endDate = getToday(),
}) => {
    const [end, setEnd] = useState<Date>(endDate);
    const [start, setStart] = useState<Date>(
        getPastDate(initialLapseBetweenDated, endDate)
    );
    const [startError, setStartError] = useState<string>("");
    const [endError, setEndError] = useState<string>("");
    const [datesAreValid, setDatesAreValid] = useState<boolean>(true);

    function handleStartDateChange(dateEvent: ChangeEvent<HTMLInputElement>) {
        const dateValue = `${dateEvent.target.value}T00:00`;
        const date = new Date(dateValue);
        if (date < getPastDate(pastDaysLimit, end)) {
            setStartError("Max 2 months into the past");
            setDatesAreValid(false);
            return;
        }
        setStart(date);
    }

    function handleEndDateChange(dateEvent: ChangeEvent<HTMLInputElement>) {
        const dateValue = `${dateEvent.target.value}T00:00`;
        const date = new Date(dateValue);
        if (date > getFutureDate(futureDaysLimit)) {
            setEndError(
                `Cannot select a date after ${futureDaysLimit} days in the future`
            );
            setDatesAreValid(false);
            return;
        }
        setEnd(date);
    }

    useEffect(() => {
        let isValid = true;
        if (start < getPastDate(pastDaysLimit, end)) {
            isValid = false;
        }
        if (end > getFutureDate(futureDaysLimit)) {
            isValid = false;
        }
        setDatesAreValid(isValid);
    }, [start, end, pastDaysLimit, futureDaysLimit]);

    return (
        <div className={styles.dateContainer}>
            <input
                type="date"
                onClick={() => {
                    if (startError) setStartError("");
                }}
                onChange={handleStartDateChange}
                defaultValue={getDateAsInputValue(start)}
            />
            {startError && <p className={styles.startError}>{startError}</p>}
            <input
                type="date"
                onClick={() => {
                    if (endError) setEndError("");
                }}
                onChange={handleEndDateChange}
                defaultValue={getDateAsInputValue(end)}
            />
            {endError && <p className={styles.endError}>{endError}</p>}
            <button
                disabled={!datesAreValid}
                onClick={() => onChange(start, end)}
            >
                Search
            </button>
        </div>
    );
};

export default DatePicker;
