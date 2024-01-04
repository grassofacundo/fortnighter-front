//#region Dependency list
import { FunctionComponent, Dispatch, SetStateAction, useEffect } from "react";
import { workdayTimeType } from "./PricesForm";
import CustomSelect from "../../../blocks/customSelect/CustomSelect";
import InputTime from "../../../utils/form/blocks/time/Time";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import {
    inputTimeType,
    timeStructure,
} from "../../../utils/form/types/TimeType";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import styles from "./PricesForm.module.scss";
import { getAs24Format } from "../../../utils/form/blocks/time/select/TimeMethods";
//#endregion

type thisProps = {
    setWorkdayType: Dispatch<SetStateAction<workdayTimeType>>;
    setWorkDayTimeStart: Dispatch<SetStateAction<timeStructure | undefined>>;
    setWorkDayTimeEnd: Dispatch<SetStateAction<timeStructure | undefined>>;
    setWorkDayPrice: Dispatch<SetStateAction<number | undefined>>;
    setFinishNextDay: Dispatch<SetStateAction<boolean>>;
    workDayTimeStart: timeStructure | undefined;
    workDayTimeEnd: timeStructure | undefined;
    finishNextDay: boolean;
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number | undefined>>
    ): void;
};

const Paragraph1: FunctionComponent<thisProps> = ({
    setWorkdayType,
    setWorkDayTimeStart,
    setWorkDayTimeEnd,
    setWorkDayPrice,
    setFinishNextDay,
    workDayTimeStart,
    workDayTimeEnd,
    finishNextDay,
    handleNumberChange,
}) => {
    const workdayOptions = [
        { label: "weekday", value: "regular" },
        { label: "saturday", value: "saturday" },
        { label: "sunday", value: "sunday" },
        { label: "holiday", value: "holiday" },
    ];

    useEffect(() => {
        if (workDayTimeStart && workDayTimeEnd) {
            const hour1 = getAs24Format(workDayTimeStart);
            const hour2 = getAs24Format(workDayTimeEnd);
            setFinishNextDay(hour1 > hour2);
        }
    }, [workDayTimeStart, workDayTimeEnd, setFinishNextDay]);

    return (
        <div className={`${styles.paragraph} ${styles.show}`}>
            My regular workday during a
            <CustomSelect
                placeHolder={"Weekday type"}
                options={workdayOptions.map((day) => {
                    return {
                        value: day.value,
                        label: day.label,
                        selected: day.value === "regular",
                    };
                })}
                onChange={(value) => setWorkdayType(value as workdayTimeType)}
                customClass={styles.inlineSelect}
            />
            is from
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
                    setWorkDayTimeStart(answer.value as timeStructure)
                }
                fields={
                    {
                        type: "time",
                        id: "WorkDayStart",
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
                        setWorkDayTimeEnd(answer.value as timeStructure)
                    }
                    fields={
                        {
                            type: "time",
                            id: "WorkDayEnd",
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
            and the price is $
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
                    } as inputNumber
                }
            />
            .
        </div>
    );
};

export default Paragraph1;
