//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import styles from "./CreateJob.module.scss";
import CustomSelect from "../../blocks/customSelect/CustomSelect";
import { jobPosition } from "../../../types/job/Position";
import InputTime from "../../utils/form/blocks/time/Time";
import { formAnswersType } from "../../../types/form/FormTypes";
import { inputNumber } from "../../../types/form/InputNumberTypes";
import { inputTimeType } from "../../../types/form/TimeType";
import InputNumber from "../../utils/form/blocks/number/InputNumber";
import { hourNum, minuteNum } from "../../../types/dateService";
//#endregion

type workdayType = "regular" | "saturday" | "sunday" | "holiday";
type workdayTime = `${hourNum}:${minuteNum}`;
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
    const [workdayType, setWorkdayType] = useState<workdayType>("regular");
    const [workDayTimeStart, setWorkDayTimeStart] = useState<workdayTime>();
    const [workDayTimeEnd, setWorkDayTimeEnd] = useState<workdayTime>();
    const [workDayPrice, setWorkDayPrice] = useState<number>(20);
    const [overtimeStart, setOvertimeStart] = useState<workdayTime>();
    const [overtimeEnd, setOvertimeEnd] = useState<workdayTime>();
    const [overtimePrice, setOvertimeDayPrice] = useState<number>(30);
    const [workDayLength, setWorkDayLength] = useState<hourNum>(8);
    const [overworkPrice, setOverworkDayPrice] = useState<number>(40);

    const workdayOptions = [
        { label: "weekday", value: "regular" },
        { label: "saturday", value: "saturday" },
        { label: "sunday", value: "sunday" },
        { label: "holiday", value: "holiday" },
    ];

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

    useEffect(() => {
        console.log(workdayType);
        console.log(workDayTimeStart);
        console.log(workDayTimeEnd);
        console.log(workDayPrice);
        console.log(overtimeStart);
        console.log(overtimeEnd);
        console.log(overtimePrice);
        console.log(workDayLength);
        console.log(overworkPrice);
    }, [
        workdayType,
        workDayTimeStart,
        workDayTimeEnd,
        workDayPrice,
        overtimeStart,
        overtimeEnd,
        overtimePrice,
        workDayLength,
        overworkPrice,
    ]);

    return (
        <div
            className={styles.step2}
            style={{ visibility: !show ? "visible" : "hidden" }}
        >
            <p>My regular workday during the</p>

            <CustomSelect
                placeHolder={"Weekday type"}
                options={workdayOptions.map((day) => {
                    return {
                        value: day.value,
                        label: day.label,
                        selected: day.value === "regular",
                    };
                })}
                onChange={(value) => setWorkdayType(value as workdayType)}
                customClass={styles.inlineSelect}
            />
            <p>is from</p>
            <InputTime
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    setWorkDayTimeStart(answer.value as workdayTime)
                }
                fields={
                    {
                        type: "time",
                        id: "WorkDayStart",
                        hour: {
                            type: "number",
                            id: "WorkDayStartHour",
                            min: 0,
                            max: 23,
                            placeholder: "8",
                        } as inputNumber,
                        minute: {
                            type: "number",
                            id: `WorkDayStartMinute`,
                            placeholder: "00",
                            step: "30",
                            min: 0,
                            max: 59,
                        } as inputNumber,
                    } as inputTimeType
                }
            />
            <p>to</p>
            <InputTime
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    setWorkDayTimeEnd(answer.value as workdayTime)
                }
                fields={
                    {
                        type: "time",
                        id: "WorkDayEnd",
                        hour: {
                            type: "number",
                            id: "workDayEndHour",
                            min: 0,
                            max: 23,
                            placeholder: "16",
                        } as inputNumber,
                        minute: {
                            type: "number",
                            id: `workDayEndMinute`,
                            placeholder: "00",
                            step: "30",
                            min: 0,
                            max: 59,
                        } as inputNumber,
                    } as inputTimeType
                }
            />
            <p>and the price is $</p>
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    handleNumberChange(answer, setWorkDayPrice)
                }
                fields={
                    {
                        type: "number",
                        id: "priceOfWork",
                        min: 0,
                        max: 23,
                        placeholder: workDayPrice.toString(),
                    } as inputNumber
                }
            />
            <p>. Then, from</p>
            <InputTime
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    setOvertimeStart(answer.value as workdayTime)
                }
                fields={
                    {
                        type: "time",
                        id: "OvertimeStart",
                        hour: {
                            type: "number",
                            id: "OvertimeStartHour",
                            min: 0,
                            max: 23,
                            placeholder: "16",
                        } as inputNumber,
                        minute: {
                            type: "number",
                            id: `OvertimeStartMinute`,
                            placeholder: "00",
                            step: "30",
                            min: 0,
                            max: 59,
                        } as inputNumber,
                    } as inputTimeType
                }
            />
            <p> to</p>
            <InputTime
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    setOvertimeEnd(answer.value as workdayTime)
                }
                fields={
                    {
                        type: "time",
                        id: "OvertimeEnd",
                        hour: {
                            type: "number",
                            id: "OvertimeEndHour",
                            min: 0,
                            max: 23,
                            placeholder: "8",
                        } as inputNumber,
                        minute: {
                            type: "number",
                            id: `OvertimeEndMinute`,
                            placeholder: "00",
                            step: "30",
                            min: 0,
                            max: 59,
                        } as inputNumber,
                    } as inputTimeType
                }
            />
            <p>, the overtime price is $</p>
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    handleNumberChange(answer, setOvertimeDayPrice)
                }
                fields={
                    {
                        type: "number",
                        id: "priceOfOvertime",
                        min: 0,
                        max: 23,
                        placeholder: overtimePrice.toString(),
                    } as inputNumber
                }
            />
            <p>. My regular workday is</p>
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    handleNumberChange(
                        answer,
                        setWorkDayLength as Dispatch<SetStateAction<number>>
                    )
                }
                fields={
                    {
                        type: "number",
                        id: "workDayLength",
                        min: 0,
                        max: 23,
                        placeholder: workDayLength.toString(),
                    } as inputNumber
                }
            />
            <p> hours long, after that, the overwork price is $</p>
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    handleNumberChange(answer, setOverworkDayPrice)
                }
                fields={
                    {
                        type: "number",
                        id: "priceOfOverwork",
                        min: 0,
                        max: 23,
                        placeholder: overworkPrice.toString(),
                    } as inputNumber
                }
            />
        </div>
    );
};

export default Step2;
