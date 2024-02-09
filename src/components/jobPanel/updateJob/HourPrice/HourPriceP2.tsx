//#region Dependency list
import { FunctionComponent, Dispatch, SetStateAction } from "react";
import { formAnswersType } from "../../../utils/form/FormTypes";
import { inputNumber } from "../../../utils/form/blocks/number/Types";
import { time12Meridian } from "../../../utils/form/blocks/time/Types";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import { workDayType } from "../../../../types/job/Position";
import styles from "./HourPrice.module.scss";
//#endregion

type thisProps = {
    setOvertimeDayPrice: Dispatch<SetStateAction<number>>;
    workdayType: workDayType;
    workDayTimeEnd: time12Meridian;
    workDayTimeStart: time12Meridian;
    workDayPrice: number;
    overtimePrice: number;
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number>>
    ): void;
};

const HourPriceP2: FunctionComponent<thisProps> = ({
    setOvertimeDayPrice,
    workdayType,
    workDayTimeEnd,
    workDayTimeStart,
    workDayPrice,
    overtimePrice,
    handleNumberChange,
}) => {
    const hasWorkDayInfo =
        !!workdayType &&
        !!workDayTimeStart &&
        !!workDayTimeEnd &&
        !!workDayPrice;

    return (
        <div
            className={`${styles.paragraph} ${
                hasWorkDayInfo ? styles.show : ""
            }`}
        >
            Outside of those hours, the price is $
            {workdayType && (
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
                            defaultValue: overtimePrice.toString(),
                        } as inputNumber
                    }
                />
            )}
            .
        </div>
    );
};

export default HourPriceP2;
