//#region Dependency list
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import DatePicker from "../../datePicker/DatePicker";
import { getFutureDate, getPastDate } from "../../../services/dateService";
import { jobPosition } from "../../../types/job/Position";
import styles from "./DatePickerPanel.module.scss";
//#endregion

type thisProps = {
    position: jobPosition;
    end: Date;
    onDateChange(end: Date, start: Date): void;
};

const DatePickerPanel: FunctionComponent<thisProps> = ({
    position,
    end,
    onDateChange,
}) => {
    const [startDate, setStartDate] = useState<Date>(
        getPastDate(position.paymentLapse, end)
    );
    const [endDate, setEndDate] = useState<Date>(end);
    const [error, setError] = useState<string>("");
    const [datesAreValid, setDatesAreValid] = useState<boolean>(true);

    const checkDateValidity = useCallback(
        (moment: "start" | "end", date: Date): void => {
            if (moment === "start") {
                if (date < getPastDate(60, endDate)) {
                    setError("Max 2 months into the past");
                    setDatesAreValid(false);
                    return;
                }
                if (date >= endDate) {
                    setError("Start date cannot be before end date");
                    setDatesAreValid(false);
                    return;
                }
                setError("");
                setDatesAreValid(true);
                setStartDate(date);
            } else {
                if (date > getFutureDate(30)) {
                    setError(
                        `Cannot select a date after 30 days in the future`
                    );
                    setDatesAreValid(false);
                    return;
                }
                setError("");
                setDatesAreValid(true);
                setEndDate(date);
            }
        },
        [endDate]
    );

    function handleDateChange(): void {
        setStartDate(startDate);
        setEndDate(endDate);
        onDateChange(endDate, startDate);
    }

    useEffect(() => {
        checkDateValidity("start", startDate);
        checkDateValidity("end", endDate);
    }, [startDate, endDate, checkDateValidity]);

    return (
        <div className={styles.panelBody}>
            <DatePicker
                id="dashboard-dates"
                onChange={checkDateValidity}
                onSubmit={handleDateChange}
                endDate={endDate}
                areDatesValid={datesAreValid}
            ></DatePicker>
            <p className={`${styles.error} ${error ? styles.isVisible : ""}`}>
                {error ? error : "/"}
            </p>
        </div>
    );
};

export default DatePickerPanel;
