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
//#endregion

type thisProps = unknown;

/*
TO DO
Use mongo ID to set jobPosition id
Allow editing of jobPosition (position name, company name, etc)
Allow deleting jobPosition

-----------
Set all logic related to shifts
*/

const Dashboard: FunctionComponent<thisProps> = () => {
    const [selectedPosition, setSelectedPosition] =
        useState<jobPosition | null>(null);
    const [searchDates, setSearchDates] = useState<{
        start: Date | null;
        end: Date | null;
    }>({ start: null, end: null });
    const [shiftList, setShiftList] = useState<shiftState[]>([]);

    useEffect(() => {
        if (
            searchDates.start === null ||
            searchDates.end === null ||
            !selectedPosition
        )
            return;

        const startDate: Date = searchDates.start;
        const endDate: Date = searchDates.end;
        const positionId: string = selectedPosition.id;
        shiftService
            .getShifts(startDate, endDate, positionId)
            .then((shiftList) => {
                const shiftsStates = shiftList.map((shiftBase) =>
                    shiftService.getShiftAsState(shiftBase)
                );
                setShiftList(shiftsStates);
            });
    }, [searchDates, selectedPosition]);

    return (
        <div className={styles.mainBody}>
            <JobPanel
                selectedPosition={selectedPosition}
                onSetSelectedPosition={setSelectedPosition}
            ></JobPanel>

            <DatePicker onSetSearchDates={setSearchDates}></DatePicker>
            {selectedPosition && (
                <div className={styles.calendarContainer}>
                    {searchDates.start && searchDates.end && (
                        <Calendar
                            searchDates={searchDates}
                            jobPositionId={selectedPosition.id}
                            shiftList={shiftList}
                        ></Calendar>
                    )}
                    <Summary
                        shiftList={shiftList}
                        position={selectedPosition}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
