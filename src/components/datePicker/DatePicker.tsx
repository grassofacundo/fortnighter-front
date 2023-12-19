//#region Dependency list
import { FunctionComponent, useState, useEffect } from "react";
import {
    getFutureDate,
    getPastDate,
    getToday,
} from "../../services/dateService";
import styles from "./DatePicker.module.scss";
import DateInput from "./dateInput/DateInput";
//#endregion

type thisProps = {
    id: string;
    onChange: (start: Date, end: Date) => void;
    initialLapseBetweenDated?: number;
    maxDistanceBetweenDates?: number;
    pastDaysLimit?: number;
    futureDaysLimit?: number;
    endDate?: Date;
    customClass?: CSSModuleClasses[string];
    buttonText?: string;
};

const DatePicker: FunctionComponent<thisProps> = ({
    id,
    onChange,
    initialLapseBetweenDated = 0,
    pastDaysLimit = 0,
    futureDaysLimit = 0,
    endDate = getToday(),
    customClass = "",
    buttonText = "Search",
}) => {
    const [end, setEnd] = useState<Date>(endDate);
    const [start, setStart] = useState<Date>(
        getPastDate(initialLapseBetweenDated, endDate)
    );
    const [startError, setStartError] = useState<string>("");
    const [endError, setEndError] = useState<string>("");
    const [datesAreValid, setDatesAreValid] = useState<boolean>(true);

    function handleDateChange(moment: "start" | "end", date: Date): void {
        if (moment === "start") {
            if (date < getPastDate(pastDaysLimit, end)) {
                setStartError("Max 2 months into the past");
                setDatesAreValid(false);
                return;
            }
            setStart(date);
        } else {
            if (date > getFutureDate(futureDaysLimit)) {
                setEndError(
                    `Cannot select a date after ${futureDaysLimit} days in the future`
                );
                setDatesAreValid(false);
                return;
            }
            setEnd(date);
        }
    }

    useEffect(() => {
        let isValid = true;
        if (start > end) {
            isValid = false;
        }
        if (start < getPastDate(pastDaysLimit, end)) {
            isValid = false;
        }
        if (end > getFutureDate(futureDaysLimit)) {
            isValid = false;
        }
        setDatesAreValid(isValid);
    }, [start, end, pastDaysLimit, futureDaysLimit]);

    return (
        <div className={`${customClass} ${styles.dateContainer}`}>
            <DateInput
                id={`${id}-start`}
                label="From"
                defaultValue={start}
                onHandleDateChange={(date: Date) =>
                    handleDateChange("start", date)
                }
                onSetError={(error) => setEndError(error)}
            />
            {startError && <p className={styles.startError}>{startError}</p>}
            <DateInput
                id={`${id}-end`}
                label="To"
                defaultValue={end}
                onHandleDateChange={(date: Date) =>
                    handleDateChange("end", date)
                }
                onSetError={(error) => setEndError(error)}
            />
            {endError && <p className={styles.endError}>{endError}</p>}
            <button
                disabled={!datesAreValid}
                onClick={() => onChange(start, end)}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default DatePicker;
