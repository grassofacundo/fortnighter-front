//#region Dependency list
import { FunctionComponent, useContext } from "react";
import { JobContext } from "../../../../dashboard/Dashboard";
import { optionName } from "../../../../../types/job/Modifiers";
import { Modifier } from "../../../../../classes/modifier/Modifier";
import styles from "./ActiveTaxAndBonus.module.scss";
//#endregion

type thisProps = { selectedOption: optionName };

const ActiveTaxAndBonus: FunctionComponent<thisProps> = ({
    selectedOption,
}) => {
    const selectedJob = useContext(JobContext);

    async function handleDelete(modifier: Modifier) {
        const response = await modifier.delete();

        if (response.ok) {
            alert(`${modifier.id} deleted from DB`);
        }
        if (!response.ok) {
            alert("Did not delete");
        }
    }

    return (
        <div>
            {selectedJob?.modifiers.map((modifier, i) => {
                return (
                    <div key={i} className={styles.activeModifiers}>
                        <p>{modifier.name}</p>
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
