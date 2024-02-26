//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    ReactElement,
} from "react";
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
import { JobContext } from "../../jobPanel";
import styles from "./HourPrice.module.scss";
//#endregion

type thisProps = {
    workdayType: workDayType;
    loading: boolean;
    children: ReactElement;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const HourPriceContent: FunctionComponent<thisProps> = ({
    loading,
    workdayType,
    children,
    onSetLoading,
}) => {
    const jobCtx = useContext(JobContext);
    const selectedJob = jobCtx?.selectedJob;
    const onEnd = jobCtx?.updateList;

    const [workDayTimeStart, setWorkDayTimeStart] = useState<time12Meridian>();
    const [workDayTimeEnd, setWorkDayTimeEnd] = useState<time12Meridian>();
    const [workDayLength, setWorkDayLength] = useState<number>(0);
    const [finishNextDay, setFinishNextDay] = useState<boolean>(false);
    const [workDayPrice, setWorkDayPrice] = useState<number>();
    const [overtimePrice, setOvertimeDayPrice] = useState<number>();
    const [overworkPrice, setOverworkDayPrice] = useState<number>();
    const [error, setError] = useState<string>("");

    function handleNumberChange(
        answer: formAnswersType,
        callback: (v: number) => void
    ) {
        try {
            const valueNum = Number(answer.value);
            callback(valueNum);
        } catch (error) {
            alert(error);
        }
    }

    async function handleSubmit() {
        if (!selectedJob || !onEnd) {
            setError("Couldn't find job information");
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
            lastPayment: selectedJob.lastPayment,
            nextPayment: selectedJob.nextPayment,
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

    useEffect(() => {
        const form = document.querySelector(
            "#hourPriceForm"
        ) as HTMLFormElement;
        if (form) form.reset();

        const startTime = selectedJob?.getTime(workdayType, "start");
        setWorkDayTimeStart(startTime);

        const endTime = selectedJob?.getTime(workdayType, "end");
        setWorkDayTimeEnd(endTime);

        const dayLength = selectedJob?.workdayTimes?.[workdayType]?.length;
        setWorkDayLength(dayLength ?? 0);

        const nextDay = selectedJob?.workOvernight(workdayType);
        setFinishNextDay(!!nextDay);

        const price = selectedJob?.hourPrice?.[workdayType]?.regular;
        setWorkDayPrice(price);

        const overtime = selectedJob?.hourPrice?.[workdayType]?.overtime;
        setOvertimeDayPrice(overtime);

        const overwork = selectedJob?.hourPrice?.[workdayType]?.overwork;
        setOverworkDayPrice(overwork);
    }, [workdayType, selectedJob]);

    return (
        <>
            <Paragraph1
                setWorkDayTimeStart={(v: time12Meridian) =>
                    setWorkDayTimeStart(v)
                }
                setWorkDayTimeEnd={(v: time12Meridian) => setWorkDayTimeEnd(v)}
                setWorkDayPrice={(v: number) => setWorkDayPrice(v)}
                setFinishNextDay={(v: boolean) => setFinishNextDay(v)}
                handleNumberChange={handleNumberChange}
                workDayPrice={workDayPrice}
                workDayTimeStart={workDayTimeStart}
                workDayTimeEnd={workDayTimeEnd}
                finishNextDay={finishNextDay}
                children={children}
            />
            <Paragraph2
                setOvertimeDayPrice={(v: number) => setOvertimeDayPrice(v)}
                workdayType={workdayType}
                workDayTimeEnd={workDayTimeEnd}
                workDayTimeStart={workDayTimeStart}
                workDayPrice={workDayPrice}
                overtimePrice={overtimePrice}
                handleNumberChange={handleNumberChange}
            />
            <Paragraph3
                setWorkDayLength={(v: number) => setWorkDayLength(v)}
                setOverworkDayPrice={(v: number) => setOverworkDayPrice(v)}
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
        </>
    );
};

export default HourPriceContent;
