//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import FormManager from "../../utils/form/FormManager";
import { baseJobPosition, jobPosition } from "../../../types/job/Position";
import { parsedAnswers } from "../../utils/form/types/FormTypes";
import jobService from "../../../services/JobService";
import {
    getDateAsInputValue,
    getDaysBetweenDates,
    getPastDate,
    getToday,
    setDateFromInput,
} from "../../../services/dateService";
import { dateInput } from "../../utils/form/types/DateInputTypes";
//import { paymentBase } from "../../../types/job/Payment";
//#endregion

type answerData = {
    positionName: string;
    companyName?: string;
    hourPrice: number;
    cycleEnd: Date;
    cycleStart: Date;
};
type thisProps = {
    onEnd(updatedJobPosition: jobPosition): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const Step1: FunctionComponent<thisProps> = ({
    onEnd,
    loading,
    onSetLoading,
}) => {
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [cycleEnd, setCycleEnd] = useState<string>(getEndDate());
    const [cycleStart, setCycleStart] = useState<string>(getStartDate());

    function getEndDate() {
        return getDateAsInputValue(getToday());
    }

    function getStartDate() {
        return getDateAsInputValue(getPastDate(15, getToday()));
    }

    function handleUpdateAnswers(answers: parsedAnswers): void {
        if (answers.cycleEnd) setCycleEnd(answers.cycleEnd as string);
        if (answers.cycleStart) setCycleStart(answers.cycleStart as string);
    }

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        let data: answerData | undefined = undefined;
        try {
            const positionName = answers.positionName as string;
            const companyName = answers.companyName as string;
            const hourPrice = Number(answers.hourPrice);
            const cycleEndInput = setDateFromInput(answers.cycleEnd as string);
            const cycleStartInput = setDateFromInput(
                answers.cycleStart as string
            );

            data = {
                positionName,
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

        if (!data || !data.positionName || !data.hourPrice || !data.cycleEnd) {
            setErrorMsg("Error on form answers");
            return;
        }

        onSetLoading(true);

        const daysDiff = getDaysBetweenDates(data.cycleStart, data.cycleEnd);
        const newJob: baseJobPosition<Date> = {
            name: data.positionName,
            companyName: data.companyName,
            hourPrice: data.hourPrice,
            paymentLapse: daysDiff,
            nextPaymentDate: data.cycleEnd,
        };
        const jobRes = await jobService.createJobPosition(newJob);
        if (!jobRes.ok && jobRes.error) {
            setErrorMsg(jobRes.error.message);
            onSetLoading(false);
            return;
        }

        if (jobRes.ok && jobRes.content) {
            onEnd({
                id: jobRes.content.id,
                name: data.positionName,
                companyName: data.companyName,
                hourPrice: data.hourPrice,
                paymentLapse: daysDiff,
                nextPaymentDate: data.cycleEnd,
            } as jobPosition);
            onSetLoading(false);
        }
    }

    return (
        <div>
            <FormManager
                inputs={[
                    {
                        type: "text",
                        id: "positionName",
                        placeholder: "Your job",
                        label: "Position name",
                    },
                    {
                        type: "text",
                        id: "companyName",
                        placeholder: "Name of company",
                        label: "Name of company",
                        isOptional: true,
                    },
                    {
                        type: "number",
                        id: "hourPrice",
                        placeholder: "00",
                        label: "Price per hour",
                    },
                    {
                        type: "customDate",
                        id: "cycleStart",
                        label: "Payslip date start",
                        yearMin: "2023",
                        yearMax: "2024",
                        defaultValue: cycleStart,
                    } as dateInput,
                    {
                        type: "customDate",
                        id: "cycleEnd",
                        label: "Payment date",
                        yearMin: "2023",
                        yearMax: "2024",
                        defaultValue: cycleEnd,
                    },
                ]}
                submitCallback={handleSubmit}
                updateAnswers={handleUpdateAnswers}
                submitText={"Create job"}
                Loading={loading}
                serverErrorMsg={errorMsg}
            />
            {cycleStart && cycleEnd && (
                <p>{`Do you get paid every ${getDaysBetweenDates(
                    setDateFromInput(cycleStart),
                    setDateFromInput(cycleEnd)
                )} days?`}</p>
            )}
        </div>
    );
};

export default Step1;
