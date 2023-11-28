//#region Dependency list
import { FunctionComponent, useState } from "react";
import Calendar from "../calendar/Calendar";
import Summary from "../summary/Summary";
import JobPanel from "../jobPanel/jobPanel";
import { jobPosition } from "../../types/job/Position";
import styles from "./Dashboard.module.scss";
import dateS from "../../services/dateService";
import DatePicker from "../datePicker/DatePicker";
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
    const [start, setStart] = useState<Date>(dateS.getPastDate(15));
    const [end, setEnd] = useState<Date>(dateS.getToday());

    return (
        <div className={styles.mainBody}>
            <JobPanel
                selectedPosition={selectedPosition}
                onSetSelectedPosition={setSelectedPosition}
            ></JobPanel>

            <DatePicker onSetStart={setStart} onSetEnd={setEnd}></DatePicker>
            {selectedPosition && (
                <div className={styles.calendarContainer}>
                    <Calendar jobPositionId={selectedPosition.id}></Calendar>
                    <Summary></Summary>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
