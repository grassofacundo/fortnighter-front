//#region Dependency list
import { FunctionComponent, useState, useEffect, createContext } from "react";
import Calendar from "../calendar/Calendar";
import Summary from "../summary/Summary";
import JobPanel from "../jobPanel/jobPanel";
import styles from "./Dashboard.module.scss";
import shiftService from "../../services/shiftService";
//import { datesAreEqual getPastDate } from "../../services/dateService";
//import DatePickerPanel from "./datePickerPanel/DatePickerPanel";
import { Job } from "../../classes/job/JobPosition";
import { Shift } from "../../classes/shift/Shift";
//#endregion

type thisProps = unknown;
export const JobContext = createContext<Job | null>(null);

const Dashboard: FunctionComponent<thisProps> = () => {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    //const [endDate, setEndDate] = useState<Date>();
    //const [startDate, setStartDate] = useState<Date>();
    const [shiftList, setShiftList] = useState<Shift[]>([]);

    // function handleDateChange(end: Date, start: Date) {
    //     setEndDate(end);
    //     setStartDate(start);
    // }

    // function getDates(selectedPosition: Job) {
    //     const nextPaySplit = selectedPosition.nextPaymentDate;
    //     const end = nextPaySplit ?? new Date();
    //     const daysBetweenPayment = selectedPosition.paymentLapse;
    //     const start = getPastDate(daysBetweenPayment, end);
    //     return { start, end };
    // }

    useEffect(() => {
        if (!selectedJob) return;

        const start = selectedJob.lastPayment;
        const end = selectedJob.nextPayment;
        shiftService.getShifts(start, end, selectedJob.id).then((shiftList) => {
            const shifts = shiftList.map((shiftFromDb) =>
                shiftService.convertShiftFromDbToShift(
                    shiftFromDb,
                    selectedJob.id
                )
            );
            setShiftList(shifts);
        });
    }, [selectedJob]);

    return (
        <JobContext.Provider value={selectedJob}>
            <div className={styles.mainBody}>
                <JobPanel onSetSelectedJob={setSelectedJob} />
                {selectedJob && (
                    /*endDate && startDate &&*/ <div
                        className={styles.calendarAnimWrapper}
                    >
                        {/* <DatePickerPanel
                            end={endDate}
                            onDateChange={handleDateChange}
                        /> */}

                        <div className={styles.calendarContainer}>
                            <Calendar
                                startDate={selectedJob.lastPayment}
                                endDate={selectedJob.nextPayment}
                                shiftList={shiftList}
                                onSetShiftList={setShiftList}
                            ></Calendar>
                            <Summary
                                shiftList={shiftList}
                                searchDates={{
                                    start: selectedJob.lastPayment,
                                    end: selectedJob.nextPayment,
                                }}
                                updateJob={setSelectedJob}
                            />
                        </div>
                    </div>
                )}
            </div>
        </JobContext.Provider>
    );
};

export default Dashboard;
