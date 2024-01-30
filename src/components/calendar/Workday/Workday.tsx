//#region Dependency list
import { FunctionComponent, useContext, useState } from "react";
import {
    getDateAsInputValue,
    getStringDMY,
    parseDateAsId,
} from "../../../services/dateService";
import { JobContext } from "../../dashboard/Dashboard";
import { Shift } from "../../../classes/shift/Shift";
import ShiftForm from "./ShiftForm";
import ShiftSummary from "./ShiftSummary/ShiftSummary";
import styles from "./Workday.module.scss";
import Arrow from "../../blocks/icons/Arrow";
//#endregion

type thisProps = {
    day: Date;
    shift?: Shift;
    onUpdateShift(updatedShift: Shift): void;
    onCreateShift(createdShift: Shift): void;
};

const Workday: FunctionComponent<thisProps> = ({
    day,
    shift,
    onUpdateShift,
    onCreateShift,
}) => {
    const selectedJob = useContext(JobContext);
    const [isExpanded, setIsExpanded] = useState(false);

    function updateShiftList(shiftToSave: Shift): void {
        shift ? onUpdateShift(shiftToSave) : onCreateShift(shiftToSave);
    }

    return (
        <div
            className={`${styles.dayBody} ${isExpanded ? styles.expanded : ""}`}
        >
            <div className={styles.headerContainer}>
                <div className={styles.headerText}>
                    <p>{`${getStringDMY(day)}`}</p>
                    {shift && (
                        <p className={styles.extraInformation}>{`${
                            shift.isHoliday
                                ? "(HOL)"
                                : shift.startsOnSaturday()
                                ? "(SAT)"
                                : shift.startsOnSunday()
                                ? "(SUN)"
                                : ""
                        } Worked ${shift.getHoursWorked()} hours`}</p>
                    )}
                </div>

                <button
                    className={styles.arrowButton}
                    onClick={() => setIsExpanded((v) => !v)}
                >
                    {<Arrow isOpen={isExpanded} />}
                </button>
            </div>
            <div className={styles.contentContainer}>
                {isExpanded && selectedJob && (
                    <>
                        <ShiftForm
                            jobId={selectedJob.id}
                            id={parseDateAsId(day)}
                            date={getDateAsInputValue(day)}
                            onEnd={updateShiftList}
                            shift={shift}
                        />
                        {shift && (
                            <ShiftSummary
                                shift={shift}
                                job={selectedJob}
                                id={parseDateAsId(day)}
                                onEnd={updateShiftList}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Workday;
