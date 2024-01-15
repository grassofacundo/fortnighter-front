//#region Dependency list
import { FunctionComponent, Dispatch, SetStateAction } from "react";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import { time12Meridian } from "../../../utils/form/types/TimeType";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import styles from "./TextFormUpdate.module.scss";
import { workDayType } from "../../../../types/job/Position";
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

const Paragraph2: FunctionComponent<thisProps> = ({
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

export default Paragraph2;
