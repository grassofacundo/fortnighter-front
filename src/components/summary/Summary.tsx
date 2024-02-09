//#region Dependency list
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import styles from "./Summary.module.scss";
import { getFutureDate, getPastDate } from "../../services/dateService";
import DatePicker from "../datePicker/DatePicker";
import InfoPanel from "./infoPanel/InfoPanel";
import { Shift } from "../../classes/shift/Shift";
import { Job } from "../../classes/job/JobPosition";
//#endregion

type thisProps = {
    shiftList: Shift[];
    searchDates: {
        start: Date;
        end: Date;
    };
    updateJob: Dispatch<SetStateAction<Job | null>>;
};

const Summary: FunctionComponent<thisProps> = ({
    shiftList,
    searchDates,
    updateJob,
}) => {
    const [startDate, setStartDate] = useState<Date>(searchDates.start);
    const [endDate, setEndDate] = useState<Date>(
        new Date(searchDates.end.setHours(23, 59))
    );
    const [startPickerDate, setStartPickerDate] = useState<Date>(
        searchDates.start
    );
    const [endPickerDate, setEndPickerDate] = useState<Date>(searchDates.end);
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
            if (moment === "start" || moment === "both") {
                if (startParam) {
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
                } else {
                    setError("Date doesn't have a valid format");
                    setDatesAreValid(false);
                }
            }
            if (moment === "end" || moment === "both") {
                if (endParam) {
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
                } else {
                    setError("Date doesn't have a valid format");
                    setDatesAreValid(false);
                }
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
                start={startDate}
                end={endDate}
                updateJob={updateJob}
            />
            <div className={styles.datePickerWrapper}>
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
        </div>
    );
};

export default Summary;
