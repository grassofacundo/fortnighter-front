//#region Dependency list
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { optionName, options } from "../../../../types/job/Modifiers";
import ByShiftText from "./ByShiftText";
import ByPaymentText from "./ByPaymentText";
import ByAmountText from "./ByAmountText";
import { formAnswersType } from "../../../utils/form/types/FormTypes";
import PayOrGain from "./PayOrGainText";
import styles from "./TaxAndBonusPanel.module.scss";
//#endregion

type thisProps = {
    onSetHide: Dispatch<SetStateAction<boolean>>;
};

const TaxAndBonusPanel: FunctionComponent<thisProps> = ({ onSetHide }) => {
    const [selectedOption, setSelectedOption] = useState<optionName | "">("");
    const [toPay, setToPay] = useState<boolean>(true);
    const [isPercentage, setIsPercentage] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);
    const [payGainText, setPayGainText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const options: options = [
        {
            id: "shift",
            description: "Tax or bonus applied based on shifts",
            example: [
                '"For every 1 worked shift, I have to pay 10% of the daily gain"',
                '"For every 5 worked shifts, I got paid 70$"',
            ],
        },
        {
            id: "payment",
            description: "Unique tax or bonus applied on this payment",
            example: [
                '"For this payment only, I got paid $200"',
                '"For this payment only, I have to pay 30% of my total gain"',
            ],
        },
        {
            id: "amount",
            description: "Tax or bonus applied based on total made",
            example: [
                '"If my daily gain is more than $300. I got paid 10% of my daily gain."',
                '"If my total gain is more than $5000. I have to pay 25% of my total gain."',
            ],
        },
    ];

    function handleNumberChange(
        answer: formAnswersType,
        callback: Dispatch<SetStateAction<number>>
    ) {
        try {
            const valueNum = Number(answer.value);
            callback(valueNum);
        } catch (error) {
            alert(error);
        }
    }

    function validAmount(): string {
        let error = "";
        if (amount < 0) error = "Amount cannot be negative";
        return error;
    }

    useEffect(() => {
        onSetHide(!!selectedOption);
    }, [selectedOption, onSetHide]);

    return (
        <div>
            {!selectedOption && (
                <div className={styles.optionWrapper}>
                    {options.map((option, i) => {
                        return (
                            <button
                                key={i}
                                style={{ animationDelay: `${i * 50}ms` }}
                                onClick={() => setSelectedOption(option.id)}
                                disabled={loading}
                            >
                                <p className={styles.description}>
                                    {option.description}
                                </p>
                                <p className={styles.examples}>
                                    {option.example.map((example, i) => (
                                        <span key={i}>{example}</span>
                                    ))}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}
            {selectedOption && (
                <button
                    className={styles.changeSectionButton}
                    onClick={() => setSelectedOption("")}
                >
                    Change category
                </button>
            )}
            {selectedOption && (
                <div className={`${styles.paragraph} ${styles.show}`}>
                    {selectedOption === "shift" && (
                        <ByShiftText
                            handleNumberChange={handleNumberChange}
                            onSetPayGainText={setPayGainText}
                            validAmount={validAmount}
                            payGainText={payGainText}
                            toPay={toPay}
                            isPercentage={isPercentage}
                            amount={amount}
                            loading={loading}
                        />
                    )}
                    {selectedOption === "payment" && (
                        <ByPaymentText
                            onSetPayGainText={setPayGainText}
                            payGainText={payGainText}
                        />
                    )}
                    {selectedOption === "amount" && (
                        <ByAmountText
                            handleNumberChange={handleNumberChange}
                            onSetPayGainText={setPayGainText}
                            payGainText={payGainText}
                        />
                    )}
                    <PayOrGain
                        onSetToPay={setToPay}
                        onSetIsPercentage={setIsPercentage}
                        onSetAmount={setAmount}
                        handleNumberChange={handleNumberChange}
                        isPercentage={isPercentage}
                        amount={amount}
                        text={payGainText}
                    />
                </div>
            )}
        </div>
    );
};

export default TaxAndBonusPanel;
