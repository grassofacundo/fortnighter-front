//#region Dependency list
import { FunctionComponent } from "react";
import { shiftState } from "../../types/job/Shift";
import styles from "./Summary.module.scss";
import { jobPosition } from "../../types/job/Position";
import { getStringDMY } from "../../services/dateService";
//#endregion

type thisProps = {
    shiftList: shiftState[];
    position: jobPosition;
};

const Summary: FunctionComponent<thisProps> = ({ shiftList, position }) => {
    function getStartDate(): string {
        if (!shiftList || shiftList.length <= 0) return "";

        const firstDate = shiftList[0].date;
        return getStringDMY(firstDate);
    }

    function getEndDate(): string {
        if (!shiftList || shiftList.length <= 0) return "";

        const firstDate = shiftList[shiftList.length - 1].date;
        return getStringDMY(firstDate);
    }

    function getTotal(): number {
        let total = 0;
        shiftList.forEach(
            (shift) => (total += shift.hoursWorked * position.hourPrice)
        );
        return total;
    }

    return (
        <div className={styles.summaryBody}>
            {getStartDate() && getEndDate() && (
                <p>{`Total made from ${getStartDate()} to ${getEndDate()}: ${getTotal()}`}</p>
            )}
        </div>
    );
};

export default Summary;
