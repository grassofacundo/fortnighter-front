//#region Dependency list
import { FunctionComponent, useState, useEffect } from "react";
import Calendar from "../calendar/Calendar";
import FormManager from "../utils/form/FormManager";
import styles from "./Dashboard.module.scss";
import dbService from "../../services/JobService";
import stringService from "../../services/stringService";
import Summary from "../summary/Summary";
import JobPanel from "../jobPanel/jobPanel";
import { jobPosition } from "../../types/job/Position";
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

    // function getSelectedPosition(): jobPosition | void {
    //     return jobPositionList.find((job) => job.id === selectedPosition);
    // }

    // useEffect(() => {
    //     const selected = jobPositionList.find(
    //         (position) => position.isSelected
    //     );
    //     if (selected?.id) setSelectedPosition(selected);
    // }, [jobPositionList]);

    return (
        <div className={styles.mainBody}>
            <JobPanel
                selectedPosition={selectedPosition}
                onSetSelectedPosition={setSelectedPosition}
            ></JobPanel>
            {selectedPosition && (
                <div className={styles.calendarContainer}>
                    <Calendar jobPosition={selectedPosition.id}></Calendar>
                    <Summary></Summary>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
