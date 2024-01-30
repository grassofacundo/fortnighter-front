//#region Dependency list
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import InputNumber from "../../../utils/form/blocks/number/InputNumber";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import { inputNumber } from "../../../utils/form/types/InputNumberTypes";
import styles from "./TaxAndBonusPanel.module.scss";
import { BaseModifier } from "../../../../classes/modifier/BaseModifier";
import { JobContext } from "../../../dashboard/Dashboard";
//#endregion

type thisProps = {
    handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number>>
    ): void;
    onSetPayGainText: Dispatch<SetStateAction<string>>;
    validAmount: () => string;
    payGainText: string;
    toPay: boolean;
    isPercentage: boolean;
    amount: number;
    loading: boolean;
};

const ByShiftText: FunctionComponent<thisProps> = ({
    handleNumberChange,
    onSetPayGainText,
    validAmount,
    payGainText,
    toPay,
    isPercentage,
    amount,
    loading,
}) => {
    const selectedJob = useContext(JobContext);
    const [shiftsWorked, setShiftsWorked] = useState<number>(1);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const text = "of my daily gain.";
        if (payGainText !== text) onSetPayGainText(text);
    }, [payGainText, onSetPayGainText]);

    async function handleSubmit() {
        if (shiftsWorked < 1) {
            setError("Minimum worked shifts is 1");
            return;
        }
        const amountError = validAmount();
        if (amountError) {
            setError(amountError);
            return;
        }
        if (!selectedJob) {
            setError("Cannot set a new modifier without a job ID");
            return;
        }
        const newModifier = new BaseModifier({
            name: "new modifier",
            byShift: { forEvery: shiftsWorked },
            amount: {
                increase: !toPay,
                decrease: toPay,
                isPercentage: isPercentage,
                isFixed: !isPercentage,
                amount,
            },
            jobId: selectedJob?.id,
        });

        const response = await newModifier.create();

        if (!response.ok && response.error) {
            setError(response.error.message);
        }
        if (response.ok && response.content) {
            const id = response.content.id;
            alert(`Modifier ${id} created`);
        }
        // console.log(
        //     `For every ${shiftsWorked} worked shift, I ${
        //         toPay ? "have to pay" : "got paid"
        //     } ${!isPercentage ? "$" : ""}${amount}${
        //         isPercentage ? "% of my daily gain" : ""
        //     }`
        // );
    }

    return (
        <>
            For every
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={(answer: formAnswersType) =>
                    handleNumberChange(answer, setShiftsWorked)
                }
                fields={
                    {
                        type: "number",
                        id: "shiftsWorked",
                        min: 1,
                        placeholder: "1",
                        defaultValue: shiftsWorked,
                    } as inputNumber
                }
            />
            worked shift.
            <button
                className={`${styles.submitButton} ${styles.show}`}
                onClick={handleSubmit}
            >
                {loading ? "Loading" : "Save"}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </>
    );
};

export default ByShiftText;
