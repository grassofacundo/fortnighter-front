//#region Dependency list
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { optionName, options } from "../../../../types/job/Modifiers";
import ActiveTaxAndBonus from "./ActiveTaxAndBonus/ActiveTaxAndBonus";
import { JobContext } from "../../../dashboard/Dashboard";
import CreationSection from "./CreationSection/CreationSection";
import styles from "./TaxAndBonusPanel.module.scss";
import { Job } from "../../../../classes/job/JobPosition";
//#endregion

type thisProps = {
    onSetHide: Dispatch<SetStateAction<boolean>>;
    onEnd(updatedJobPosition: Job): void;
};

const TaxAndBonusPanel: FunctionComponent<thisProps> = ({
    onSetHide,
    onEnd,
}) => {
    const selectedJob = useContext(JobContext);
    const [selectedOption, setSelectedOption] = useState<optionName | "">("");
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

    useEffect(() => {
        onSetHide(!!selectedOption);
    }, [selectedOption, onSetHide]);

    return (
        <div className={styles.panel}>
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
            {selectedOption && selectedJob && (
                <div className={styles.modifierWrapper}>
                    <button
                        className={styles.changeSectionButton}
                        onClick={() => setSelectedOption("")}
                    >
                        Change category
                    </button>

                    <CreationSection
                        selectedOption={selectedOption}
                        loading={loading}
                        onSetLoading={setLoading}
                        onEnd={onEnd}
                    />
                    <ActiveTaxAndBonus onEnd={onEnd} />
                </div>
            )}
        </div>
    );
};

export default TaxAndBonusPanel;
