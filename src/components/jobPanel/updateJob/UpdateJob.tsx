//#region Dependency list
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useContext,
    useState,
} from "react";
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
    const [isHourPriceActive, setIsHourPriceActive] = useState<boolean>(true);

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
                <div className={styles.textFormsContainer}>
                    <button
                        className={styles.changeSectionButton}
                        onClick={() => setIsHourPriceActive((bool) => !bool)}
                    >
                        {isHourPriceActive
                            ? "Set tax or bonus"
                            : "Set hour price"}
                    </button>
                    {isHourPriceActive ? (
                        <TextFormUpdate
                            onSetLoading={onSetLoading}
                            selectedJob={selectedJob}
                            onEnd={submitForm}
                            loading={loading}
                        />
                    ) : (
                        <div>Updating tax and bonus</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UpdateJob;
