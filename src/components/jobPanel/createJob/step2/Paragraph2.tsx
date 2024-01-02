//#region Dependency list
import { FunctionComponent, Dispatch, SetStateAction, useEffect } from "react";
import { workdayTime, workdayTimeType } from "./Step2";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import InputTime from "../../../utils/form/blocks/time/Time";
import styles from "./Step2.module.scss";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import { inputTimeType } from "../../../utils/form/types/TimeType";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
//#endregion

type thisProps = {
    setOvertimeStart: Dispatch<SetStateAction<workdayTime | undefined>>;
    setOvertimeEnd: Dispatch<SetStateAction<workdayTime | undefined>>;
    setOvertimeDayPrice: Dispatch<SetStateAction<number | undefined>>;
    overtimeStart: workdayTime | undefined;
    overtimeEnd: workdayTime | undefined;
    workdayType: workdayTimeType | undefined;
    workDayTimeEnd: workdayTime | undefined;
    workDayTimeStart: workdayTime | undefined;
    workDayPrice: number | undefined;
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number | undefined>>
    ): void;
};

const Paragraph2: FunctionComponent<thisProps> = ({
    setOvertimeStart,
    setOvertimeEnd,
    setOvertimeDayPrice,
    overtimeStart,
    overtimeEnd,
    workdayType,
    workDayTimeEnd,
    workDayTimeStart,
    workDayPrice,
    handleNumberChange,
}) => {
    const hasWorkDayInfo =
        !!workdayType &&
        !!workDayTimeStart &&
        !!workDayTimeEnd &&
        !!workDayPrice;

    useEffect(() => {
        if (
            !!workdayType &&
            !!workDayTimeStart &&
            !!workDayTimeEnd &&
            !!workDayPrice
        ) {
            if (!overtimeStart) setOvertimeStart(workDayTimeEnd);
            if (!overtimeEnd) setOvertimeEnd(workDayTimeStart);
        }
    }, [
        workdayType,
        workDayTimeStart,
        workDayTimeEnd,
        workDayPrice,
        setOvertimeStart,
        setOvertimeEnd,
        overtimeStart,
        overtimeEnd,
    ]);

    return (
        <div
            className={`${styles.paragraph} ${
                hasWorkDayInfo ? styles.show : ""
            }`}
        >
            Then, from
            {hasWorkDayInfo && overtimeStart && (
                <InputTime
                    formAnswers={[
                        {
                            id: "OvertimeStart",
                            value: overtimeStart,
                            error: "",
                        },
                    ]}
                    onUpdateAnswer={(answer: formAnswersType) =>
                        setOvertimeStart(answer.value as workdayTime)
                    }
                    fields={
                        {
                            type: "time",
                            id: "OvertimeStart",
                            defaultValue: overtimeStart,
                            hour: {
                                type: "number",
                                id: "OvertimeStartHour",
                            } as inputNumber,
                            minute: {
                                type: "number",
                                id: `OvertimeStartMinute`,
                                step: "30",
                            } as inputNumber,
                        } as inputTimeType
                    }
                />
            )}
            to
            {hasWorkDayInfo && overtimeEnd && (
                <InputTime
                    formAnswers={[
                        {
                            id: "OvertimeEnd",
                            value: overtimeEnd,
                            error: "",
                        },
                    ]}
                    onUpdateAnswer={(answer: formAnswersType) =>
                        setOvertimeEnd(answer.value as workdayTime)
                    }
                    fields={
                        {
                            type: "time",
                            id: "OvertimeEnd",
                            defaultValue: overtimeEnd,
                            hour: {
                                type: "number",
                                id: "OvertimeEndHour",
                                min: 0,
                                max: 23,
                            } as inputNumber,
                            minute: {
                                type: "number",
                                id: `OvertimeEndMinute`,
                                step: "30",
                                min: 0,
                                max: 59,
                            } as inputNumber,
                        } as inputTimeType
                    }
                />
            )}
            , the overtime price is $
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
                        placeholder: "20",
                    } as inputNumber
                }
            />
            .
        </div>
    );
};

export default Paragraph2;
