//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
    useContext,
} from "react";
import jobService from "../../services/JobService";
import CustomSelect from "../blocks/customSelect/CustomSelect";
import Arrow from "../blocks/icons/Arrow";
import CreateJobForm from "./createJob/CreateJob";
import UpdateJob from "./updateJob/UpdateJob";
import styles from "./jobPanel.module.scss";
import { JobContext } from "../dashboard/Dashboard";
import { Job } from "../../classes/JobPosition";
//#endregion

type thisProps = {
    onSetSelectedJob: Dispatch<SetStateAction<Job | null>>;
};

const JobPanel: FunctionComponent<thisProps> = ({ onSetSelectedJob }) => {
    const selectedJob = useContext(JobContext);
    const [jobList, setJobList] = useState<Job[]>([]);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [firstExpanded, setFirstExpanded] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);

    function changeSelectedJob(value: string) {
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
                    jobService.parseAsJobPosition(job)
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
                                    ...jobList.map((job) => ({
                                        value: job.id,
                                        label: job.name,
                                        selected: selectedJob?.id === job.id,
                                    })),
                                    {
                                        value: "create",
                                        label: "New job position",
                                    },
                                ]}
                                onChange={(val) => changeSelectedJob(val)}
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
                            {!isCreateMode && selectedJob && (
                                <UpdateJob
                                    key={selectedJob.id}
                                    jobList={jobList}
                                    onEnd={updateList}
                                    loading={loading}
                                    onSetLoading={setLoading}
                                />
                            )}
                            {isCreateMode && isExpanded && (
                                <CreateJobForm
                                    onEnd={updateList}
                                    loading={loading}
                                    onSetLoading={setLoading}
                                />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobPanel;

/*
Questions:

Company name
Address
Job description
Saturday price
Sunday price
Holiday price
Overwork plus
Overtime plus

Any extra plus:
Tax
Benefit
By time, by condition

*/
