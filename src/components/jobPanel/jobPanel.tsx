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
import InOutAnim from "../utils/InOutAnim";
import CustomSelect from "../utils/customSelect/CustomSelect";
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
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);

    function handleJobPositionSelectChange(value: string) {
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
        const positionIndex = list.findIndex(
            (l) => l.id === updatedJobPosition.id
        );
        if (positionIndex > -1) {
            list[positionIndex] = updatedJobPosition;
        } else {
            list.push(updatedJobPosition);
        }
        dispatchEvent(new Event("resetCustomSelect"));
        setJobPositionList(list);
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
            setInitialLoading(false);
        });
    }, [onSetSelectedPosition]);

    return (
        <div className={styles.jobSection}>
            <InOutAnim inState={!initialLoading}>
                <div className={styles.headerContainer}>
                    {jobPositionList.length > 0 && (
                        <CustomSelect
                            key={selectedPosition?.id ?? "New job position"}
                            placeHolder={
                                selectedPosition?.name && !isCreateMode
                                    ? selectedPosition.name
                                    : "New job position"
                            }
                            options={[
                                ...jobPositionList.map((position) => ({
                                    value: position.id,
                                    label: position.name,
                                    selected:
                                        selectedPosition?.id === position.id,
                                })),
                                { value: "create", label: "New job position" },
                            ]}
                            onChange={(val) =>
                                handleJobPositionSelectChange(val)
                            }
                        />
                    )}
                    <button onClick={() => setIsExpanded((v) => !v)}>
                        {isExpanded ? "Hide" : "Show"}
                    </button>
                </div>
                {isExpanded && !isCreateMode && selectedPosition && (
                    <UpdateJobForm
                        key={selectedPosition.id}
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
            </InOutAnim>
        </div>
    );
};

export default JobPanel;
