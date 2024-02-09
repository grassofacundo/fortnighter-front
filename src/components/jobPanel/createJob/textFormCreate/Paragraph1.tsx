//#region Dependency list
import {
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import InputTime from "../../../utils/form/blocks/time/Time";
import { inputNumber } from "../../../utils/form/blocks/number/Types";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import {
    inputTimeType,
    time12Meridian,
} from "../../../utils/form/blocks/time/Types";
import { formAnswersType } from "../../../utils/form/FormTypes";
import { getAs24Format } from "../../../utils/form/blocks/time/select/TimeMethods";
import styles from "./TextFormCreate.module.scss";
//#endregion

type thisProps = {
    setWorkDayTimeStart: Dispatch<SetStateAction<time12Meridian | undefined>>;
    setWorkDayTimeEnd: Dispatch<SetStateAction<time12Meridian | undefined>>;
    setWorkDayPrice: Dispatch<SetStateAction<number | undefined>>;
    workDayTimeStart: time12Meridian | undefined;
    workDayTimeEnd: time12Meridian | undefined;
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number | undefined>>
    ): void;
};

const Paragraph1: FunctionComponent<thisProps> = ({
    setWorkDayTimeStart,
    setWorkDayTimeEnd,
    setWorkDayPrice,
    workDayTimeStart,
    workDayTimeEnd,
    handleNumberChange,
}) => {
    const [finishNextDay, setFinishNextDay] = useState<boolean>(false);

    useEffect(() => {
        if (workDayTimeStart && workDayTimeEnd) {
            const hour1 = getAs24Format(workDayTimeStart);
            const hour2 = getAs24Format(workDayTimeEnd);
            setFinishNextDay(hour1 > hour2);
        }
    }, [workDayTimeStart, workDayTimeEnd]);

    return (
        <div className={`${styles.paragraph} ${styles.show}`}>
            During the week, if I work between
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
                    } as inputNumber
                }
            />
            the hour.
        </div>
    );
};

export default Paragraph1;
