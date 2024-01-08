//#region Dependency list
import { FunctionComponent, Dispatch, SetStateAction } from "react";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import { timeStructure } from "../../../utils/form/types/TimeType";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import styles from "./TextFormCreate.module.scss";
//#endregion

type thisProps = {
    setOvertimeDayPrice: Dispatch<SetStateAction<number | undefined>>;
    workDayTimeEnd: timeStructure | undefined;
    workDayTimeStart: timeStructure | undefined;
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
            After those hours, the overtime price is $
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
