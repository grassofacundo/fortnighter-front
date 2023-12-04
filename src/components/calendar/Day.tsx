import { FunctionComponent, MouseEvent, useState } from "react";
import styles from "./Day.module.scss";
import FormManager from "../utils/form/FormManager";
import { getStringDMY, setHour } from "../../services/dateService";
import { shiftBase, shiftState } from "../../types/job/Shift";
import shiftService from "../../services/shiftService";
import { inputNumber } from "../../types/form/InputNumberTypes";
import { checkbox } from "../../types/form/CheckboxTypes";

type thisProps = {
    day: Date;
    shift?: shiftState;
    jobPositionId: string;
    onUpdateShift(updatedShift: shiftState): void;
};

const Day: FunctionComponent<thisProps> = ({
    day,
    shift,
    jobPositionId,
    onUpdateShift,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");
    const shiftCopy = structuredClone(shift);
    const [shiftLocal, setShiftLocal] = useState<shiftBase>({
        jobPositionId,
        isHoliday: !!shiftCopy?.isHoliday,
        startTime: shiftCopy?.startTime,
        endTime: shiftCopy?.endTime,
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
            onUpdateShift(shiftService.getShiftAsState(shiftObj));
        }
        setLoading(false);
        if (!response.ok && response.error) {
            setShiftLocal(shiftObj);
            setErrorMsg(response.error.message);
            return;
        }
    }

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
                            checked: shiftLocal.isHoliday,
                        } as checkbox,
                        {
                            type: "number",
                            id: "start-work",
                            label: "Time work started",
                            placeholder: "8",
                            defaultValue: shiftLocal?.startTime
                                ? shiftLocal.startTime?.getHours()
                                : "",
                            step: "0.1",
                        } as inputNumber,
                        {
                            type: "number",
                            id: "end-work",
                            label: "Time work ended",
                            placeholder: "16",
                            defaultValue: shiftLocal?.endTime
                                ? shiftLocal.endTime?.getHours()
                                : "",
                            step: "0.1",
                        } as inputNumber,
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
