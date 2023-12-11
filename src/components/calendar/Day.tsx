//#region Dependency list
import { FunctionComponent, useEffect, useState } from "react";
import styles from "./Day.module.scss";
import FormManager from "../utils/form/FormManager";
import { getDateAsInputValue, getStringDMY } from "../../services/dateService";
import { shiftBase, shiftState } from "../../types/job/Shift";
import shiftService from "../../services/shiftService";
import { checkbox } from "../../types/form/CheckboxTypes";
import { inputTimeType } from "../../types/form/TimeType";
import { formAnswersType } from "../../types/form/FormTypes";
import { inputNumber } from "../../types/form/InputNumberTypes";
//#endregion

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
    const [shiftLocal, setShiftLocal] = useState<shiftBase>({
        jobPositionId,
        isHoliday: false,
    });

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
        const startTime = startTimeAnswer?.value as string;
        const endTime = endTimeAnswer?.value as string;

        if (isHoliday == null || !startTime || !endTime) {
            setErrorMsg("Error on form answers");
            setLoading(false);
            return;
        }

        const start = new Date(`${getDateAsInputValue(day)}T${startTime}`);
        const end = new Date(`${getDateAsInputValue(day)}T${endTime}`);
        const shiftObj: shiftBase = {
            jobPositionId,
            isHoliday,
            startTime: start,
            endTime: end,
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

    useEffect(() => {
        if (shift) {
            setShiftLocal({
                jobPositionId,
                isHoliday: !!shift?.isHoliday,
                startTime: shift?.startTime ? shift.startTime : undefined,
                endTime: shift?.endTime ? shift.endTime : undefined,
            });
        }
    }, [shift, jobPositionId]);

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
                            id: "is-holiday",
                            label: "Is holiday?",
                            checked: shiftLocal.isHoliday,
                        } as checkbox,
                        {
                            type: "time",
                            id: "start-work",
                            label: "Start time",
                            hour: {
                                type: "number",
                                id: "start-work-hour",
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
                                id: `start-work-minute-${getStringDMY(day)}`,
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
                            id: "end-work",
                            label: "End time",
                            hour: {
                                type: "number",
                                id: `end-work-hour-${getStringDMY(day)}`,
                                min: 0,
                                max: 23,
                                placeholder: "8",
                                defaultValue: shiftLocal?.endTime
                                    ? shiftLocal.endTime?.getHours().toString()
                                    : "",
                            },
                            minute: {
                                type: "number",
                                id: `end-work-minute-${getStringDMY(day)}`,
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

export default Day;
