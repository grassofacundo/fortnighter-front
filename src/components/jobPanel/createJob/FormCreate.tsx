//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import FormManager from "../../utils/form/FormManager";
import { parsedAnswers } from "../../utils/form/types/FormTypes";
import {
    getDateAsInputValue,
    getDaysBetweenDates,
    getPastDate,
    getToday,
    setDateFromInput,
} from "../../../services/dateService";
import { dateInput, year } from "../../utils/form/types/DateInputTypes";
import { formData } from "./CreateJob";
import styles from "./CreateJob.module.scss";
//#endregion

type answerData = {
    positionName: string;
    companyName?: string;
    cycleEnd: Date;
    cycleStart: Date;
};
type thisProps = {
    onEnd: (formData: formData) => void;
    onSetError: Dispatch<SetStateAction<string>>;
    error: string;
    submitted: boolean;
    loading: boolean;
};

const getEndDate = () => getDateAsInputValue(getToday());
const getStartDate = () => getDateAsInputValue(getPastDate(15, getToday()));

const FormCreate: FunctionComponent<thisProps> = ({
    onEnd,
    onSetError,
    error,
    submitted,
    loading,
}) => {
    const [cycleEnd, setCycleEnd] = useState<string>(getEndDate());
    const [cycleStart, setCycleStart] = useState<string>(getStartDate());

    function handleUpdateAnswers(answers: parsedAnswers): void {
        if (answers.cycleEnd) setCycleEnd(answers.cycleEnd as string);
        if (answers.cycleStart) setCycleStart(answers.cycleStart as string);
    }

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        let data: answerData | undefined = undefined;
        try {
            const positionName = answers.positionName as string;
            const companyName = answers.companyName as string;
            const cycleEndInput = setDateFromInput(answers.cycleEnd as string);
            const cycleStartInput = setDateFromInput(
                answers.cycleStart as string
            );

            data = {
                positionName,
                companyName,
                cycleEnd: cycleEndInput,
                cycleStart: cycleStartInput,
            };
        } catch (error) {
            onSetError(
                error instanceof Error
                    ? error.message
                    : "Error parsing input values"
            );
        }

        if (!data || !data.positionName || !data.cycleEnd) {
            onSetError("Error on form answers");
            return;
        }

        const daysDiff = getDaysBetweenDates(data.cycleStart, data.cycleEnd);

        const formData: formData = {
            name: data.positionName,
            companyName: data.companyName,
            paymentLapse: daysDiff,
            nextPaymentDate: data.cycleEnd,
        };

        onEnd(formData);
    }

    return (
        <div className={submitted ? styles.submittedForm : ""}>
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
                        type: "customDate",
                        id: "cycleStart",
                        label: "Date of your last payment",
                        yearMin: `${new Date().getFullYear() - 1}` as year,
                        yearMax: `${new Date().getFullYear() + 1}` as year,
                        defaultValue: cycleStart,
                    } as dateInput,
                    {
                        type: "customDate",
                        id: "cycleEnd",
                        label: "Date of your next payment",
                        yearMin: `${new Date().getFullYear() - 1}` as year,
                        yearMax: `${new Date().getFullYear() + 1}` as year,
                        defaultValue: cycleEnd,
                    },
                ]}
                submitCallback={handleSubmit}
                updateAnswers={handleUpdateAnswers}
                submitText={"Next step"}
                loading={loading}
                disabled={submitted}
                serverErrorMsg={error}
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

export default FormCreate;
