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
import styles from "./PricesForm.module.scss";
import { timeStructure } from "../../../utils/form/types/TimeType";
import { getAs24Format } from "../../../utils/form/blocks/time/select/TimeMethods";
import { jobPosition, priceStructure } from "../../../../types/job/Position";
import jobService from "../../../../services/JobService";
import { JobContext } from "../../../dashboard/Dashboard";
//#endregion

export type workdayTimeType = "regular" | "saturday" | "sunday" | "holiday";

type thisProps = {
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
    onEnd(updatedJobPosition: jobPosition): void;
};

const PricesForm: FunctionComponent<thisProps> = ({
    loading,
    onSetLoading,
    onEnd,
}) => {
    const position = useContext(JobContext);

    const [workdayType, setWorkdayType] = useState<workdayTimeType>("regular");
    const [workDayTimeStart, setWorkDayTimeStart] = useState<timeStructure>();
    const [workDayTimeEnd, setWorkDayTimeEnd] = useState<timeStructure>();
    const [finishNextDay, setFinishNextDay] = useState<boolean>(false);
    const [workDayPrice, setWorkDayPrice] = useState<number>();
    const [overtimeStart, setOvertimeStart] = useState<timeStructure>();
    const [overtimeEnd, setOvertimeEnd] = useState<timeStructure>();
    const [overtimePrice, setOvertimeDayPrice] = useState<number>();
    const [workDayLength, setWorkDayLength] = useState<hourNum>();
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
        if (!position) {
            setError("Couldn't find position");
            return;
        }
        if (
            workdayType == null ||
            workDayTimeStart == null ||
            workDayTimeEnd == null ||
            finishNextDay == null ||
            workDayPrice == null ||
            overtimeStart == null ||
            overtimeEnd == null ||
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

        if (
            getAs24Format(overtimeStart) < getAs24Format(workDayTimeEnd) ||
            getAs24Format(overtimeEnd) > getAs24Format(workDayTimeStart)
        ) {
            setError("Overtime time cannot overlap with regular time");
            return;
        }
        if (
            getAs24Format(overtimeStart) !== getAs24Format(workDayTimeEnd) ||
            getAs24Format(overtimeEnd) !== getAs24Format(workDayTimeStart)
        ) {
            setError(
                "There is a gap between the overtime time and the regular time"
            );
            return;
        }
        setError("");

        const hourPrice: priceStructure = {
            regular: {
                normal: position.hourPrice.regular.normal,
            },
        };

        hourPrice[workdayType] = {
            normal: workDayPrice,
            overtime: overtimePrice,
            overwork: overtimePrice,
        };

        const updatedJobPosition: jobPosition = {
            id: position.id,
            name: position.name,
            hourPrice: hourPrice,
            paymentLapse: position.paymentLapse,
            nextPaymentDate: position.nextPaymentDate,
        };
        const responseDb = await jobService.updateJobPosition(
            updatedJobPosition
        );
        if (!responseDb.ok && responseDb.error) {
            setError(responseDb.error.message);
            onSetLoading(false);
            return;
        }

        if (responseDb.ok && responseDb.content) {
            onEnd(updatedJobPosition);
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
                setOvertimeStart={setOvertimeStart}
                setOvertimeEnd={setOvertimeEnd}
                setOvertimeDayPrice={setOvertimeDayPrice}
                overtimeStart={overtimeStart}
                overtimeEnd={overtimeEnd}
                workdayType={workdayType}
                workDayTimeEnd={workDayTimeEnd}
                workDayTimeStart={workDayTimeStart}
                workDayPrice={workDayPrice}
                handleNumberChange={handleNumberChange}
            />
            <Paragraph3
                setWorkDayLength={setWorkDayLength}
                setOverworkDayPrice={setOverworkDayPrice}
                overtimeStart={overtimeStart}
                overtimeEnd={overtimeEnd}
                overtimePrice={overtimePrice}
                workDayTimeStart={workDayTimeStart}
                workDayTimeEnd={workDayTimeEnd}
                workDayLength={workDayLength}
                handleNumberChange={handleNumberChange}
            />

            {workDayLength && overworkPrice && (
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

export default PricesForm;
