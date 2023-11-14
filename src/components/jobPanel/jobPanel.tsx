//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import FormManager from "../utils/form/FormManager";
import jobService from "../../services/JobService";
import styles from "./jobPanel.module.scss";
import { jobPosition, newJobPosition } from "../../types/job/Position";
//#endregion

type thisProps = {
    selectedPosition: jobPosition | null;
    onSetSelectedPosition: Dispatch<SetStateAction<jobPosition | null>>;
};

const JobPanel: FunctionComponent<thisProps> = ({
    selectedPosition,
    onSetSelectedPosition,
}) => {
    const [jobPositionList, setJobPositionList] = useState<jobPosition[]>([]);
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
        const responseDb = await jobService.createJobPosition(newJobPosition);
        if (!responseDb.ok && responseDb.error) {
            setErrorMsg(responseDb.error.message);
            return;
        }

        if (responseDb.ok && responseDb.content) {
            const jobPosition: jobPosition = {
                id: responseDb.content._id,
                name: positionName,
                hourPrice,
                cycleEnd,
                isFortnightly,
            };
            const list: jobPosition[] = JSON.parse(
                JSON.stringify(jobPositionList)
            );
            setJobPositionList([
                ...list,
                {
                    ...jobPosition,
                },
            ]);
        }
    }

    useEffect(() => {
        jobService.getJobPositions().then((jobList) => {
            if (jobList.length > 0) onSetSelectedPosition(jobList[0]);
            setJobPositionList(jobList);
        });
    }, [onSetSelectedPosition]);

    return (
        <div className={styles.jobSection}>
            {jobPositionList.length > 0 && (
                <select id="cars">
                    {jobPositionList.map((position) => (
                        <option
                            value={position.id}
                            selected={selectedPosition?.id === position.id}
                        >
                            {position.name}
                        </option>
                    ))}
                </select>
            )}
            <div className={styles.formSection}>
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
                    submitText={"Create job"}
                    Loading={Loading}
                    serverErrorMsg={errorMsg}
                />
            </div>
        </div>
    );
};

export default JobPanel;
