//#region Dependency list
import { FunctionComponent } from "react";
import { formAnswersType } from "../../../utils/form/FormTypes";
import { inputNumber } from "../../../utils/form/blocks/number/Types";
import { time12Meridian } from "../../../utils/form/blocks/time/Types";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import { workDayType } from "../../../../types/job/Position";
import styles from "./HourPrice.module.scss";
//#endregion

type thisProps = {
    setOvertimeDayPrice: (v: number) => void;
    workdayType: workDayType;
    workDayTimeEnd: time12Meridian | undefined;
    workDayTimeStart: time12Meridian | undefined;
    workDayPrice: number | undefined;
    overtimePrice: number | undefined;
    handleNumberChange(
        answer: formAnswersType,
        callback: (v: number) => void
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
                            defaultValue: overtimePrice?.toString(),
                        } as inputNumber
                    }
                />
            )}
            .
        </div>
    );
};

export default HourPriceP2;
