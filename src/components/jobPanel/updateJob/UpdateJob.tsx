//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction, useContext } from "react";
import FormUpdate from "./FormUpdate";
import styles from "./UpdateJob.module.scss";
import { Job } from "../../../classes/JobPosition";
import TextFormUpdate from "./textFormUpdate/TextFormUpdate";
import { JobContext } from "../../dashboard/Dashboard";
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
    const selectedJob = useContext(JobContext);

    const submitForm = (job: Job) => onEnd(job);

    return (
        <div className={styles.formContainer}>
            <FormUpdate
                jobList={jobList}
                onEnd={submitForm}
                loading={loading}
                onSetLoading={onSetLoading}
            />
            {selectedJob && (
                <TextFormUpdate
                    onSetLoading={onSetLoading}
                    selectedJob={selectedJob}
                    onEnd={submitForm}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default UpdateJob;
