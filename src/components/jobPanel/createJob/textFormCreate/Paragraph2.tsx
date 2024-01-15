//#region Dependency list
import { FunctionComponent, Dispatch, SetStateAction } from "react";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import { time12Meridian } from "../../../utils/form/types/TimeType";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import styles from "./TextFormCreate.module.scss";
//#endregion

type thisProps = {
    setOvertimeDayPrice: Dispatch<SetStateAction<number | undefined>>;
    workDayTimeEnd: time12Meridian | undefined;
    workDayTimeStart: time12Meridian | undefined;
    workDayPrice: number | undefined;
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number | undefined>>
    ): void;
};

const Paragraph2: FunctionComponent<thisProps> = ({
    setOvertimeDayPrice,
    workDayTimeEnd,
    workDayTimeStart,
    workDayPrice,
    handleNumberChange,
}) => {
    const hasWorkDayInfo =
        !!workDayTimeStart && !!workDayTimeEnd && !!workDayPrice;

    return (
        <div
            className={`${styles.paragraph} ${
                hasWorkDayInfo ? styles.show : ""
            }`}
        >
            Outside of those hours, the price is $
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
