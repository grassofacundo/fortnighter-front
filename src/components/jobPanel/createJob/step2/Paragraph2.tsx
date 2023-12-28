//#region Dependency list
import { FunctionComponent, Dispatch, SetStateAction, useEffect } from "react";
import { workdayTime, workdayTimeType } from "./Step2";
import { formAnswersType } from "../../../../types/form/FormTypes";
import InputTime from "../../../utils/form/blocks/time/Time";
import styles from "./Step2.module.scss";
import { inputNumber } from "../../../../types/form/InputNumberTypes";
import { inputTimeType } from "../../../../types/form/TimeType";
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
    function getTimeFromWorkdayTime(
        workdayTime: workdayTime,
        time: "hour" | "minute"
    ) {
        const hour = workdayTime.split(":");
        return time === "hour" ? hour[0] : hour[1];
    }

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
            {hasWorkDayInfo && (
                <InputTime
                    formAnswers={
                        overtimeStart
                            ? [
                                  {
                                      id: "OvertimeStart",
                                      value: overtimeStart,
                                      error: "",
                                  },
                              ]
                            : []
                    }
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
                                defaultValue: getTimeFromWorkdayTime(
                                    workDayTimeEnd,
                                    "hour"
                                ),
                            } as inputNumber,
                            minute: {
                                type: "number",
                                id: `OvertimeStartMinute`,
                                defaultValue: getTimeFromWorkdayTime(
                                    workDayTimeEnd,
                                    "minute"
                                ),
                                step: "30",
                                min: 0,
                                max: 59,
                            } as inputNumber,
                        } as inputTimeType
                    }
                />
            )}
            to
            {hasWorkDayInfo && (
                <InputTime
                    formAnswers={
                        overtimeEnd
                            ? [
                                  {
                                      id: "OvertimeEnd",
                                      value: overtimeEnd,
                                      error: "",
                                  },
                              ]
                            : []
                    }
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
                                defaultValue: getTimeFromWorkdayTime(
                                    workDayTimeStart,
                                    "hour"
                                ),
                            } as inputNumber,
                            minute: {
                                type: "number",
                                id: `OvertimeEndMinute`,
                                defaultValue: getTimeFromWorkdayTime(
                                    workDayTimeStart,
                                    "minute"
                                ),
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
