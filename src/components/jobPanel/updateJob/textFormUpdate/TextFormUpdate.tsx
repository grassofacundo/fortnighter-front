//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useContext,
} from "react";
import Paragraph1 from "./Paragraph1";
import Paragraph2 from "./Paragraph2";
import Paragraph3 from "./Paragraph3";
import { hourNum } from "../../../../types/dateService";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { timeStructure } from "../../../utils/form/types/TimeType";
import {
    priceStructure,
    workDayStructure,
} from "../../../../types/job/Position";
import { JobContext } from "../../../dashboard/Dashboard";
import {
    getMeridian,
    getTime,
} from "../../../utils/form/blocks/time/select/TimeMethods";
import { Job } from "../../../../classes/JobPosition";
import styles from "./TextFormUpdate.module.scss";
//#endregion

export type workdayTimeType = "regular" | "saturday" | "sunday" | "holiday";

type thisProps = {
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
    onEnd(updatedJobPosition: Job): void;
};

const TextFormUpdate: FunctionComponent<thisProps> = ({
    loading,
    onSetLoading,
    onEnd,
}) => {
    const selectedJob = useContext(JobContext);

    const [workdayType, setWorkdayType] = useState<workdayTimeType>("regular");
    const [workDayTimeStart, setWorkDayTimeStart] = useState<timeStructure>();
    const [workDayTimeEnd, setWorkDayTimeEnd] = useState<timeStructure>();
    const [workDayLength, setWorkDayLength] = useState<hourNum>();
    const [finishNextDay, setFinishNextDay] = useState<boolean>(false);
    const [workDayPrice, setWorkDayPrice] = useState<number>();
    const [overtimePrice, setOvertimeDayPrice] = useState<number>();
    const [overworkPrice, setOverworkDayPrice] = useState<number>();
    const [error, setError] = useState<string>("");

    function handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number | undefined>>
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
                handleNumberChange={handleNumberChange}
            />
            <Paragraph3
                setWorkDayLength={setWorkDayLength}
                setOverworkDayPrice={setOverworkDayPrice}
                overtimePrice={overtimePrice}
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
