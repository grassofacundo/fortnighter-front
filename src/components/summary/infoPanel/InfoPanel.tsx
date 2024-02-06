//#region Dependency list
import { FunctionComponent, useContext } from "react";
import styles from "./InfoPanel.module.scss";
import { getStringDMY } from "../../../services/dateService";
import { JobContext } from "../../dashboard/Dashboard";
import { Shift } from "../../../classes/shift/Shift";
import {
    applyByDailyAmountModifiers,
    applyByShiftModifiers,
    applyByTotalAmountModifiers,
    getGrossTotal,
    getNetTotal,
    getSaturdays,
    getSundays,
    modificationByShift,
} from "../../../services/summaryService";
import { Modifier } from "../../../classes/modifier/Modifier";
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
                    <p>{`Total gross made: $${getGrossTotal(
                        shiftList,
                        job,
                        start,
                        end
                    )}`}</p>
                    <p>{`Total net made: $${getNetTotal(
                        shiftList,
                        job,
                        start,
                        end
                    )}`}</p>
                    <p>{`Shifts worked: ${shiftList.length}`}</p>
                    <p>{`Saturdays worked: ${getSaturdays(shiftList)}`}</p>
                    <p>{`Sundays worked: ${getSundays(shiftList)}`}</p>
                    {applyByShiftModifiers(
                        job,
                        shiftList.length,
                        getGrossTotal(shiftList, job, start, end)
                    ).map((res, i) => (
                        <p key={i}>{`${res.modifier.name} (${
                            res.modifier.amount.increase ? "Bonus" : "Tax"
                        }): $${res.amount}`}</p>
                    ))}
                    {applyByDailyAmountModifiers(job, shiftList).map(
                        (res, i) => (
                            <p key={i}>{`${res.modifier.name} (${
                                res.modifier.amount.increase ? "Bonus" : "Tax"
                            }): $${res.amount}`}</p>
                        )
                    )}
                    {applyByTotalAmountModifiers(
                        job,
                        getGrossTotal(shiftList, job, start, end)
                    ).map((res, i) => (
                        <p key={i}>{`${res.modifier.name} (${
                            res.modifier.amount.increase ? "Bonus" : "Tax"
                        }): $${res.amount}`}</p>
                    ))}
                    <p>{`Next payment: ${getStringDMY(
                        job.nextPaymentDate
                    )}`}</p>
                </div>
            )}
            {shiftList.length <= 0 && (
                <p>No shifts registered in the selected dates</p>
            )}
        </div>
    );
};

export default InfoPanel;
