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
import { Job } from "../../../classes/job/JobPosition";
import { JobContext } from "../../dashboard/Dashboard";
import HourPrice from "./HourPrice/HourPrice";
import TaxAndBonusPanel from "./TaxAndBonus/TaxAndBonusPanel";
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
    const [hide, setHide] = useState<boolean>(false);

    const postSubmit = (job: Job) => onEnd(job);

    return (
        <div className={styles.formContainer}>
            <FormUpdate
                jobList={jobList}
                onEnd={postSubmit}
                loading={loading}
                onSetLoading={onSetLoading}
            />
            {selectedJob && (
                <div className={styles.textFormsContainer}>
                    {!hide && (
                        <button
                            className={styles.changeSectionButton}
                            onClick={() =>
                                setIsHourPriceActive((bool) => !bool)
                            }
                        >
                            {isHourPriceActive
                                ? "Set tax or bonus"
                                : "Set hour price"}
                        </button>
                    )}
                    {isHourPriceActive ? (
                        <HourPrice
                            onSetLoading={onSetLoading}
                            selectedJob={selectedJob}
                            onEnd={postSubmit}
                            loading={loading}
                        />
                    ) : (
                        <TaxAndBonusPanel
                            onSetHide={setHide}
                            onEnd={postSubmit}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default UpdateJob;
