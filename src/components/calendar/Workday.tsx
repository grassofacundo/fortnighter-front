//#region Dependency list
import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Workday.module.scss";
import FormManager from "../utils/form/FormManager";
import {
    getDateAsInputValue,
    getStringDMY,
    parseDateAsId,
} from "../../services/dateService";
import { shiftBase, shiftLocalState, shiftState } from "../../types/job/Shift";
import shiftService from "../../services/shiftService";
import { checkbox } from "../../types/form/CheckboxTypes";
import { inputTimeType } from "../../types/form/TimeType";
import { parsedAnswers } from "../../types/form/FormTypes";
import { inputNumber } from "../../types/form/InputNumberTypes";
//#endregion

type answerData = {
    isHoliday: boolean;
    startWork: Date;
    endWork: Date;
};
type thisProps = {
    day: Date;
    shift?: shiftState;
    jobPositionId: string;
    onUpdateShift(updatedShift: shiftState): void;
};

const Workday: FunctionComponent<thisProps> = ({
    day,
    shift,
    jobPositionId,
    onUpdateShift,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [shiftLocal, setShiftLocal] = useState<shiftLocalState<Date>>({
        jobPositionId,
        isHoliday: shift?.isHoliday ?? false,
        startTime: shift?.startTime,
        endTime: shift?.endTime,
    });

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        let data: answerData | undefined = undefined;
        try {
            data = {
                isHoliday: answers[`isHoliday${parseDateAsId(day)}`] as boolean,
                startWork: new Date(
                    `${getDateAsInputValue(day)}T${answers.startWork}`
                ),
                endWork: new Date(
                    `${getDateAsInputValue(day)}T${answers.endWork}`
                ),
            };
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Error parsing input values"
            );
        }
        if (!data || Object.values(data).some((v) => v == null)) {
            setErrorMsg("Error on form answers");
            return;
        }
        setLoading(true);

        const shiftObj: shiftBase = {
            jobPositionId,
            isHoliday: data.isHoliday,
            startTime: data.startWork,
            endTime: data.endWork,
        };

        const response = await shiftService.setShift(shiftObj);
        if (response.ok) {
            setErrorMsg("");
            const shiftToSave = shiftService.getShiftAsState(shiftObj);
            if (shiftToSave) onUpdateShift(shiftToSave);
        }
        setLoading(false);
        if (!response.ok && response.error) {
            setShiftLocal(shiftObj);
            setErrorMsg(response.error.message);
            return;
        }
    }

    // useEffect(() => {
    //     if (shift) {
    //         setShiftLocal({
    //             jobPositionId,
    //             isHoliday: !!shift?.isHoliday,
    //             startTime: shift?.startTime ? shift.startTime : undefined,
    //             endTime: shift?.endTime ? shift.endTime : undefined,
    //         });
    //     }
    // }, [shift, jobPositionId]);

    return (
        <div
            className={`${styles.dayBody} ${isExpanded ? styles.expanded : ""}`}
        >
            <div className={styles.headerContainer}>
                <p>{getStringDMY(day)}</p>
                {shift && (
                    <p>{`${shift.startTime?.getHours()}:${shift.startTime?.getMinutes()} to ${shift.endTime?.getHours()}:${shift.endTime?.getMinutes()} ${
                        shift.hoursWorked
                    } hours worked`}</p>
                )}
                <button onClick={() => setIsExpanded((v) => !v)}>
                    {isExpanded ? "Hide" : "Show"}
                </button>
            </div>
            {
                <FormManager
                    inputs={[
                        {
                            type: "checkbox",
                            id: `isHoliday${parseDateAsId(day)}`,
                            label: "Is holiday?",
                            checked: shiftLocal.isHoliday,
                        } as checkbox,
                        {
                            type: "time",
                            id: "startWork",
                            label: "Start time",
                            hour: {
                                type: "number",
                                id: `startWorkHour${parseDateAsId(day)}`,
                                label: `Hour work started-${getStringDMY(day)}`,
                                min: 0,
                                max: 23,
                                placeholder: "8",
                                defaultValue: shiftLocal?.startTime
                                    ? shiftLocal.startTime
                                          ?.getHours()
                                          .toString()
                                    : "",
                            } as inputNumber,
                            minute: {
                                type: "number",
                                id: `startWorkMinute${parseDateAsId(day)}`,
                                label: "Minute work started",
                                placeholder: "30",
                                step: "30",
                                min: 0,
                                max: 59,
                                defaultValue: shiftLocal?.startTime
                                    ? shiftLocal.startTime
                                          ?.getMinutes()
                                          .toString()
                                    : "",
                            } as inputNumber,
                        } as inputTimeType,
                        {
                            type: "time",
                            id: "endWork",
                            label: "End time",
                            hour: {
                                type: "number",
                                id: `endWorkHour${parseDateAsId(day)}`,
                                min: 0,
                                max: 23,
                                placeholder: "8",
                                defaultValue: shiftLocal?.endTime
                                    ? shiftLocal.endTime?.getHours().toString()
                                    : "",
                            },
                            minute: {
                                type: "number",
                                id: `endWorkMinute${parseDateAsId(day)}`,
                                placeholder: "30",
                                step: "30",
                                min: 0,
                                max: 59,
                                defaultValue: shiftLocal?.endTime
                                    ? shiftLocal.endTime
                                          ?.getMinutes()
                                          .toString()
                                    : "",
                            },
                        } as inputTimeType,
                    ]}
                    submitCallback={handleSubmit}
                    submitText={"Update shift"}
                    Loading={Loading}
                    serverErrorMsg={errorMsg}
                />
            }
        </div>
    );
};

export default Workday;
