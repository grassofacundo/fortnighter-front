//#region Dependency list
import { FunctionComponent, useState, useEffect, createContext } from "react";
import Calendar from "../calendar/Calendar";
import Summary from "../summary/Summary";
import JobPanel from "../jobPanel/jobPanel";
import styles from "./Dashboard.module.scss";
import shiftService from "../../services/shiftService";
import { shiftState } from "../../types/job/Shift";
import { datesAreEqual, getPastDate } from "../../services/dateService";
import DatePickerPanel from "./datePickerPanel/DatePickerPanel";
import { Job } from "../../classes/JobPosition";
//#endregion

type thisProps = unknown;
export const JobContext = createContext<Job | null>(null);

const Dashboard: FunctionComponent<thisProps> = () => {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [endDate, setEndDate] = useState<Date>();
    const [startDate, setStartDate] = useState<Date>();
    const [shiftList, setShiftList] = useState<shiftState[]>([]);

    function handleDateChange(end: Date, start: Date) {
        setEndDate(end);
        setStartDate(start);
    }

    function getDates(selectedPosition: Job) {
        const nextPaySplit = selectedPosition.nextPaymentDate;
        const end = nextPaySplit ?? new Date();
        const daysBetweenPayment = selectedPosition.paymentLapse;
        const start = getPastDate(daysBetweenPayment, end);
        return { start, end };
    }

    useEffect(() => {
        if (!selectedJob) return;

        const { start, end } = getDates(selectedJob);
        const shiftStart = startDate ?? start;
        const shiftEnd = endDate ?? end;
        if (
            !startDate ||
            !endDate ||
            !datesAreEqual(startDate, start) ||
            !datesAreEqual(endDate, end)
        ) {
            shiftService
                .getShifts(shiftStart, shiftEnd, selectedJob.id)
                .then((shiftList) => {
                    const shiftsStates = shiftList.map((shiftBase) =>
                        shiftService.getShiftAsState(shiftBase)
                    );
                    setShiftList(shiftsStates);
                    if (!startDate) setStartDate(shiftStart);
                    if (!endDate) setEndDate(shiftEnd);
                });
        }
    }, [selectedJob, endDate, startDate]);

    return (
        <JobContext.Provider value={selectedJob}>
            <div className={styles.mainBody}>
                <JobPanel onSetSelectedJob={setSelectedJob} />
                {selectedJob && endDate && startDate && (
                    <div className={styles.calendarAnimWrapper}>
                        <DatePickerPanel
                            end={endDate}
                            onDateChange={handleDateChange}
                        />

                        <div className={styles.calendarContainer}>
                            <Calendar
                                endDate={endDate}
                                startDate={startDate}
                                shiftList={shiftList}
                                onSetShiftList={setShiftList}
                            ></Calendar>
                            <Summary
                                shiftList={shiftList}
                                searchDates={{
                                    start: startDate,
                                    end: endDate,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </JobContext.Provider>
    );
};

export default Dashboard;
