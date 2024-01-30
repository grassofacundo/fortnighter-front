//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
    useContext,
} from "react";
import FormManager from "../../utils/form/FormManager";
import {
    getDateAsInputValue,
    getDaysBetweenDates,
    getPastDate,
    setDateFromInput,
} from "../../../services/dateService";
import { parsedAnswers } from "../../utils/form/types/FormTypes";
import jobService from "../../../services/JobService";
import { dateInput } from "../../utils/form/types/DateInputTypes";
import { JobContext } from "../../dashboard/Dashboard";
import { Job } from "../../../classes/job/JobPosition";
//#endregion

type answerData = {
    jobName: string;
    companyName?: string;
    hourPrice: number;
    cycleEnd: Date;
    cycleStart: Date;
};
type thisProps = {
    jobList: Job[];
    onEnd(job: Job): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const BaseInfoForm: FunctionComponent<thisProps> = ({
    onEnd,
    loading,
    onSetLoading,
}) => {
    const selectedJob = useContext(JobContext);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [cycleStart, setCycleStart] = useState<string>(
        selectedJob
            ? getDateAsInputValue(
                  getPastDate(
                      selectedJob.paymentLapse,
                      selectedJob.nextPaymentDate
                  )
              )
            : ""
    );
    const [cycleEnd, setCycleEnd] = useState<string>(
        selectedJob ? getDateAsInputValue(selectedJob.nextPaymentDate) : ""
    );

    function handleUpdateAnswers(answers: parsedAnswers): void {
        if (answers.cycleEnd) setCycleEnd(answers.cycleEnd as string);
        if (answers.cycleStart) setCycleStart(answers.cycleStart as string);
    }

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        let data: answerData | undefined = undefined;
        try {
            const jobName = answers.positionName as string;
            const companyName = answers.companyName as string;
            const hourPrice = Number(answers.hourPrice);
            const cycleEndInput = setDateFromInput(answers.cycleEnd as string);
            const cycleStartInput = setDateFromInput(
                answers.cycleStart as string
            );

            data = {
                jobName,
                companyName,
                hourPrice,
                cycleEnd: cycleEndInput,
                cycleStart: cycleStartInput,
            };
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Error parsing input values"
            );
        }

        if (
            !selectedJob ||
            !data ||
            Object.values(data).some((v) => v == null)
        ) {
            setErrorMsg("Error on form answers");
            return;
        }

        onSetLoading(true);

        const job = new Job({
            id: selectedJob.id,
            name: data.jobName,
            companyName: data.companyName,
            hourPrice: selectedJob.hourPrice,
            workdayTimes: selectedJob.workdayTimes,
            paymentLapse: getDaysBetweenDates(data.cycleStart, data.cycleEnd),
            nextPaymentDate: data.cycleEnd,
        });
        const responseDb = await job.update();
        if (!responseDb.ok && responseDb.error) {
            setErrorMsg(responseDb.error.message);
            onSetLoading(false);
            return;
        }

        if (responseDb.ok && responseDb.content) {
            onEnd(job);
            onSetLoading(false);
        }
    }

    useEffect(() => {
        if (!selectedJob) return;

        const end = selectedJob.nextPaymentDate;
        const start = getPastDate(selectedJob.paymentLapse, end);
        jobService
            .getLastPayment(start, end, selectedJob.id)
            .then((paymentRes) => {
                console.log("Logging payments brought from DB");
                console.log(paymentRes);
                // if (jobList.length > 0) {
                //     const parsedJobList = jobList.map((job) =>
                //         jobService.parseAsJobPosition(job)
                //     );
                //     setJobPositionList(parsedJobList);
                //     onSetSelectedPosition(parsedJobList[0]);
                //     setIsExpanded(false);
                // } else {
                //     setIsCreateMode(true);
                //     setIsExpanded(true);
                // }
                // setInitialLoading(false);
            });
    }, []);

    return (
        <div>
            {selectedJob && (
                <FormManager
                    inputs={[
                        {
                            type: "text",
                            id: "positionName",
                            label: "Position name",
                            defaultValue: selectedJob.name,
                        },
                        {
                            type: "text",
                            id: "companyName",
                            placeholder: "Name of company",
                            label: "Name of company",
                            isOptional: true,
                            defaultValue: selectedJob.companyName,
                        },
                        {
                            type: "customDate",
                            id: "cycleStart",
                            label: "Date of your last payslip",
                            yearMin: "2023",
                            yearMax: "2024",
                            defaultValue: getDateAsInputValue(
                                getPastDate(
                                    selectedJob.paymentLapse,
                                    selectedJob.nextPaymentDate
                                )
                            ),
                        } as dateInput,
                        {
                            type: "customDate",
                            id: "cycleEnd",
                            label: "Date of your next payslip",
                            yearMin: "2023",
                            yearMax: "2024",
                            defaultValue: getDateAsInputValue(
                                selectedJob.nextPaymentDate
                            ),
                        },
                    ]}
                    submitCallback={handleSubmit}
                    updateAnswers={handleUpdateAnswers}
                    submitText={"Update job"}
                    loading={loading}
                    serverErrorMsg={errorMsg}
                >
                    {cycleStart && cycleEnd && (
                        <p>{`Getting paid every ${getDaysBetweenDates(
                            setDateFromInput(cycleStart),
                            setDateFromInput(cycleEnd)
                        )} days?`}</p>
                    )}
                </FormManager>
            )}
        </div>
    );
};

export default BaseInfoForm;
