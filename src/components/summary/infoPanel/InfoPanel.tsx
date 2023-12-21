//#region Dependency list
import { FunctionComponent } from "react";
import styles from "./InfoPanel.module.scss";
import { getStringDMY } from "../../../services/dateService";
import { shiftState } from "../../../types/job/Shift";
import { jobPosition } from "../../../types/job/Position";
//#endregion

type thisProps = {
    shiftList: shiftState[];
    position: jobPosition;
    start: Date;
    end: Date;
};

const InfoPanel: FunctionComponent<thisProps> = ({
    shiftList,
    position,
    start,
    end,
}) => {
    function getSaturdays() {
        const saturdays = shiftList.filter((shift) => shift.isSaturday);
        return saturdays.length;
    }

    function getSundays() {
        const sundays = shiftList.filter((shift) => shift.isSunday);
        return sundays.length;
    }

    function getTotal(): number {
        let total = 0;
        shiftList.forEach((shift) => {
            if (shift.date >= start && shift.date <= end)
                total += shift.hoursWorked * position.hourPrice;
        });
        return total;
    }
    return (
        <div className={styles.infoPanel}>
            <p>{`Next payment: ${getStringDMY(position.nextPaymentDate)}`}</p>
            <p>{`Total made: $${getTotal()}`}</p>
            <p>{`Saturdays worked: ${getSaturdays()}`}</p>
            <p>{`Sundays worked: ${getSundays()}`}</p>
        </div>
    );
};

export default InfoPanel;
