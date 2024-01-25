//#region Dependency list
import { FunctionComponent, useState } from "react";
import { optionName, options } from "../../../../types/job/Modifiers";
import styles from "./TaxAndBonusPanel.module.scss";
import ByShiftText from "./ByShiftText";
import ByPaymentText from "./ByPaymentText";
import ByAmountText from "./ByAmountText";
//#endregion

type thisProps = unknown;

const TaxAndBonusPanel: FunctionComponent<thisProps> = () => {
    const [selectedOption, setSelectedOption] = useState<optionName | "">("");
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

    return (
        <div>
            {!selectedOption && (
                <div className={styles.optionWrapper}>
                    {options.map((option, i) => {
                        return (
                            <button
                                style={{ animationDelay: `${i * 50}ms` }}
                                onClick={() => setSelectedOption(option.id)}
                            >
                                <p className={styles.description}>
                                    {option.description}
                                </p>
                                <p className={styles.examples}>
                                    {option.example.map((example) => (
                                        <span>{example}</span>
                                    ))}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}
            {selectedOption === "shift" && <ByShiftText />}
            {selectedOption === "payment" && <ByPaymentText />}
            {selectedOption === "amount" && <ByAmountText />}
        </div>
    );
};

export default TaxAndBonusPanel;
