//#region Dependency list
import { FunctionComponent, useContext } from "react";
import styles from "./InfoPanel.module.scss";
import { getStringDMY } from "../../../services/dateService";
import { JobContext } from "../../dashboard/Dashboard";
import { Shift } from "../../../classes/shift/Shift";
import {
    getSaturdays,
    getSundays,
    getTotal,
} from "../../../services/summaryService";
//#endregion

type thisProps = {
    shiftList: Shift[];
    start: Date;
    end: Date;
};

const InfoPanel: FunctionComponent<thisProps> = ({ shiftList, start, end }) => {
    const job = useContext(JobContext);

    return (
        <div className={styles.infoPanel}>
            {job && shiftList.length > 0 && (
                <div>
                    <p>{`Total made: $${getTotal(
                        shiftList,
                        job,
                        start,
                        end
                    )}`}</p>
                    <p>{`Next payment: ${getStringDMY(
                        job.nextPaymentDate
                    )}`}</p>
                    <p>{`Saturdays worked: ${getSaturdays(shiftList)}`}</p>
                    <p>{`Sundays worked: ${getSundays(shiftList)}`}</p>
                </div>
            )}
            {shiftList.length <= 0 && (
                <p>No shifts registered in the selected dates</p>
            )}
        </div>
    );
};

export default InfoPanel;
