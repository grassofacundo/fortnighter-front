import { FunctionComponent, MouseEvent, useState } from "react";
import styles from "./Day.module.scss";
import FormManager from "../utils/form/FormManager";
import { getStringDMY, setHour } from "../../services/dateService";
import { shiftBase, shiftState } from "../../types/job/Shift";
import shiftService from "../../services/shiftService";

type thisProps = {
    day: Date;
    shift?: shiftState;
    jobPositionId: string;
};

const Day: FunctionComponent<thisProps> = ({ day, jobPositionId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [shiftLocal, setShiftLocal] = useState<shiftBase>({
        jobPositionId,
        isHoliday: false,
        startTime: new Date(),
        endTime: new Date(),
    });

    function handleClick(e: MouseEvent) {
        const target = e.target as Element;
        if (target?.tagName.toLowerCase() === "input") {
            return;
        }
        setIsExpanded((v) => !v);
    }

    async function handleSubmit(answers: formAnswersType[]): Promise<void> {
        setLoading(true);
        const isHolidayAnswer = answers
            .filter((answer) => answer.id === "is-holiday")
            .at(0);
        const startTimeAnswer = answers
            .filter((answer) => answer.id === "start-work")
            .at(0);
        const endTimeAnswer = answers
            .filter((answer) => answer.id === "end-work")
            .at(0);
        const isHoliday = isHolidayAnswer?.value as boolean;
        const startTime = startTimeAnswer?.value as number;
        const endTime = endTimeAnswer?.value as number;

        if (isHoliday == null || !startTime || !endTime) {
            setErrorMsg("Error on form answers");
            setLoading(false);
            return;
        }

        const shiftObj: shiftBase = {
            jobPositionId,
            isHoliday: isHoliday,
            startTime: setHour(day, startTime),
            endTime: setHour(day, endTime),
        };

        const response = await shiftService.setShift(shiftObj);
        if (response.ok) {
            setErrorMsg("");
            setShiftLocal(shiftObj);
        }
        setLoading(false);
        if (!response.ok && response.error) {
            setErrorMsg(response.error.message);
            return;
        }
    }

    if (shiftLocal) console.log(shiftLocal);

    return (
        <div
            className={`${styles.dayBody} ${isExpanded ? styles.expanded : ""}`}
        >
            <div className={styles.headerContainer}>
                <p>{getStringDMY(day)}</p>
                <button onClick={handleClick}>
                    {isExpanded ? "Hide" : "Show"}
                </button>
            </div>
            {isExpanded && (
                <FormManager
                    inputs={[
                        {
                            type: "checkbox",
                            id: "is-holiday",
                            label: "Is holiday?",
                            //checked: false,
                        },
                        {
                            type: "number",
                            id: "start-work",
                            label: "Time work started",
                            placeholder: "8",
                        },
                        {
                            type: "number",
                            id: "end-work",
                            label: "Time work ended",
                            placeholder: "16",
                        },
                    ]}
                    submitCallback={handleSubmit}
                    submitText={"Update shift"}
                    Loading={Loading}
                    serverErrorMsg={errorMsg}
                />
            )}
        </div>
    );
};

export default Day;
