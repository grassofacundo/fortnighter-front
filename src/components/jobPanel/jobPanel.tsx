//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
    createContext,
} from "react";
import jobService from "../../services/JobService";
import CustomSelect from "../blocks/customSelect/CustomSelect";
import Arrow from "../blocks/icons/Arrow";
import CreateJobForm from "./createJob/CreateJob";
import UpdateJob from "./updateJob/UpdateJob";
import styles from "./jobPanel.module.scss";
import { Job } from "../../classes/job/JobPosition";
//#endregion

type thisProps = {
    selectedJob: Job | null;
    onSetSelectedJob: Dispatch<SetStateAction<Job | null>>;
};
type jobContextType = {
    selectedJob: Job | null;
    jobList: Job[];
    updateList(job: Job): void;
};

export const JobContext = createContext<jobContextType | null>(null);

const JobPanel: FunctionComponent<thisProps> = ({
    selectedJob,
    onSetSelectedJob,
}) => {
    const [jobList, setJobList] = useState<Job[]>([]);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [firstExpanded, setFirstExpanded] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);

    function changeJob(value: string) {
        if (!value) return;

        if (value === "create") {
            setIsCreateMode(true);
        } else {
            if (jobList.length <= 0) return;
            const newJob = jobList.find((job) => job.id === value);
            if (!newJob) return;
            setIsCreateMode(false);
            onSetSelectedJob(newJob);
        }
    }

    function updateList(job: Job): void {
        const list: Job[] = structuredClone(jobList);
        const positionIndex = list.findIndex((l) => l.id === job.id);
        if (positionIndex > -1) {
            list[positionIndex] = job;
        } else {
            list.push(job);
        }
        //dispatchEvent(new Event("resetCustomSelect"));
        setJobList(list);
        setIsCreateMode(false);
        onSetSelectedJob(job);
    }

    function handleOpen(): void {
        setIsExpanded((v) => !v);
        setFirstExpanded(true);
    }

    useEffect(() => {
        jobService.getJobPositions().then((jobList) => {
            if (jobList.length > 0) {
                const parsedJobList = jobList.map((job) =>
                    jobService.parseDbJobAsJob(job)
                );
                setJobList(parsedJobList);
                onSetSelectedJob(parsedJobList[0]);
                setIsExpanded(false);
            } else {
                setIsCreateMode(true);
                setIsExpanded(true);
                setFirstExpanded(true);
            }
            setInitialLoading(false);
        });
    }, [onSetSelectedJob]);

    return (
        <div
            className={`${styles.jobSection} ${
                isExpanded ? styles.expanded : ""
            }`}
        >
            {!initialLoading && (
                <>
                    <div
                        className={`${styles.headerContainer} ${
                            jobList ? styles.emptySelect : ""
                        }`}
                    >
                        {
                            <CustomSelect
                                key={selectedJob?.id ?? "New job position"}
                                placeHolder={
                                    selectedJob?.name && !isCreateMode
                                        ? selectedJob.name
                                        : "New job position"
                                }
                                options={[
                                    ...jobList.map((j) => ({
                                        value: j.id,
                                        label: j.name,
                                        selected: selectedJob?.id === j.id,
                                    })),
                                    {
                                        value: "create",
                                        label: "New job position",
                                    },
                                ]}
                                onChange={(val) => changeJob(val)}
                            />
                        }
                        <button
                            className={styles.arrowButton}
                            onClick={handleOpen}
                        >
                            {<Arrow isOpen={isExpanded} />}
                        </button>
                    </div>
                    {firstExpanded && (
                        <div
                            className={`${styles.formDropdown} ${
                                isExpanded
                                    ? styles.animationIn
                                    : styles.animationOut
                            }`}
                        >
                            <JobContext.Provider
                                value={{
                                    selectedJob,
                                    jobList,
                                    updateList,
                                }}
                            >
                                {!isCreateMode && selectedJob && (
                                    <UpdateJob
                                        key={selectedJob.id}
                                        loading={loading}
                                        onSetLoading={setLoading}
                                    />
                                )}
                                {isCreateMode && isExpanded && (
                                    <CreateJobForm
                                        loading={loading}
                                        onSetLoading={setLoading}
                                    />
                                )}
                            </JobContext.Provider>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobPanel;
