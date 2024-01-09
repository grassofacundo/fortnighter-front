//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import Paragraph1 from "./Paragraph1";
import Paragraph2 from "./Paragraph2";
import Paragraph3 from "./Paragraph3";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { timeStructure } from "../../../utils/form/types/TimeType";
import {
    priceStructure,
    workDayStructure,
    workDayType,
} from "../../../../types/job/Position";
import {
    getMeridian,
    getTime,
} from "../../../utils/form/blocks/time/select/TimeMethods";
import { Job } from "../../../../classes/JobPosition";
import styles from "./TextFormUpdate.module.scss";
//#endregion

type thisProps = {
    loading: boolean;
    selectedJob: Job;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
    onEnd(updatedJobPosition: Job): void;
};

const TextFormUpdate: FunctionComponent<thisProps> = ({
    loading,
    selectedJob,
    onSetLoading,
    onEnd,
}) => {
    const r = "regular";

    const [workdayType, setWorkdayType] = useState<workDayType>(r);
    const [workDayTimeStart, setWorkDayTimeStart] = useState<timeStructure>(
        selectedJob.getTime(r, "start") ?? "00:00-AM"
    );
    const [workDayTimeEnd, setWorkDayTimeEnd] = useState<timeStructure>(
        selectedJob.getTime(r, "end") ?? "00:00-PM"
    );
    const [workDayLength, setWorkDayLength] = useState<number>(
        selectedJob.workdayTimes.regular.length
    );
    const [finishNextDay, setFinishNextDay] = useState<boolean>(
        selectedJob.workOvernight(r)
    );
    const [workDayPrice, setWorkDayPrice] = useState<number>(
        selectedJob.hourPrice.regular.normal
    );
    const [overtimePrice, setOvertimeDayPrice] = useState<number>(
        selectedJob.hourPrice.regular.overtime ?? 0
    );
    const [overworkPrice, setOverworkDayPrice] = useState<number>(
        selectedJob.hourPrice.regular.overwork ?? 0
    );
    const [error, setError] = useState<string>("");

    function handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number>>
    ) {
        try {
            const valueNum = Number(answer.value);
            callback(valueNum);
        } catch (error) {
            alert(error);
        }
    }

    async function handleSubmit() {
        if (selectedJob === null) {
            setError("Couldn't find position");
            return;
        }
        if (
            workdayType == null ||
            workDayTimeStart == null ||
            workDayTimeEnd == null ||
            finishNextDay == null ||
            workDayPrice == null ||
            overtimePrice == null ||
            workDayLength == null ||
            overworkPrice == null
        ) {
            setError("Complete every field to continue");
            return;
        }
        if (
            workdayType !== "regular" &&
            workdayType !== "saturday" &&
            workdayType !== "sunday" &&
            workdayType !== "holiday"
        ) {
            setError("Workday type is not correct");
            return;
        }

        setError("");

        const hourPrice: priceStructure = {
            regular: {
                normal: selectedJob.hourPrice.regular.normal,
            },
        };

        hourPrice[workdayType] = {
            normal: workDayPrice,
            overtime: overtimePrice,
            overwork: overtimePrice,
        };

        const workdayTimes: workDayStructure = {
            regular: selectedJob.workdayTimes.regular,
        };

        workdayTimes[workdayType] = {
            startTime: getTime(workDayTimeStart),
            startMeridian: getMeridian(workDayTimeStart),
            endTime: getTime(workDayTimeEnd),
            endMeridian: getMeridian(workDayTimeEnd),
            length: workDayLength,
        };

        const job = new Job({
            id: selectedJob.id,
            name: selectedJob.name,
            hourPrice: hourPrice,
            workdayTimes,
            paymentLapse: selectedJob.paymentLapse,
            nextPaymentDate: selectedJob.nextPaymentDate,
        });
        const responseDb = await job.update();
        if (!responseDb.ok && responseDb.error) {
            setError(responseDb.error.message);
            onSetLoading(false);
            return;
        }

        if (responseDb.ok && responseDb.content) {
            onEnd(job);
            onSetLoading(false);
        }
    }

    return (
        <div className={styles.priceFormBody}>
            <Paragraph1
                setWorkdayType={setWorkdayType}
                setWorkDayTimeStart={setWorkDayTimeStart}
                setWorkDayTimeEnd={setWorkDayTimeEnd}
                setWorkDayPrice={setWorkDayPrice}
                setFinishNextDay={setFinishNextDay}
                workDayPrice={workDayPrice}
                workDayTimeStart={workDayTimeStart}
                workDayTimeEnd={workDayTimeEnd}
                finishNextDay={finishNextDay}
                handleNumberChange={handleNumberChange}
            />
            <Paragraph2
                setOvertimeDayPrice={setOvertimeDayPrice}
                workdayType={workdayType}
                workDayTimeEnd={workDayTimeEnd}
                workDayTimeStart={workDayTimeStart}
                workDayPrice={workDayPrice}
                overtimePrice={overtimePrice}
                handleNumberChange={handleNumberChange}
            />
            <Paragraph3
                setWorkDayLength={setWorkDayLength}
                setOverworkDayPrice={setOverworkDayPrice}
                workdayType={workdayType}
                overtimePrice={overtimePrice}
                overworkPrice={overworkPrice}
                workDayTimeStart={workDayTimeStart}
                workDayTimeEnd={workDayTimeEnd}
                workDayLength={workDayLength}
                handleNumberChange={handleNumberChange}
            />

            {workDayLength && overworkPrice && selectedJob && (
                <>
                    <button
                        className={`${styles.submitButton} ${styles.show}`}
                        onClick={handleSubmit}
                    >
                        {loading ? "Loading" : "Save"}
                    </button>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </>
            )}
        </div>
    );
};

export default TextFormUpdate;
