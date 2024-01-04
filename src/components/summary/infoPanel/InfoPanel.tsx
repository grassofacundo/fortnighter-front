//#region Dependency list
import { FunctionComponent, useContext } from "react";
import styles from "./InfoPanel.module.scss";
import { getStringDMY } from "../../../services/dateService";
import { shiftState } from "../../../types/job/Shift";
import { JobContext } from "../../dashboard/Dashboard";
//#endregion

type thisProps = {
    shiftList: shiftState[];
    start: Date;
    end: Date;
};

const InfoPanel: FunctionComponent<thisProps> = ({ shiftList, start, end }) => {
    const position = useContext(JobContext);

    function getSaturdays() {
        const saturdays = shiftList.filter((shift) => shift.isSaturday);
        return saturdays.length;
    }

    function getSundays() {
        const sundays = shiftList.filter((shift) => shift.isSunday);
        return sundays.length;
    }

    function getTotal(): number {
        if (!position) return 0;

        let total = 0;
        shiftList.forEach((shift) => {
            if (shift.startTime >= start && shift.endTime <= end)
                total += shift.hoursWorked * 1; //position.hourPrice;
        });
        return total;
    }
    return (
        <div className={styles.infoPanel}>
            {position && shiftList.length > 0 && (
                <div>
                    <p>{`Next payment: ${getStringDMY(
                        position.nextPaymentDate
                    )}`}</p>
                    <p>{`Total made: $${getTotal()}`}</p>
                    <p>{`Saturdays worked: ${getSaturdays()}`}</p>
                    <p>{`Sundays worked: ${getSundays()}`}</p>
                </div>
            )}
            {shiftList.length <= 0 && (
                <p>No shifts registered in the selected dates</p>
            )}
        </div>
    );
};

export default InfoPanel;
