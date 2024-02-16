//#region Dependency list
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { optionName } from "../../../../../types/job/Modifiers";
import ByShiftText from "./ByShiftText";
import ByPaymentText from "./ByPaymentText";
import ByAmountText from "./ByAmountText";
import PayOrGain from "./PayOrGainText";
import { BaseModifier } from "../../../../../classes/modifier/BaseModifier";
import InputText from "../../../../utils/form/blocks/text/Text";
import { formAnswersType } from "../../../../utils/form/FormTypes";
import { Job } from "../../../../../classes/job/JobPosition";
import { Modifier } from "../../../../../classes/modifier/Modifier";
import { JobContext } from "../../../jobPanel";
import styles from "./CreationSection.module.scss";
//#endregion

type thisProps = {
    selectedOption: optionName;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const CreationSection: FunctionComponent<thisProps> = ({
    selectedOption,
    loading,
    onSetLoading,
}) => {
    const jobCtx = useContext(JobContext);
    const selectedJob = jobCtx?.selectedJob;
    const onEnd = jobCtx?.updateList;

    const [payGainText, setPayGainText] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [modifier, setModifier] = useState<BaseModifier>(
        new BaseModifier({
            name: `New ${selectedOption} modifier`,
            amount: {
                increase: false,
                decrease: true,
                isPercentage: false,
                isFixed: true,
                amount: 0,
            },
            jobId: selectedJob?.id ?? "",
        })
    );

    function changeName(answer: formAnswersType): void {
        const modifierCopy = structuredClone(modifier);
        const newModifier = new BaseModifier({
            ...modifierCopy,
            name: answer.value as string,
        });
        setModifier(newModifier);
    }

    async function handleSubmit() {
        onSetLoading(true);

        if (!selectedJob || !onEnd) {
            setError("Couldn't find job information");
            return;
        }

        if (selectedOption === "shift") {
            const shifts = modifier.byShift?.forEvery;
            if (!shifts) {
                setError("Complete all shifts");
                return;
            }

            if (shifts && shifts < 1) {
                setError("Minimum worked shifts is 1");
                return;
            }

            if (modifier.byAmount || modifier.paymentId) {
                setError(
                    "A shift based tax or bonus should only handle shift logic"
                );
                return;
            }
        }

        if (selectedOption === "amount") {
            const byAmount = modifier.byAmount;
            if (!byAmount) {
                setError("Complete all fields first");
                return;
            }

            if (byAmount.daily === byAmount.total) {
                setError("Daily value and Total value cannot be the same");
                return;
            }

            if (byAmount.lessThan === byAmount.moreThan) {
                setError(
                    "More than value and Less than value cannot be the same"
                );
                return;
            }

            if (byAmount.amount < 0) {
                setError("Amount cannot be negative");
                return;
            }
        }

        const amountData = modifier.amount;
        if (amountData.amount < 0) {
            setError("Amount cannot be negative");
            return;
        }
        if (amountData.decrease === amountData.increase) {
            setError("Pay and Gain have the same value");
            return;
        }

        if (amountData.isPercentage === amountData.isFixed) {
            setError("Amount is both percentage and fixed");
            return;
        }

        const response = await modifier.create();

        if (!response.ok && response.error) {
            setError(response.error.message);
            onSetLoading(false);
        }
        if (response.ok && response.content) {
            const id = response.content.id;
            const newModifier = new Modifier({ ...modifier, id });
            const jobCopy = structuredClone(selectedJob);
            const newModifierList = [
                ...jobCopy.modifiers.map((m) => new Modifier(m)),
                newModifier,
            ];
            const updatedJob = new Job({
                ...jobCopy,
                modifiers: newModifierList,
            });
            onEnd(updatedJob);
            onSetLoading(false);
        }
    }

    useEffect(() => {
        if (selectedOption === "shift") {
            const text = "of my daily gain.";
            if (payGainText !== text) setPayGainText(text);
        }
        if (selectedOption === "amount") {
            const text = `of my ${
                modifier.byAmount?.daily ? "daily" : "total"
            } gain.`;
            if (payGainText !== text) setPayGainText(text);
        }
    }, [selectedOption, payGainText, modifier]);

    return (
        <div className={`${styles.paragraph} ${styles.show}`}>
            <div className={styles.textInput}>
                <InputText
                    formAnswers={[]}
                    onUpdateAnswer={changeName}
                    fields={{
                        type: "text",
                        id: "positionName",
                        label: "Name:",
                        defaultValue: modifier.name,
                    }}
                />
            </div>
            {selectedOption === "shift" && (
                <ByShiftText modifier={modifier} onSetModifier={setModifier} />
            )}
            {selectedOption === "payment" && (
                <ByPaymentText
                    onSetPayGainText={setPayGainText}
                    payGainText={payGainText}
                />
            )}
            {selectedOption === "amount" && (
                <ByAmountText modifier={modifier} onSetModifier={setModifier} />
            )}
            <PayOrGain
                modifier={modifier}
                onSetModifier={setModifier}
                text={payGainText}
            />
            <button
                className={`${styles.submitButton} ${styles.show}`}
                onClick={handleSubmit}
            >
                {loading ? "Loading" : "Save"}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default CreationSection;
