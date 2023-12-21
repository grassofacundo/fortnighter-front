//#region Dependency list
import { FunctionComponent, useState, useEffect } from "react";
import Calendar from "../calendar/Calendar";
import Summary from "../summary/Summary";
import JobPanel from "../jobPanel/jobPanel";
import { jobPosition } from "../../types/job/Position";
import styles from "./Dashboard.module.scss";
import shiftService from "../../services/shiftService";
import { shiftState } from "../../types/job/Shift";
import InOutAnim from "../utils/InOutAnim";
import { datesAreEqual, getPastDate } from "../../services/dateService";
import DatePickerPanel from "./datePickerPanel/DatePickerPanel";
//#endregion

type thisProps = unknown;

const Dashboard: FunctionComponent<thisProps> = () => {
    const [selectedPosition, setSelectedPosition] =
        useState<jobPosition | null>(null);
    const [endDate, setEndDate] = useState<Date>();
    const [startDate, setStartDate] = useState<Date>();
    const [shiftList, setShiftList] = useState<shiftState[]>([]);

    function handleDateChange(end: Date, start: Date) {
        setEndDate(end);
        setStartDate(start);
    }

    function getDates(selectedPosition: jobPosition) {
        const nextPaySplit = selectedPosition.nextPaymentDate;
        const end = nextPaySplit ?? new Date();
        const daysBetweenPayment = selectedPosition.paymentLapse;
        const start = getPastDate(daysBetweenPayment, end);
        return { start, end };
    }

    useEffect(() => {
        if (!selectedPosition) return;

        const { start, end } = getDates(selectedPosition);
        const shiftStart = startDate ?? start;
        const shiftEnd = endDate ?? end;
        if (!startDate || !endDate || !datesAreEqual(startDate, start)) {
            shiftService
                .getShifts(shiftStart, shiftEnd, selectedPosition.id)
                .then((shiftList) => {
                    const shiftsStates = shiftList.map((shiftBase) =>
                        shiftService.getShiftAsState(shiftBase)
                    );
                    setShiftList(shiftsStates);
                    if (!startDate) setStartDate(shiftStart);
                    if (!endDate) setEndDate(shiftEnd);
                });
        }
    }, [selectedPosition, endDate, startDate]);

    return (
        <div className={styles.mainBody}>
            <JobPanel
                selectedPosition={selectedPosition}
                onSetSelectedPosition={setSelectedPosition}
            ></JobPanel>
            {selectedPosition && endDate && startDate && (
                <InOutAnim
                    inState={!!(selectedPosition && endDate)}
                    customClass={styles.calendarAnimWrapper}
                >
                    <DatePickerPanel
                        position={selectedPosition}
                        end={endDate}
                        onDateChange={handleDateChange}
                    />

                    <div className={styles.calendarContainer}>
                        <Calendar
                            endDate={endDate}
                            startDate={startDate}
                            jobPositionId={selectedPosition.id}
                            shiftList={shiftList}
                            onSetShiftList={setShiftList}
                        ></Calendar>
                        {shiftList.length > 0 && (
                            <Summary
                                shiftList={shiftList}
                                position={selectedPosition}
                                searchDates={{
                                    start: startDate,
                                    end: endDate,
                                }}
                            />
                        )}
                    </div>
                </InOutAnim>
            )}
        </div>
    );
};

export default Dashboard;
