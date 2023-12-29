//#region Dependency list
import {
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useEffect,
    useCallback,
} from "react";
import { workdayTime } from "./Step2";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import { hourNum } from "../../../../types/dateService";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import styles from "./Step2.module.scss";
//#endregion

type thisProps = {
    setWorkDayLength: Dispatch<SetStateAction<hourNum | undefined>>;
    setOverworkDayPrice: Dispatch<SetStateAction<number | undefined>>;
    overtimeStart: workdayTime | undefined;
    overtimeEnd: workdayTime | undefined;
    overtimePrice: number | undefined;
    workDayLength: hourNum | undefined;
    workDayTimeStart: workdayTime | undefined;
    workDayTimeEnd: workdayTime | undefined;
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number | undefined>>
    ): void;
};

const Paragraph3: FunctionComponent<thisProps> = ({
    setWorkDayLength,
    setOverworkDayPrice,
    overtimeStart,
    overtimeEnd,
    overtimePrice,
    workDayLength,
    workDayTimeStart,
    workDayTimeEnd,
    handleNumberChange,
}) => {
    const hasOvertimeInfo = overtimeStart && overtimeEnd && overtimePrice;

    function getTimeFromWorkdayTime(
        workdayTime: workdayTime,
        time: "hour" | "minute"
    ) {
        const hour = workdayTime.split(":");
        return time === "hour" ? hour[0] : hour[1];
    }

    const getHourDifference = useCallback(
        (time1: workdayTime, time2: workdayTime) => {
            const hour1 = getTimeFromWorkdayTime(time1, "hour");
            const hour2 = getTimeFromWorkdayTime(time2, "hour");
            const minute1 = getTimeFromWorkdayTime(time1, "minute");
            const minute2 = getTimeFromWorkdayTime(time2, "minute");
            try {
                const minutes = Number(minute2) - Number(minute1);
                const minutesToAdd =
                    minutes === 30 ? 0.5 : minutes === -30 ? -0.5 : 0;
                const hourDiff = Number(hour2) - Number(hour1) + minutesToAdd;
                return hourDiff.toString();
            } catch (error) {
                return "8";
            }
        },
        []
    );

    useEffect(() => {
        if (!!workDayTimeStart && !!workDayTimeEnd) {
            if (!workDayLength) {
                const length = getHourDifference(
                    workDayTimeStart,
                    workDayTimeEnd
                );
                setWorkDayLength(Number(length) as hourNum);
            }
        }
    }, [
        workDayTimeStart,
        workDayTimeEnd,
        overtimeStart,
        overtimeEnd,
        workDayLength,
        setWorkDayLength,
        getHourDifference,
    ]);

    return (
        <div
            className={`${styles.paragraph} ${
                hasOvertimeInfo ? styles.show : ""
            }`}
        >
            My regular workday is
            {hasOvertimeInfo && (
                <InputNumber
                    formAnswers={[]}
                    onUpdateAnswer={(answer: formAnswersType) =>
                        handleNumberChange(
                            answer,
                            setWorkDayLength as Dispatch<
                                SetStateAction<number | undefined>
                            >
                        )
                    }
                    fields={
                        {
                            type: "number",
                            id: "workDayLength",
                            min: 0,
                            max: 23,
                            placeholder: "8",
                            defaultValue:
                                workDayTimeStart && workDayTimeEnd
                                    ? getHourDifference(
                                          workDayTimeStart,
                                          workDayTimeEnd
                                      )
                                    : "8",
                        } as inputNumber
                    }
                />
            )}
            hours long, after that, the overwork price is $
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
                        placeholder: "20",
                    } as inputNumber
                }
            />
            .
        </div>
    );
};

export default Paragraph3;
