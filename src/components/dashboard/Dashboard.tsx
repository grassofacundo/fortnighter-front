import { FunctionComponent, useState, useEffect } from "react";
import Calendar from "../calendar/Calendar";
import FormManager from "../utils/form/FormManager";
import styles from "./Dashboard.module.scss";
import dbService from "../../services/dbService";
import stringService from "../../services/stringService";
import Summary from "../summary/Summary";
import JobPanel from "../jobPanel/jobPanel";

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
    const [jobPositionList, setJobPositionList] = useState<jobPosition[]>([]);
    const [selectedPosition, setSelectedPosition] =
        useState<jobPosition | null>(null);

    // function getSelectedPosition(): jobPosition | void {
    //     return jobPositionList.find((job) => job.id === selectedPosition);
    // }

    useEffect(() => {
        dbService.getJobPositions().then((response) => {
            if (response.ok && response.content) {
                const jobList = response.content as jobPosition[];
                if (jobList.length > 0) jobList[0].isSelected = true;
                setJobPositionList(jobList);
            }
        });
    }, []);

    useEffect(() => {
        const selected = jobPositionList.find(
            (position) => position.isSelected
        );
        if (selected?.id) setSelectedPosition(selected);
    }, [jobPositionList]);

    return (
        <div className={styles.mainBody}>
            <JobPanel
                jobPositionList={jobPositionList}
                onSetJobPositionList={setJobPositionList}
            ></JobPanel>
            {selectedPosition?.id && (
                <div className={styles.calendarContainer}>
                    <Calendar jobPosition={selectedPosition.id}></Calendar>
                    <Summary></Summary>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
