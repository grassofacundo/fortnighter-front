//#region Dependency list
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { shiftState } from "../../types/job/Shift";
import styles from "./Summary.module.scss";
import { getFutureDate, getPastDate } from "../../services/dateService";
import DatePicker from "../datePicker/DatePicker";
import InfoPanel from "./infoPanel/InfoPanel";
//#endregion

type thisProps = {
    shiftList: shiftState[];
    searchDates: {
        start: Date;
        end: Date;
    };
};

const Summary: FunctionComponent<thisProps> = ({ shiftList, searchDates }) => {
    const [startDate, setStartDate] = useState<Date>(searchDates.start);
    const [endDate, setEndDate] = useState<Date>(searchDates.end);
    const [startPickerDate, setStartPickerDate] = useState<Date>(
        searchDates.start
    );
    const [endPickerDate, setEndPickerDate] = useState<Date>(searchDates.end);
    const [error, setError] = useState<string>("");
    const [datesAreValid, setDatesAreValid] = useState<boolean>(true);

    console.log(startDate);
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
            if ((moment === "start" || moment === "both") && startParam) {
                if (startParam < getPastDate(60, endPickerDate)) {
                    setError("Max 2 months into the past");
                    setDatesAreValid(false);
                    return;
                }
                if (startParam >= endPickerDate) {
                    setError("Start date cannot be before end date");
                    setDatesAreValid(false);
                    return;
                }
                setError("");
                setDatesAreValid(true);
                setStartPickerDate(startParam);
            }
            if ((moment === "end" || moment === "both") && endParam) {
                if (endParam > getFutureDate(30)) {
                    setError(
                        `Cannot select a date after 30 days in the future`
                    );
                    setDatesAreValid(false);
                    return;
                }
                setError("");
                setDatesAreValid(true);
                setEndPickerDate(endParam);
            }
        },
        [endPickerDate]
    );

    function handleDateChange(): void {
        setStartDate(startPickerDate);
        setEndDate(endPickerDate);
    }

    useEffect(() => {
        checkDateValidity({
            moment: "both",
            endParam: endPickerDate,
            startParam: startPickerDate,
        });
    }, [startPickerDate, endPickerDate, checkDateValidity]);

    return (
        <div className={styles.summaryBody}>
            <InfoPanel
                shiftList={shiftList}
                start={searchDates.start}
                end={searchDates.end}
            />
            {shiftList.length > 0 && (
                <DatePicker
                    id="summary-dates"
                    onChange={checkDateValidity}
                    onSubmit={handleDateChange}
                    endDate={endDate}
                    pastDaysLimit={60}
                    futureDaysLimit={30}
                    customClass={styles.datePicker}
                    buttonText="Change dates"
                    areDatesValid={datesAreValid}
                ></DatePicker>
            )}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default Summary;
