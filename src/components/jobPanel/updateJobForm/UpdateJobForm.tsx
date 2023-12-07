//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import FormManager from "../../utils/form/FormManager";
import { baseJobPosition, jobPosition } from "../../../types/job/Position";
import { getDateAsInputValue } from "../../../services/dateService";
import { formAnswersType } from "../../../types/form/FormTypes";
import jobService from "../../../services/JobService";
//#endregion

type thisProps = {
    position: jobPosition;
    jobPositionList: jobPosition[];
    onEnd(updatedJobPosition: jobPosition): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const UpdateJobForm: FunctionComponent<thisProps> = ({
    position,
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
        let cycleEnd = new Date();
        try {
            cycleEnd = new Date(cycleEndAnswer?.value as Date);
            // const offsetMinutes = cycleEnd.getTimezoneOffset();
            // const localTime = new Date(
            //     cycleEnd.getTime() + offsetMinutes * 60 * 1000
            // );
            // cycleEnd = localTime;
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

        const updatedJobPosition: jobPosition = {
            id: position.id,
            name: positionName,
            hourPrice,
            isFortnightly,
            cycleEnd,
        };
        const responseDb = await jobService.updateJobPosition(
            updatedJobPosition
        );
        if (!responseDb.ok && responseDb.error) {
            setErrorMsg(responseDb.error.message);
            onSetLoading(false);
            return;
        }

        if (responseDb.ok && responseDb.content) {
            onEnd(updatedJobPosition);
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
                    defaultValue: position.name,
                },
                {
                    type: "number",
                    id: "hourPrice",
                    placeholder: "Price per hour",
                    isOptional: false,
                    defaultValue: position?.hourPrice.toString(),
                },
                {
                    type: "customDate",
                    id: "cycleEnd",
                    placeholder: "Date of you next payslip",
                    isOptional: false,
                    defaultValue: getDateAsInputValue(position.cycleEnd),
                },
                {
                    type: "checkbox",
                    id: "isFortnightly",
                    label: "Fortnightly payment?",
                    isOptional: false,
                    checked: position?.isFortnightly,
                },
            ]}
            submitCallback={handleSubmit}
            submitText={"Update job"}
            Loading={loading}
            serverErrorMsg={errorMsg}
        />
    );
};

export default UpdateJobForm;
