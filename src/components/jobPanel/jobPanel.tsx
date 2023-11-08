//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import FormManager from "../utils/form/FormManager";
import dbService from "../../services/dbService";
//#endregion

type thisProps = {
    jobPositionList: jobPosition[];
    onSetJobPositionList: Dispatch<SetStateAction<jobPosition[]>>;
};

const JobPanel: FunctionComponent<thisProps> = ({
    jobPositionList,
    onSetJobPositionList,
}) => {
    const [errorMsg, setErrorMsg] = useState("");
    const [Loading, setLoading] = useState<boolean>(false);

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
        const hourPrice = hourPriceAnswer?.value as number;
        const isFortnightly = isFortnightlyAnswer?.value as boolean;
        const cycleEnd = cycleEndAnswer?.value as Date;

        if (!positionName || !hourPrice || !cycleEnd) {
            setErrorMsg("Error on form answers");
            return;
        }

        setLoading(true);

        const newJobPosition: newJobPosition = {
            name: positionName,
            hourPrice,
            isFortnightly,
            cycleEnd,
        };
        const responseDb = await dbService.createJobPosition(newJobPosition);
        if (!responseDb.ok) {
            setErrorMsg(responseDb.errorMessage);
            return;
        }
        const list: jobPosition[] = JSON.parse(JSON.stringify(jobPositionList));
        list.forEach((job) => (job.isSelected = false));
        if (responseDb.ok) {
            onSetJobPositionList([
                ...list,
                {
                    id: stringService.parseAsId(positionName),
                    name: positionName,
                    isSelected: true,
                },
            ]);
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
                    placeholder: "Date of you next payslip",
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
            submitText={hasAccount ? "Log in" : "Sign in"}
            Loading={Loading}
            serverErrorMsg={errorMsg}
        />
    );
};

export default JobPanel;
