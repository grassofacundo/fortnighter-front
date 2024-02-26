//#region Dependency list
import { FunctionComponent, ReactElement, useEffect } from "react";
import InputTime from "../../../utils/form/blocks/time/Time";
import { inputNumber } from "../../../utils/form/blocks/number/Types";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import {
    inputTimeType,
    time12Meridian,
} from "../../../utils/form/blocks/time/Types";
import { formAnswersType } from "../../../utils/form/FormTypes";
import { getAs24Format } from "../../../utils/form/blocks/time/select/TimeMethods";
import styles from "./HourPrice.module.scss";
//#endregion

type thisProps = {
    setWorkDayTimeStart: (v: time12Meridian) => void;
    setWorkDayTimeEnd: (v: time12Meridian) => void;
    setWorkDayPrice: (v: number) => void;
    setFinishNextDay: (v: boolean) => void;
    handleNumberChange(
        answer: formAnswersType,
        callback: (v: number) => void
    ): void;
    workDayPrice: number | undefined;
    workDayTimeStart: time12Meridian | undefined;
    workDayTimeEnd: time12Meridian | undefined;
    finishNextDay: boolean;
    children: ReactElement;
};

const HourPriceP1: FunctionComponent<thisProps> = ({
    setWorkDayTimeStart,
    setWorkDayTimeEnd,
    setWorkDayPrice,
    setFinishNextDay,
    handleNumberChange,
    workDayPrice,
    workDayTimeStart,
    workDayTimeEnd,
    finishNextDay,
    children,
}) => {
    useEffect(() => {
        if (workDayTimeStart && workDayTimeEnd) {
            const hour1 = getAs24Format(workDayTimeStart);
            const hour2 = getAs24Format(workDayTimeEnd);
            setFinishNextDay(hour1 > hour2);
        }
    }, [workDayTimeStart, workDayTimeEnd, setFinishNextDay]);

    return (
        <div className={`${styles.paragraph} ${styles.show}`}>
            {children}
            if I work from
            <InputTime
                formAnswers={
                    workDayTimeStart
                        ? [
                              {
                                  id: "WorkDayStart",
                                  value: workDayTimeStart,
                                  error: "",
                              },
                          ]
                        : []
                }
                onUpdateAnswer={(answer: formAnswersType) =>
                    setWorkDayTimeStart(answer.value as time12Meridian)
                }
                fields={
                    {
                        type: "time",
                        id: "WorkDayStart",
                        defaultValue: workDayTimeStart,
                        hour: {
                            type: "number",
                            id: "WorkDayStartHour",
                            placeholder: "8",
                        } as inputNumber,
                        minute: {
                            type: "number",
                            id: `WorkDayStartMinute`,
                            placeholder: "00",
                            step: "30",
                        } as inputNumber,
                        meridian: {
                            isAm: true,
                        },
                    } as inputTimeType
                }
            />
            to
            <div className={styles.inputWithPopUp}>
                <InputTime
                    formAnswers={
                        workDayTimeEnd
                            ? [
                                  {
                                      id: "WorkDayEnd",
                                      value: workDayTimeEnd,
                                      error: "",
                                  },
                              ]
                            : []
                    }
                    onUpdateAnswer={(answer: formAnswersType) =>
                        setWorkDayTimeEnd(answer.value as time12Meridian)
                    }
                    fields={
                        {
                            type: "time",
                            id: "WorkDayEnd",
                            defaultValue: workDayTimeEnd,
                            hour: {
                                type: "number",
                                id: "workDayEndHour",
                                placeholder: "5",
                            } as inputNumber,
                            minute: {
                                type: "number",
                                id: `workDayEndMinute`,
                                placeholder: "00",
                                step: "30",
                            } as inputNumber,
                        } as inputTimeType
                    }
                />
                {finishNextDay && (
                    <span className={styles.popUp}>The next day</span>
                )}
            </div>
            I get paid $
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
                        placeholder: "10",
                        defaultValue: workDayPrice?.toString(),
                    } as inputNumber
                }
            />
            the hour.
        </div>
    );
};

export default HourPriceP1;
