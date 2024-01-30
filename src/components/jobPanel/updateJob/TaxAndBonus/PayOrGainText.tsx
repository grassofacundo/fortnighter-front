//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import CustomSelect from "../../../blocks/customSelect/CustomSelect";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import styles from "./TaxAndBonusPanel.module.scss";
//#endregion

type thisProps = {
    onSetToPay: Dispatch<SetStateAction<boolean>>;
    onSetIsPercentage: Dispatch<SetStateAction<boolean>>;
    onSetAmount: Dispatch<SetStateAction<number>>;
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number>>
    ): void;
    isPercentage: boolean;
    amount: number;
    text: string;
};

const PayOrGain: FunctionComponent<thisProps> = ({
    onSetToPay,
    onSetIsPercentage,
    onSetAmount,
    handleNumberChange,
    isPercentage,
    amount,
    text,
}) => {
    const payOptions = [
        { label: "got paid", value: "gain" },
        { label: "have to pay", value: "pay" },
    ];
    const symbolOptions = [
        { label: "%", value: "%" },
        { label: "$", value: "$" },
    ];

    return (
        <>
            {" "}
            I
            <CustomSelect
                placeHolder={"pay/gain"}
                options={payOptions.map((pay) => {
                    return {
                        value: pay.value,
                        label: pay.label,
                        selected: pay.value === "pay",
                    };
                })}
                onChange={(value) => onSetToPay(value === "pay")}
                customClass={styles.inlineSelect}
            />
            <CustomSelect
                placeHolder={"%/$"}
                options={symbolOptions.map((symbol) => {
                    return {
                        value: symbol.value,
                        label: symbol.label,
                        selected: symbol.value === (isPercentage ? "%" : "$"),
                    };
                })}
                onChange={(value) => onSetIsPercentage(value === "%")}
                customClass={styles.inlineSelect}
            />
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    handleNumberChange(answer, onSetAmount)
                }
                fields={
                    {
                        type: "number",
                        id: "amount",
                        min: 0,
                        max: isPercentage ? 100 : null,
                        placeholder: "00",
                        defaultValue: amount,
                    } as inputNumber
                }
            />
            {isPercentage && text ? text : "."}
        </>
    );
};

export default PayOrGain;
