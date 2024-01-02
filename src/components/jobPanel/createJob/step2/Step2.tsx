//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import Paragraph1 from "./Paragraph1";
import Paragraph2 from "./Paragraph2";
import Paragraph3 from "./Paragraph3";
import { hourNum } from "../../../../types/dateService";
import { jobPosition } from "../../../../types/job/Position";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import styles from "./Step2.module.scss";
import { timeStructure } from "../../../utils/form/types/TimeType";
//#endregion

export type workdayTimeType = "regular" | "saturday" | "sunday" | "holiday";

type thisProps = {
    onEnd(updatedJobPosition: jobPosition): void;
    loading: boolean;
    show: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const Step2: FunctionComponent<thisProps> = ({
    onEnd,
    loading,
    show,
    onSetLoading,
}) => {
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

    function handleSubmit() {
        if (
            workdayType !== "regular" &&
            workdayType !== "saturday" &&
            workdayType !== "sunday" &&
            workdayType !== "holiday"
        ) {
            setError("Workday type is not correct");
        }
    }

    return (
        <div
            className={styles.step2}
            style={{ visibility: !show ? "visible" : "hidden" }}
        >
            <Paragraph1
                setWorkdayType={setWorkdayType}
                setWorkDayTimeStart={setWorkDayTimeStart}
                setWorkDayTimeEnd={setWorkDayTimeEnd}
                setWorkDayPrice={setWorkDayPrice}
                setFinishNextDay={setFinishNextDay}
                workDayTimeStart={workDayTimeStart}
                workDayTimeEnd={workDayTimeEnd}
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
                <button
                    className={`${styles.submitButton} ${styles.show}`}
                    onClick={handleSubmit}
                >
                    Save
                </button>
            )}
        </div>
    );
};

export default Step2;
