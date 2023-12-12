//#region Dependency list
import { FunctionComponent, useState, useEffect } from "react";
import Calendar from "../calendar/Calendar";
import Summary from "../summary/Summary";
import JobPanel from "../jobPanel/jobPanel";
import { jobPosition } from "../../types/job/Position";
import styles from "./Dashboard.module.scss";
import DatePicker from "../datePicker/DatePicker";
import shiftService from "../../services/shiftService";
import { shiftState } from "../../types/job/Shift";
import InOutAnim from "../utils/InOutAnim";
import { getPastDate } from "../../services/dateService";
//#endregion

type thisProps = unknown;

const Dashboard: FunctionComponent<thisProps> = () => {
    const [selectedPosition, setSelectedPosition] =
        useState<jobPosition | null>(null);
    const [endDate, setEndDate] = useState<Date>();
    const [shiftList, setShiftList] = useState<shiftState[]>([]);

    function handleDateChange(end: Date) {
        setEndDate(end);
    }

    function getDates(selectedPosition: jobPosition) {
        const nextPaySplit = selectedPosition.cycleEnd;
        const end = nextPaySplit ?? new Date();
        const daysBetweenPayment = selectedPosition.isFortnightly ? 15 : 30;
        const start = getPastDate(daysBetweenPayment, end);
        return { start, end };
    }

    useEffect(() => {
        if (!selectedPosition) return;

        const { start, end } = getDates(selectedPosition);
        shiftService
            .getShifts(start, end, selectedPosition.id)
            .then((shiftList) => {
                const shiftsStates = shiftList.map((shiftBase) =>
                    shiftService.getShiftAsState(shiftBase)
                );
                setShiftList(shiftsStates);
                setEndDate(end);
            });
    }, [selectedPosition]);

    return (
        <div className={styles.mainBody}>
            <JobPanel
                selectedPosition={selectedPosition}
                onSetSelectedPosition={setSelectedPosition}
            ></JobPanel>
            {selectedPosition && endDate && (
                <InOutAnim inState={!!(selectedPosition && endDate)}>
                    <DatePicker
                        onChange={handleDateChange}
                        endDate={selectedPosition.cycleEnd}
                        initialLapseBetweenDated={
                            selectedPosition.isFortnightly ? 15 : 30
                        }
                        pastDaysLimit={60}
                        futureDaysLimit={30}
                    ></DatePicker>
                    <div className={styles.calendarContainer}>
                        <Calendar
                            endDate={endDate}
                            distanceBetweenDates={
                                selectedPosition.isFortnightly ? 15 : 30
                            }
                            jobPositionId={selectedPosition.id}
                            shiftList={shiftList}
                            onSetShiftList={setShiftList}
                        ></Calendar>
                        {shiftList.length > 0 && (
                            <Summary
                                shiftList={shiftList}
                                position={selectedPosition}
                                searchDates={{
                                    start: getPastDate(
                                        selectedPosition.isFortnightly
                                            ? 15
                                            : 30,
                                        endDate
                                    ),
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
