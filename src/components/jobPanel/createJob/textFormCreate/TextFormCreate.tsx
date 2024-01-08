//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import { timeStructure } from "../../../utils/form/types/TimeType";
import { hourNum } from "../../../../types/dateService";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import {
    priceStructure,
    workDayStructure,
} from "../../../../types/job/Position";
import Paragraph1 from "./Paragraph1";
import Paragraph2 from "./Paragraph2";
import Paragraph3 from "./Paragraph3";
import {
    getMeridian,
    getTime,
} from "../../../utils/form/blocks/time/select/TimeMethods";
import { textFormData } from "../CreateJob";
import styles from "./TextFormCreate.module.scss";
//#endregion

type thisProps = {
    onSetLoading: Dispatch<SetStateAction<boolean>>;
    onSetError: Dispatch<SetStateAction<string>>;
    onEnd: (textFormData: textFormData) => void;
    error: string;
    loading: boolean;
};

const TextFormCreate: FunctionComponent<thisProps> = ({
    onSetError,
    onEnd,
    error,
    loading,
}) => {
    const [workDayTimeStart, setWorkDayTimeStart] = useState<timeStructure>();
    const [workDayTimeEnd, setWorkDayTimeEnd] = useState<timeStructure>();
    const [workDayLength, setWorkDayLength] = useState<hourNum>();
    const [workDayPrice, setWorkDayPrice] = useState<number>();
    const [overtimePrice, setOvertimeDayPrice] = useState<number>();
    const [overworkPrice, setOverworkDayPrice] = useState<number>();

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
        if (
            workDayTimeStart == null ||
            workDayTimeEnd == null ||
            workDayPrice == null ||
            overtimePrice == null ||
            workDayLength == null ||
            overworkPrice == null
        ) {
            onSetError("Complete every field to continue");
            return;
        }

        onSetError("");

        const prices: priceStructure = {
            regular: {
                normal: workDayPrice,
                overtime: overtimePrice,
                overwork: overtimePrice,
            },
        };

        const workdayTimes: workDayStructure = {
            regular: {
                startTime: getTime(workDayTimeStart),
                startMeridian: getMeridian(workDayTimeStart),
                endTime: getTime(workDayTimeEnd),
                endMeridian: getMeridian(workDayTimeEnd),
                length: workDayLength,
            },
        };

        onEnd({ prices, workdayTimes });
    }

    return (
        <div className={styles.textFormBody}>
            <Paragraph1
                setWorkDayTimeStart={setWorkDayTimeStart}
                setWorkDayTimeEnd={setWorkDayTimeEnd}
                setWorkDayPrice={setWorkDayPrice}
                workDayTimeStart={workDayTimeStart}
                workDayTimeEnd={workDayTimeEnd}
                handleNumberChange={handleNumberChange}
            />
            <Paragraph2
                setOvertimeDayPrice={setOvertimeDayPrice}
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

            {workDayLength && overworkPrice && (
                <>
                    <button
                        className={`${styles.submitButton} ${styles.show}`}
                        onClick={handleSubmit}
                    >
                        {loading ? "Loading" : "Create Job"}
                    </button>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </>
            )}
        </div>
    );
};

export default TextFormCreate;
