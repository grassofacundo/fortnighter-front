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
    getStringDMY,
    setDateFromInput,
} from "../../../services/dateService";
import { parsedAnswers } from "../../utils/form/FormTypes";
import jobService from "../../../services/JobService";
import { dateInput } from "../../utils/form/blocks/date/Types";
import { JobContext } from "../../dashboard/Dashboard";
import { Job } from "../../../classes/job/JobPosition";
//#endregion

type answerData = {
    jobName: string;
    companyName?: string;
    hourPrice: number;
    nextPayment: Date;
    lastPayment: Date;
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
    const [lastPayment, setLastPayment] = useState<string>(
        selectedJob ? getDateAsInputValue(selectedJob.lastPayment) : ""
    );
    const [nextPayment, setNextPayment] = useState<string>(
        selectedJob ? getDateAsInputValue(selectedJob.nextPayment) : ""
    );
    const [minStartDate, setMinStartDate] = useState<Date>();

    function handleUpdateAnswers(answers: parsedAnswers): void {
        if (answers.nextPayment) setNextPayment(answers.nextPayment as string);
        if (answers.lastPayment) setLastPayment(answers.lastPayment as string);
    }

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        let data: answerData | undefined = undefined;
        try {
            const jobName = answers.positionName as string;
            const companyName = answers.companyName as string;
            const hourPrice = Number(answers.hourPrice);
            const nextPaymentInput = setDateFromInput(
                answers.nextPayment as string
            );
            const lastPaymentInput = setDateFromInput(
                answers.lastPayment as string
            );

            data = {
                jobName,
                companyName,
                hourPrice,
                nextPayment: nextPaymentInput,
                lastPayment: lastPaymentInput,
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

        if (minStartDate && data.lastPayment <= minStartDate) {
            setErrorMsg(
                `Our records show a previous payment with ${getStringDMY(
                    minStartDate
                )} as end date. This start date should be after that`
            );
            return;
        }

        onSetLoading(true);

        const job = new Job({
            id: selectedJob.id,
            name: data.jobName,
            companyName: data.companyName,
            hourPrice: selectedJob.hourPrice,
            workdayTimes: selectedJob.workdayTimes,
            lastPayment: data.nextPayment,
            nextPayment: data.nextPayment,
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

        const end = selectedJob.nextPayment;
        const start = selectedJob.lastPayment;
        jobService
            .getPreviousPayment(start, end, selectedJob.id)
            .then((response) => {
                if (response.ok && response.content)
                    setMinStartDate(response.content.endDate);
            });
    }, [selectedJob]);

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
                            id: "lastPayment",
                            label: "Date of your last payslip",
                            yearMin: "2023",
                            yearMax: "2024",
                            defaultValue: getDateAsInputValue(
                                selectedJob.lastPayment
                            ),
                        } as dateInput,
                        {
                            type: "customDate",
                            id: "nextPayment",
                            label: "Date of your next payslip",
                            yearMin: "2023",
                            yearMax: "2024",
                            defaultValue: getDateAsInputValue(
                                selectedJob.nextPayment
                            ),
                        },
                    ]}
                    submitCallback={handleSubmit}
                    updateAnswers={handleUpdateAnswers}
                    submitText={"Update job"}
                    loading={loading}
                    serverErrorMsg={errorMsg}
                >
                    {lastPayment && nextPayment && (
                        <p>{`Getting paid every ${getDaysBetweenDates(
                            setDateFromInput(lastPayment),
                            setDateFromInput(nextPayment)
                        )} days?`}</p>
                    )}
                </FormManager>
            )}
        </div>
    );
};

export default BaseInfoForm;
