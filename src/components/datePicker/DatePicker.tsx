//#region Dependency list
import {
    FunctionComponent,
    useState,
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import styles from "./DatePicker.module.scss";
import {
    getDateAsInputValue,
    getFutureDate,
    getPastDate,
    getToday,
} from "../../services/dateService";
//#endregion

type thisProps = {
    onSetSearchDates: Dispatch<
        SetStateAction<{
            start: Date | null;
            end: Date | null;
        }>
    >;
};

const DatePicker: FunctionComponent<thisProps> = ({ onSetSearchDates }) => {
    const [start, setStart] = useState<Date>(getPastDate(15));
    const [end, setEnd] = useState<Date>(getToday());
    const [startError, setStartError] = useState<string>("");
    const [endError, setEndError] = useState<string>("");
    const [datesAreValid, setDatesAreValid] = useState<boolean>(true);

    function handleStartDateChange(dateEvent: ChangeEvent<HTMLInputElement>) {
        const dateValue = `${dateEvent.target.value}T00:00`;
        const date = new Date(dateValue);
        if (date < getPastDate(60, end)) {
            setStartError("Max 2 months into the past");
            setDatesAreValid(false);
            return;
        }
        setStart(date);
    }

    function handleEndDateChange(dateEvent: ChangeEvent<HTMLInputElement>) {
        const dateValue = `${dateEvent.target.value}T00:00`;
        const date = new Date(dateValue);
        if (date > getFutureDate(30)) {
            setEndError("Cannot select a date after a month in the future");
            setDatesAreValid(false);
            return;
        }
        setEnd(date);
    }

    useEffect(() => {
        let isValid = true;
        if (start < getPastDate(60, end)) {
            isValid = false;
        }
        if (end > getFutureDate(30)) {
            isValid = false;
        }
        setDatesAreValid(isValid);
    }, [start, end]);

    useEffect(() => {
        onSetSearchDates({ start, end });
    }, []);

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
                onClick={() => onSetSearchDates({ start, end })}
            >
                Search
            </button>
        </div>
    );
};

export default DatePicker;
