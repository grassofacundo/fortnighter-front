//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import FormUpdate from "./FormUpdate";
import styles from "./UpdateJob.module.scss";
import { Job } from "../../../classes/JobPosition";
import TextFormUpdate from "./textFormUpdate/TextFormUpdate";
//#endregion

type thisProps = {
    jobList: Job[];
    onEnd(job: Job): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const UpdateJob: FunctionComponent<thisProps> = ({
    jobList,
    onEnd,
    loading,
    onSetLoading,
}) => {
    const submitForm = (job: Job) => onEnd(job);

    return (
        <div className={styles.formContainer}>
            <FormUpdate
                jobList={jobList}
                onEnd={submitForm}
                loading={loading}
                onSetLoading={onSetLoading}
            />
            <TextFormUpdate
                onSetLoading={onSetLoading}
                onEnd={submitForm}
                loading={loading}
            />
        </div>
    );
};

export default UpdateJob;
