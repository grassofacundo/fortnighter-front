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
import { dateInput } from "../../utils/form/blocks/date/Types";
import { Job } from "../../../classes/job/JobPosition";
import jobService from "../../../services/JobService";
import { JobContext } from "../jobPanel";
//#endregion

type answerData = {
    jobName: string;
    companyName?: string;
    hourPrice: number;
    nextPayment: Date;
    lastPayment: Date;
};
type thisProps = {
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const BaseInfoForm: FunctionComponent<thisProps> = ({
    loading,
    onSetLoading,
}) => {
    const jobCtx = useContext(JobContext);
    const selectedJob = jobCtx?.selectedJob;
    const onEnd = jobCtx?.updateList;

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [lastPay, setLastPay] = useState<string>(getDefault("lastPayment"));
    const [nextPay, setNextPay] = useState<string>(getDefault("nextPayment"));
    const [minStartDate, setMinStartDate] = useState<Date>();

    function getDefault(payment: "lastPayment" | "nextPayment"): string {
        const datePath = selectedJob?.[payment];
        const inputDate = datePath ? getDateAsInputValue(datePath) : "";
        return inputDate;
    }

    function handleUpdateAnswers(answers: parsedAnswers): void {
        if (answers.nextPayment) setNextPay(answers.nextPayment as string);
        if (answers.lastPayment) setLastPay(answers.lastPayment as string);
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
            !onEnd ||
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

        const jobObj = new Job({
            id: selectedJob.id,
            name: data.jobName,
            companyName: data.companyName,
            hourPrice: selectedJob.hourPrice,
            workdayTimes: selectedJob.workdayTimes,
            lastPayment: data.lastPayment,
            nextPayment: data.nextPayment,
        });
        const responseDb = await jobObj.update();
        if (!responseDb.ok && responseDb.error) {
            setErrorMsg(responseDb.error.message);
            onSetLoading(false);
            return;
        }

        if (responseDb.ok) {
            onEnd(jobObj);
            setErrorMsg("");
            onSetLoading(false);
        }
    }

    useEffect(() => {
        if (!selectedJob) return;

        jobService.getLastPayment(selectedJob.id).then((response) => {
            if (response.ok && response.content) {
                const payment = jobService.parseAsPayment(response.content);
                const minStartDate = payment.endDate;
                setMinStartDate(minStartDate);
            }
        });
    }, [selectedJob]);

    return (
        <div>
            <FormManager
                inputs={[
                    {
                        type: "text",
                        id: "positionName",
                        label: "Position name",
                        defaultValue: selectedJob?.name,
                    },
                    {
                        type: "text",
                        id: "companyName",
                        placeholder: "Name of company",
                        label: "Name of company",
                        isOptional: true,
                        defaultValue: selectedJob?.companyName,
                    },
                    {
                        type: "customDate",
                        id: "lastPayment",
                        label: "Date of your last payslip",
                        yearMin: "2023",
                        yearMax: "2024",
                        defaultValue: getDefault("lastPayment"),
                    } as dateInput,
                    {
                        type: "customDate",
                        id: "nextPayment",
                        label: "Date of your next payslip",
                        yearMin: "2023",
                        yearMax: "2024",
                        defaultValue: getDefault("nextPayment"),
                    },
                ]}
                submitCallback={handleSubmit}
                updateAnswers={handleUpdateAnswers}
                submitText={"Update job"}
                loading={loading}
                serverErrorMsg={errorMsg}
            >
                {lastPay && nextPay && (
                    <p>{`Getting paid every ${getDaysBetweenDates(
                        setDateFromInput(lastPay),
                        setDateFromInput(nextPay)
                    )} days?`}</p>
                )}
            </FormManager>
        </div>
    );
};

export default BaseInfoForm;
