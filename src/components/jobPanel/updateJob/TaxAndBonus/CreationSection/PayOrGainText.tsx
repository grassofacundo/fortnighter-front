//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import CustomSelect from "../../../../blocks/customSelect/CustomSelect";
import InputNumber from "../../../../utils/form/blocks/number/InputNumber";
import { formAnswersType } from "../../../../utils/form/FormTypes";
import { inputNumber } from "../../../../utils/form/blocks/number/Types";
import { BaseModifier } from "../../../../../classes/modifier/BaseModifier";
import styles from "./CreationSection.module.scss";
//#endregion

type thisProps = {
    modifier: BaseModifier;
    text: string;
    onSetModifier: Dispatch<SetStateAction<BaseModifier>>;
};

const PayOrGain: FunctionComponent<thisProps> = ({
    modifier,
    text,
    onSetModifier,
}) => {
    const payOptions = [
        { label: "got paid", value: "gain" },
        { label: "have to pay", value: "pay" },
    ];
    const symbolOptions = [
        { label: "%", value: "%" },
        { label: "$", value: "$" },
    ];

    function changePayGain(value: string) {
        const modifierCopy = structuredClone(modifier);
        const newModifier = new BaseModifier({
            ...modifierCopy,
            amount: {
                ...modifierCopy.amount,
                decrease: value === "pay",
                increase: value === "gain",
            },
        });
        onSetModifier(newModifier);
    }

    function changePercentageFixed(value: string) {
        const modifierCopy = structuredClone(modifier);
        const newModifier = new BaseModifier({
            ...modifierCopy,
            amount: {
                ...modifierCopy.amount,
                isFixed: value === "$",
                isPercentage: value === "%",
            },
        });
        onSetModifier(newModifier);
    }

    function changeAmount(answer: formAnswersType) {
        try {
            const newAmount = Number(answer.value);
            const modifierCopy = structuredClone(modifier);
            const newModifier = new BaseModifier({
                ...modifierCopy,
                amount: { ...modifierCopy.amount, amount: newAmount },
            });
            onSetModifier(newModifier);
        } catch (error) {
            alert(error);
        }
    }

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
                onChange={changePayGain}
                customClass={styles.inlineSelect}
            />
            <CustomSelect
                placeHolder={"%/$"}
                options={symbolOptions.map((symbol) => {
                    return {
                        value: symbol.value,
                        label: symbol.label,
                        selected:
                            symbol.value ===
                            (modifier.amount.isPercentage ? "%" : "$"),
                    };
                })}
                onChange={changePercentageFixed}
                customClass={styles.inlineSelect}
            />
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={changeAmount}
                fields={
                    {
                        type: "number",
                        id: "amount",
                        min: 0,
                        max: modifier.amount.isPercentage ? 100 : null,
                        placeholder: "00",
                        defaultValue: modifier.amount.amount,
                    } as inputNumber
                }
            />
            {modifier.amount.isPercentage && text ? text : "."}
        </>
    );
};

export default PayOrGain;
