//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import FormManager from "../../utils/form/FormManager";
import { parsedAnswers } from "../../utils/form/FormTypes";
import {
    getDateAsInputValue,
    getDaysBetweenDates,
    getPastDate,
    getToday,
    isValid,
    setDateFromInput,
} from "../../../services/dateService";
import { dateInput, year } from "../../utils/form/blocks/date/Types";
import { formData } from "./CreateJob";
import styles from "./CreateJob.module.scss";
//#endregion

type answerData = {
    positionName: string;
    companyName?: string;
    nextPayment: Date;
    lastPayment: Date;
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
    const [nextPayment, setNextPayment] = useState<string | null>(getEndDate());
    const [lastPayment, setLastPayment] = useState<string | null>(
        getStartDate()
    );

    function handleUpdateAnswers(answers: parsedAnswers): void {
        const validLastPayment =
            answers.nextPayment &&
            isValid(new Date(answers.nextPayment as string));
        const validNextPayment =
            answers.lastPayment &&
            isValid(new Date(answers.lastPayment as string));

        if (validLastPayment) {
            setNextPayment(answers.nextPayment as string);
        } else {
            setNextPayment(null);
        }
        if (validNextPayment) {
            setLastPayment(answers.lastPayment as string);
        } else {
            setLastPayment(null);
        }
    }

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        let data: answerData | undefined = undefined;
        try {
            const positionName = answers.positionName as string;
            const companyName = answers.companyName as string;
            const nextPaymentInput = setDateFromInput(
                answers.nextPayment as string
            );
            const lastPaymentInput = setDateFromInput(
                answers.lastPayment as string
            );

            data = {
                positionName,
                companyName,
                nextPayment: nextPaymentInput,
                lastPayment: lastPaymentInput,
            };
        } catch (error) {
            onSetError(
                error instanceof Error
                    ? error.message
                    : "Error parsing input values"
            );
        }

        if (
            !data ||
            !data.positionName ||
            !data.lastPayment ||
            !data.nextPayment
        ) {
            onSetError("Error on form answers");
            return;
        }

        const formData: formData = {
            name: data.positionName,
            companyName: data.companyName,
            startDate: data.lastPayment,
            endDate: data.nextPayment,
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
                        id: "lastPayment",
                        label: "Date of your last payment",
                        yearMin: `${new Date().getFullYear() - 1}` as year,
                        yearMax: `${new Date().getFullYear() + 1}` as year,
                        defaultValue: lastPayment,
                    } as dateInput,
                    {
                        type: "customDate",
                        id: "nextPayment",
                        label: "Date of your next payment",
                        yearMin: `${new Date().getFullYear() - 1}` as year,
                        yearMax: `${new Date().getFullYear() + 1}` as year,
                        defaultValue: nextPayment,
                    } as dateInput,
                ]}
                submitCallback={handleSubmit}
                updateAnswers={handleUpdateAnswers}
                submitText={"Next step"}
                loading={loading}
                disabled={submitted}
                serverErrorMsg={error}
            />
            {lastPayment && nextPayment && (
                <p>{`Do you get paid every ${getDaysBetweenDates(
                    setDateFromInput(lastPayment),
                    setDateFromInput(nextPayment)
                )} days?`}</p>
            )}
        </div>
    );
};

export default FormCreate;
