//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import Paragraph1 from "./HourPriceP1";
import Paragraph2 from "./HourPriceP2";
import Paragraph3 from "./HourPriceP3";
import { formAnswersType } from "../../../utils/form/FormTypes";
import {
    priceStructure,
    workDayStructure,
    workDayType,
} from "../../../../types/job/Position";
import {
    getMeridian,
    getTime12,
} from "../../../utils/form/blocks/time/select/TimeMethods";
import { Job } from "../../../../classes/job/JobPosition";
import { time12Meridian } from "../../../utils/form/blocks/time/Types";
import styles from "./HourPrice.module.scss";
//#endregion

type thisProps = {
    loading: boolean;
    selectedJob: Job;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
    onEnd(updatedJobPosition: Job): void;
};

const HourPrice: FunctionComponent<thisProps> = ({
    loading,
    selectedJob,
    onSetLoading,
    onEnd,
}) => {
    const r = "week";

    const [workdayType, setWorkdayType] = useState<workDayType>(r);
    const [workDayTimeStart, setWorkDayTimeStart] = useState<time12Meridian>(
        selectedJob.getTime(r, "start") ?? "00:00-AM"
    );
    const [workDayTimeEnd, setWorkDayTimeEnd] = useState<time12Meridian>(
        selectedJob.getTime(r, "end") ?? "00:00-PM"
    );
    const [workDayLength, setWorkDayLength] = useState<number>(
        selectedJob.workdayTimes.week.length
    );
    const [finishNextDay, setFinishNextDay] = useState<boolean>(
        selectedJob.workOvernight(r)
    );
    const [workDayPrice, setWorkDayPrice] = useState<number>(
        selectedJob.hourPrice.week.regular
    );
    const [overtimePrice, setOvertimeDayPrice] = useState<number>(
        selectedJob.hourPrice.week.overtime ?? 0
    );
    const [overworkPrice, setOverworkDayPrice] = useState<number>(
        selectedJob.hourPrice.week.overwork ?? 0
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
            workdayType !== "week" &&
            workdayType !== "saturday" &&
            workdayType !== "sunday" &&
            workdayType !== "holiday"
        ) {
            setError("Workday type is not correct");
            return;
        }

        setError("");

        const hourPrice: priceStructure = {
            week: {
                regular: selectedJob.hourPrice.week.regular,
            },
        };

        hourPrice[workdayType] = {
            regular: workDayPrice,
            overtime: overtimePrice,
            overwork: overtimePrice,
        };

        const workdayTimes: workDayStructure = {
            week: selectedJob.workdayTimes.week,
        };

        workdayTimes[workdayType] = {
            startTime: getTime12(workDayTimeStart),
            startMeridian: getMeridian(workDayTimeStart),
            endTime: getTime12(workDayTimeEnd),
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

export default HourPrice;
