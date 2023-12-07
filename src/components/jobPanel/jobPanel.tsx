//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
    ChangeEvent,
} from "react";
import jobService from "../../services/JobService";
import styles from "./jobPanel.module.scss";
import { jobPosition } from "../../types/job/Position";
import CreateJobForm from "./createJobForm/CreateJobForm";
import UpdateJobForm from "./updateJobForm/UpdateJobForm";
//#endregion

type thisProps = {
    selectedPosition: jobPosition | null;
    onSetSelectedPosition: Dispatch<SetStateAction<jobPosition | null>>;
};

const JobPanel: FunctionComponent<thisProps> = ({
    selectedPosition,
    onSetSelectedPosition,
}) => {
    const [jobPositionList, setJobPositionList] = useState<jobPosition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);

    function handleJobPositionSelectChange(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        if (!value) return;

        if (value === "create") {
            setIsCreateMode(true);
        } else {
            if (jobPositionList.length <= 0) return;
            const newJob = jobPositionList.find((job) => job.id === value);
            if (!newJob) return;
            setIsCreateMode(false);
            onSetSelectedPosition(newJob);
        }
    }

    function handleJobPositionListUpdate(
        updatedJobPosition: jobPosition
    ): void {
        const list: jobPosition[] = structuredClone(jobPositionList);
        setJobPositionList([...list, { ...updatedJobPosition }]);
        setIsCreateMode(false);
        onSetSelectedPosition(updatedJobPosition);
    }

    useEffect(() => {
        jobService.getJobPositions().then((jobList) => {
            if (jobList.length > 0) {
                const parsedJobList = jobList.map((job) =>
                    jobService.parseAsJobPosition(job)
                );
                setJobPositionList(parsedJobList);
                onSetSelectedPosition(parsedJobList[0]);
            } else {
                setIsCreateMode(true);
            }
        });
    }, [onSetSelectedPosition]);

    return (
        <div className={styles.jobSection}>
            <div className={styles.headerContainer}>
                {jobPositionList.length > 0 && (
                    <select
                        id="cars"
                        defaultValue={
                            isCreateMode ? "create" : selectedPosition?.id
                        }
                        onChange={handleJobPositionSelectChange}
                        disabled={loading}
                    >
                        {jobPositionList.map((position) => (
                            <option key={position.id} value={position.id}>
                                {position.name}
                            </option>
                        ))}
                        <option value={"create"}>New job position</option>
                    </select>
                )}
                <button onClick={() => setIsExpanded((v) => !v)}>
                    {isExpanded ? "Hide" : "Show"}
                </button>
            </div>
            {isExpanded && !isCreateMode && selectedPosition && (
                <UpdateJobForm
                    position={selectedPosition}
                    jobPositionList={jobPositionList}
                    onEnd={handleJobPositionListUpdate}
                    loading={loading}
                    onSetLoading={setLoading}
                />
            )}
            {isExpanded && isCreateMode && (
                <CreateJobForm
                    jobPositionList={jobPositionList}
                    onEnd={handleJobPositionListUpdate}
                    loading={loading}
                    onSetLoading={setLoading}
                />
            )}
        </div>
    );
};

export default JobPanel;
