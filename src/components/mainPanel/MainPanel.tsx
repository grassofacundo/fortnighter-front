//#region Dependency list
import { FunctionComponent, useContext, useEffect, useState } from "react";
import styles from "./MainPanel.module.scss";
import Calendar from "../calendar/Calendar";
import Summary from "../summary/Summary";
import { ContentContext } from "../dashboard/Dashboard";
import { Shift } from "../../classes/shift/Shift";
import shiftService from "../../services/shiftService";
//#endregion

type thisProps = unknown;

const MainPanel: FunctionComponent<thisProps> = () => {
    const content = useContext(ContentContext);
    const { job, setJob } = content;
    const [shiftList, setShiftList] = useState<Shift[]>([]);

    useEffect(() => {
        const start = job.lastPayment;
        const end = job.nextPayment;
        shiftService.getShifts(start, end, job.id).then((shiftList) => {
            const shifts = shiftList.map((shiftFromDb) =>
                shiftService.convertShiftFromDbToShift(shiftFromDb, job.id)
            );
            setShiftList(shifts);
        });
    }, [job]);

    return (
        <div className={styles.calendarAnimWrapper}>
            <div className={styles.calendarContainer}>
                <Calendar
                    startDate={job.lastPayment}
                    endDate={job.nextPayment}
                    shiftList={shiftList}
                    onSetShiftList={setShiftList}
                ></Calendar>
                <Summary
                    shiftList={shiftList}
                    searchDates={{
                        start: job.lastPayment,
                        end: job.nextPayment,
                    }}
                    updateJob={setJob}
                />
            </div>
        </div>
    );
};

export default MainPanel;
