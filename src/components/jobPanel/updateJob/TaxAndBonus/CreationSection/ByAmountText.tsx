//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import InputNumber from "../../../../utils/form/blocks/number/InputNumber";
import { formAnswersType } from "../../../../utils/form/FormTypes";
import { inputNumber } from "../../../../utils/form/blocks/number/Types";
import CustomSelect from "../../../../blocks/customSelect/CustomSelect";
import styles from "./CreationSection.module.scss";
import { BaseModifier } from "../../../../../classes/modifier/BaseModifier";
import { byAmount } from "../../../../../types/job/Modifiers";
//#endregion

type thisProps = {
    modifier: BaseModifier;
    onSetModifier: Dispatch<SetStateAction<BaseModifier>>;
};

const ByAmountText: FunctionComponent<thisProps> = ({
    modifier,
    onSetModifier,
}) => {
    const dailyTotal = [
        { label: "daily", value: "daily" },
        { label: "total", value: "total" },
    ];
    const moreLess = [
        { label: "more", value: "more" },
        { label: "less", value: "less" },
    ];

    function getDummyData(): byAmount {
        return {
            amount: 0,
            lessThan: false,
            moreThan: true,
            daily: true,
            total: false,
        };
    }

    function changeDailyTotal(value: string) {
        const modifierCopy = structuredClone(modifier);
        if (modifierCopy.byAmount == null) {
            modifierCopy.byAmount = getDummyData();
        }
        const newModifier = new BaseModifier({
            ...modifierCopy,
            byAmount: {
                ...modifierCopy.byAmount,
                daily: value === "daily",
                total: value === "total",
            },
        });
        onSetModifier(newModifier);
    }

    function changeMoreLess(value: string) {
        const modifierCopy = structuredClone(modifier);
        if (modifierCopy.byAmount == null) {
            modifierCopy.byAmount = getDummyData();
        }
        const newModifier = new BaseModifier({
            ...modifierCopy,
            byAmount: {
                ...modifierCopy.byAmount,
                lessThan: value === "less",
                moreThan: value === "more",
            },
        });
        onSetModifier(newModifier);
    }

    function changeAmount(answer: formAnswersType) {
        try {
            const newAmount = Number(answer.value);
            const modifierCopy = structuredClone(modifier);
            if (modifierCopy.byAmount == null) {
                modifierCopy.byAmount = getDummyData();
            }
            const newModifier = new BaseModifier({
                ...modifierCopy,
                byAmount: {
                    ...modifierCopy.byAmount,
                    amount: newAmount,
                },
            });
            onSetModifier(newModifier);
        } catch (error) {
            alert(error);
        }
    }

    return (
        <>
            If my
            <CustomSelect
                placeHolder={`${dailyTotal[0].label}/${dailyTotal[1].label}`}
                options={dailyTotal.map((freq) => {
                    return {
                        value: freq.value,
                        label: freq.label,
                        selected: freq.value === "daily",
                    };
                })}
                onChange={changeDailyTotal}
                customClass={styles.inlineSelect}
            />
            gain is
            <CustomSelect
                placeHolder={`${moreLess[0].label}/${moreLess[1].label}`}
                options={moreLess.map((qtt) => {
                    return {
                        value: qtt.value,
                        label: qtt.label,
                        selected: qtt.value === "more",
                    };
                })}
                onChange={changeMoreLess}
                customClass={styles.inlineSelect}
            />
            than $
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={changeAmount}
                fields={
                    {
                        type: "number",
                        id: "shiftsWorked",
                        min: 0,
                        placeholder: "00",
                        defaultValue: 0,
                    } as inputNumber
                }
            />
            .
        </>
    );
};

export default ByAmountText;
