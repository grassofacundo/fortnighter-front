//#region Dependency list
import {
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useEffect,
    useCallback,
} from "react";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import { hourNum } from "../../../../types/dateService";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import { time12Meridian } from "../../../utils/form/types/TimeType";
import { workDayType } from "../../../../types/job/Position";
import styles from "./HourPrice.module.scss";
//#endregion

type thisProps = {
    setWorkDayLength: Dispatch<SetStateAction<number>>;
    setOverworkDayPrice: Dispatch<SetStateAction<number>>;
    overtimePrice: number | undefined;
    overworkPrice: number | undefined;
    workdayType: workDayType | undefined;
    workDayLength: number;
    workDayTimeStart: time12Meridian | undefined;
    workDayTimeEnd: time12Meridian | undefined;
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number>>
    ): void;
};

const HourPriceP3: FunctionComponent<thisProps> = ({
    setWorkDayLength,
    setOverworkDayPrice,
    overtimePrice,
    overworkPrice,
    workdayType,
    workDayLength,
    workDayTimeStart,
    workDayTimeEnd,
    handleNumberChange,
}) => {
    function getTimeFromWorkdayTime(
        workdayTime: time12Meridian,
        time: "hour" | "minute"
    ) {
        const hour = workdayTime.split(":");
        return time === "hour" ? hour[0] : hour[1].split("-")[0];
    }

    const getHourDifference = useCallback(
        (time1: time12Meridian, time2: time12Meridian) => {
            const isAm1 = time1.indexOf("AM") !== -1;
            const isAm2 = time2.indexOf("AM") !== -1;
            const hour1Str = getTimeFromWorkdayTime(time1, "hour");
            const hour2Str = getTimeFromWorkdayTime(time2, "hour");
            const minute1 = getTimeFromWorkdayTime(time1, "minute");
            const minute2 = getTimeFromWorkdayTime(time2, "minute");
            try {
                const minutes = Number(minute2) - Number(minute1);
                const minutesToAdd =
                    minutes === 30 ? 0.5 : minutes === -30 ? -0.5 : 0;
                const hour1 = Number(hour1Str) + (isAm1 ? 0 : 12);
                const hour2 = Number(hour2Str) + (isAm2 ? 0 : 12);
                const hourDiff =
                    hour2 - hour1 + minutesToAdd + (!isAm1 && isAm2 ? 24 : 0);
                return hourDiff.toString();
            } catch (error) {
                console.log(error);
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
        workDayLength,
        setWorkDayLength,
        getHourDifference,
    ]);

    return (
        <div
            className={`${styles.paragraph} ${
                overtimePrice ? styles.show : ""
            }`}
        >
            My regular workday is
            {overtimePrice && workdayType && (
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
                            placeholder: "8",
                            defaultValue: workDayLength,
                        } as inputNumber
                    }
                />
            )}
            hours long, if I work more, the price is $
            {workdayType && (
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
                            defaultValue: overworkPrice,
                        } as inputNumber
                    }
                />
            )}
            .
        </div>
    );
};

export default HourPriceP3;
