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
        ({
            moment,
            endParam,
            startParam,
        }: {
            moment: "start" | "end" | "both";
            endParam?: Date;
            startParam?: Date;
        }): void => {
            let error = "";
            let dateAreValid = true;
            if ((moment === "start" || moment === "both") && startParam) {
                if (startParam < getPastDate(60, new Date())) {
                    error = "Max 2 months into the past";
                    dateAreValid = false;
                }
                if (startParam >= endDate) {
                    error = "Start date cannot be before end date";
                    dateAreValid = false;
                }
                setStartDate(startParam);
            }
            if ((moment === "end" || moment === "both") && endParam) {
                if (endParam > getFutureDate(30)) {
                    error = "Cannot select a date after 30 days in the future";
                    dateAreValid = false;
                }
                if (endParam <= startDate) {
                    error = "End date cannot be before start date";
                    dateAreValid = false;
                }
                setEndDate(endParam);
            }
            setError(error);
            setDatesAreValid(dateAreValid);
        },
        [endDate, startDate]
    );

    function handleDateChange(): void {
        setStartDate(startDate);
        setEndDate(endDate);
        onDateChange(endDate, startDate);
    }

    useEffect(() => {
        checkDateValidity({
            moment: "both",
            endParam: endDate,
            startParam: startDate,
        });
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
