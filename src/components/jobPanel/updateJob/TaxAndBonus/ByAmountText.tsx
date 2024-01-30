//#region Dependency list
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import CustomSelect from "../../../blocks/customSelect/CustomSelect";
import styles from "./TaxAndBonusPanel.module.scss";
//#endregion

type thisProps = {
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number>>
    ): void;
    onSetPayGainText: Dispatch<SetStateAction<string>>;
    payGainText: string;
};

const ByAmountText: FunctionComponent<thisProps> = ({
    handleNumberChange,
    onSetPayGainText,
    payGainText,
}) => {
    const [frequency, setFrequency] = useState<"daily" | "total">("daily");
    const [quantity, setQuantity] = useState<"more" | "less">("more");
    const [gain, setGain] = useState<number>(0);

    const dailyTotal = [
        { label: "daily", value: "daily" },
        { label: "total", value: "total" },
    ];
    const moreLess = [
        { label: "more", value: "more" },
        { label: "less", value: "less" },
    ];

    useEffect(() => {
        const text = `of my ${frequency} gain.`;
        if (payGainText !== text) onSetPayGainText(text);
    }, [payGainText, onSetPayGainText, frequency]);

    return (
        <>
            If my
            <CustomSelect
                placeHolder={`${dailyTotal[0].label}/${dailyTotal[1].label}`}
                options={dailyTotal.map((freq) => {
                    return {
                        value: freq.value,
                        label: freq.label,
                        selected: freq.value === frequency,
                    };
                })}
                onChange={(value) => setFrequency(value as "daily" | "total")}
                customClass={styles.inlineSelect}
            />
            gain is
            <CustomSelect
                placeHolder={`${moreLess[0].label}/${moreLess[1].label}`}
                options={moreLess.map((qtt) => {
                    return {
                        value: qtt.value,
                        label: qtt.label,
                        selected: qtt.value === quantity,
                    };
                })}
                onChange={(value) => setQuantity(value as "more" | "less")}
                customClass={styles.inlineSelect}
            />
            than
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    handleNumberChange(answer, setGain)
                }
                fields={
                    {
                        type: "number",
                        id: "shiftsWorked",
                        min: 0,
                        placeholder: "00",
                        defaultValue: gain,
                    } as inputNumber
                }
            />
            .
        </>
    );
};

export default ByAmountText;
