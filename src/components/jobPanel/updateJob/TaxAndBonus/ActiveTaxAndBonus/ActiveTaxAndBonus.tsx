//#region Dependency list
import { FunctionComponent, useContext } from "react";
import { JobContext } from "../../../../dashboard/Dashboard";
import { Modifier } from "../../../../../classes/modifier/Modifier";
import styles from "./ActiveTaxAndBonus.module.scss";
import { Job } from "../../../../../classes/job/JobPosition";
//#endregion

type thisProps = {
    onEnd(updatedJobPosition: Job): void;
};

const ActiveTaxAndBonus: FunctionComponent<thisProps> = ({ onEnd }) => {
    const selectedJob = useContext(JobContext);

    async function handleDelete(modifier: Modifier) {
        const response = await modifier.delete();

        if (response.ok && selectedJob) {
            const jobCopy = structuredClone(selectedJob);
            const newModifierList = jobCopy.modifiers
                .filter((m) => m.id !== modifier.id)
                .map((m) => new Modifier(m));
            const updatedJob = new Job({
                ...jobCopy,
                modifiers: newModifierList,
            });
            onEnd(updatedJob);
        }
        if (!response.ok) {
            alert("Did not delete");
        }
    }

    return (
        <div className={styles.activeModifiersContainer}>
            <h3>Active tax and bonus</h3>
            {selectedJob?.modifiers.map((modifier, i) => {
                return (
                    <div key={i} className={styles.activeModifiers}>
                        <p>{modifier.name}</p>
                        <span>-</span>
                        <button onClick={() => handleDelete(modifier)}>
                            Delete
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ActiveTaxAndBonus;
