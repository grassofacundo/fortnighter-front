//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction, useContext } from "react";
import styles from "./InfoPanel.module.scss";
import { getStringDMY } from "../../../services/dateService";
import { Shift } from "../../../classes/shift/Shift";
import {
    applyByDailyAmountModifiers,
    applyByPaymentModifiers,
    applyByShiftModifiers,
    applyByTotalAmountModifiers,
    getGrossTotal,
    getNetTotal,
    getSaturdays,
    getSundays,
} from "../../../services/summaryService";
import { Job } from "../../../classes/job/JobPosition";
import { ContentContext } from "../../dashboard/Dashboard";
import jobService from "../../../services/JobService";
//#endregion

type thisProps = {
    shiftList: Shift[];
    start: Date;
    end: Date;
    updateJob: Dispatch<SetStateAction<Job | null>>;
};

const InfoPanel: FunctionComponent<thisProps> = ({
    shiftList,
    start,
    end,
    updateJob,
}) => {
    const { job } = useContext(ContentContext);

    async function savePayment() {
        if (!job) return;

        const response = await jobService.createPayment(shiftList, job.id);
        if (response.ok && response.content) {
            const lastPayment = new Date(response.content.newLastPayment);
            const nextPayment = new Date(response.content.newNextPayment);
            const modifiers = job.modifiers.filter((m) => !m.byPayment);
            const updatedJob = new Job(
                structuredClone({
                    ...job,
                    modifiers,
                    lastPayment,
                    nextPayment,
                })
            );
            updateJob(updatedJob);
        }
    }

    const shifts = shiftList.filter((s) => s.start >= start && s.end <= end);
    return (
        <div className={styles.infoPanel}>
            {job && shifts.length > 0 && (
                <div>
                    <p>{`Total gross made: $${getGrossTotal(shifts, job)}`}</p>
                    <p>{`Total net made: $${getNetTotal(shifts, job)}`}</p>
                    <p>{`Shifts worked: ${shifts.length}`}</p>
                    <p>{`Saturdays worked: ${getSaturdays(shifts)}`}</p>
                    <p>{`Sundays worked: ${getSundays(shifts)}`}</p>
                    {applyByShiftModifiers(
                        job,
                        shifts.length,
                        getGrossTotal(shifts, job)
                    ).map((res, i) => (
                        <p key={i}>{`${res.modifier.name} (${
                            res.modifier.amount.increase ? "Bonus" : "Tax"
                        }): $${res.amount}`}</p>
                    ))}
                    {applyByDailyAmountModifiers(job, shifts).map((res, i) => (
                        <p key={i}>{`${res.modifier.name} (${
                            res.modifier.amount.increase ? "Bonus" : "Tax"
                        }): $${res.amount}`}</p>
                    ))}
                    {applyByTotalAmountModifiers(
                        job,
                        getGrossTotal(shifts, job)
                    ).map((res, i) => (
                        <p key={i}>{`${res.modifier.name} (${
                            res.modifier.amount.increase ? "Bonus" : "Tax"
                        }): $${res.amount}`}</p>
                    ))}
                    {applyByPaymentModifiers(
                        job,
                        getGrossTotal(shifts, job)
                    ).map((res, i) => (
                        <p key={i}>{`${res.modifier.name} (${
                            res.modifier.amount.increase ? "Bonus" : "Tax"
                        }): $${res.amount}`}</p>
                    ))}
                    <p>{`Next payment: ${getStringDMY(job.nextPayment)}`}</p>
                    <button onClick={savePayment}>Save payment</button>
                </div>
            )}
            {shifts.length <= 0 && <p>No shifts registered</p>}
        </div>
    );
};

export default InfoPanel;
