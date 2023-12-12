//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import FormManager from "../../utils/form/FormManager";
import { baseJobPosition, jobPosition } from "../../../types/job/Position";
import { formAnswersType } from "../../../types/form/FormTypes";
import jobService from "../../../services/JobService";
import { setDateFromInput } from "../../../services/dateService";
//#endregion

type thisProps = {
    jobPositionList: jobPosition[];
    onEnd(updatedJobPosition: jobPosition): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const CreateJobForm: FunctionComponent<thisProps> = ({
    onEnd,
    loading,
    onSetLoading,
}) => {
    const [errorMsg, setErrorMsg] = useState<string>("");

    async function handleSubmit(answers: formAnswersType[]): Promise<void> {
        const positionNameAnswer = answers
            .filter((answer) => answer.id === "positionName")
            .at(0);
        const hourPriceAnswer = answers
            .filter((answer) => answer.id === "hourPrice")
            .at(0);
        const isFortnightlyAnswer = answers
            .filter((answer) => answer.id === "isFortnightly")
            .at(0);
        const cycleEndAnswer = answers
            .filter((answer) => answer.id === "cycleEnd")
            .at(0);
        const positionName = positionNameAnswer?.value as string;
        let hourPrice = 0;
        try {
            hourPrice = Number(hourPriceAnswer?.value);
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Error parsing hour price number"
            );
        }
        let isFortnightly = false;
        try {
            isFortnightly = Boolean(isFortnightlyAnswer?.value);
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Error if payment is weekly or fortnightly"
            );
        }
        let cycleEnd;
        try {
            if (!cycleEndAnswer?.value)
                throw new Error("Error parsing cycle date");

            cycleEnd = setDateFromInput(cycleEndAnswer.value as string);
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Error parsing cycle date"
            );
        }

        if (!positionName || !hourPrice || !cycleEnd) {
            setErrorMsg("Error on form answers");
            return;
        }

        onSetLoading(true);

        const newJobPosition: baseJobPosition<Date> = {
            name: positionName,
            hourPrice,
            isFortnightly,
            cycleEnd,
        };
        const responseDb = await jobService.createJobPosition(newJobPosition);
        if (!responseDb.ok && responseDb.error) {
            setErrorMsg(responseDb.error.message);
            onSetLoading(false);
            return;
        }

        if (responseDb.ok && responseDb.content) {
            onEnd({
                id: responseDb.content.id,
                name: positionName,
                hourPrice,
                cycleEnd,
                isFortnightly,
            } as jobPosition);
            onSetLoading(false);
        }
    }

    return (
        <FormManager
            inputs={[
                {
                    type: "text",
                    id: "positionName",
                    placeholder: "Position name",
                    isOptional: false,
                },
                {
                    type: "number",
                    id: "hourPrice",
                    placeholder: "Price per hour",
                    isOptional: false,
                },
                {
                    type: "customDate",
                    id: "cycleEnd",
                    label: "Date of you next payslip",
                    isOptional: false,
                },
                {
                    type: "checkbox",
                    id: "isFortnightly",
                    label: "Fortnightly payment?",
                    isOptional: false,
                },
            ]}
            submitCallback={handleSubmit}
            submitText={"Create job"}
            Loading={loading}
            serverErrorMsg={errorMsg}
        />
    );
};

export default CreateJobForm;
