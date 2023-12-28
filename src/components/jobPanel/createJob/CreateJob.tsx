//#region Dependency list
import { FunctionComponent, Dispatch, SetStateAction, useState } from "react";
import { jobPosition } from "../../../types/job/Position";
import Step1 from "./Step1";
import Step2 from "./step2/Step2";
import styles from "./CreateJob.module.scss";
//#endregion

type thisProps = {
    onEnd(updatedJobPosition: jobPosition): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const CreateJob: FunctionComponent<thisProps> = ({
    onEnd,
    loading,
    onSetLoading,
}) => {
    const [createdJobPosition, setCreatedJobPosition] = useState<jobPosition>();

    function handleStep1End(jobPosition: jobPosition) {
        setCreatedJobPosition(jobPosition);
    }

    return (
        <div className={styles.formWrapper}>
            <Step1
                onEnd={handleStep1End}
                loading={loading}
                onSetLoading={onSetLoading}
            />

            <Step2
                onEnd={handleStep1End}
                loading={loading}
                show={!!createdJobPosition}
                onSetLoading={onSetLoading}
            />
        </div>
    );
};

export default CreateJob;
