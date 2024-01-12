//#region Dependency list
import { FunctionComponent, useState } from "react";
import FormManager from "../../utils/form/FormManager";
import { parsedAnswers } from "../../utils/form/types/FormTypes";
import { inputNumber } from "../../utils/form/types/InputNumberTypes";
import { inputTimeType, time12Meridian } from "../../utils/form/types/TimeType";
import { checkbox } from "../../utils/form/types/CheckboxTypes";
import {
    dateAsTimeStructure,
    getTime24,
} from "../../utils/form/blocks/time/select/TimeMethods";
import { Shift } from "../../../classes/Shift";
import { BaseShift } from "../../../classes/BaseShift";
import { getTomorrow } from "../../../services/dateService";
//#endregion

type thisProps = {
    id: string;
    date: string;
    jobId: string;
    shift?: Shift;
    onEnd(shift: Shift): void;
};

const ShiftForm: FunctionComponent<thisProps> = ({
    id,
    date,
    jobId,
    shift,
    onEnd,
}) => {
    const [Loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        try {
            !!answers[`isHoliday${id}`];
            new Date(
                `${date}T${getTime24(answers.startWork as time12Meridian)}`
            );
            new Date(`${date}T${getTime24(answers.endWork as time12Meridian)}`);
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Error parsing input values"
            );
        }
        const isHoliday = answers[`isHoliday${id}`] as boolean;

        const start = new Date(
            `${date}T${getTime24(answers.startWork as time12Meridian)}`
        );
        let end = new Date(
            `${date}T${getTime24(answers.endWork as time12Meridian)}`
        );
        if (start >= end) end = getTomorrow(end);

        if (isHoliday == null) {
            setErrorMsg("Error on is holiday value");
            return;
        }
        if (!start) {
            setErrorMsg("Error on work started value");
            return;
        }
        if (!end) {
            setErrorMsg("Error on work started value");
            return;
        }
        setLoading(true);

        const shiftObj = shift
            ? new Shift({ ...shift, isHoliday, start, end })
            : new BaseShift(jobId, isHoliday, start, end);

        const response = await shiftObj.save();
        if (response.ok) {
            setErrorMsg("");
            onEnd(
                shiftObj instanceof Shift
                    ? shiftObj
                    : new Shift({
                          ...shiftObj,
                          id: response.content ? response.content : "",
                      })
            );
        }
        setLoading(false);
        if (!response.ok && response.error) {
            setErrorMsg(response.error.message);
            return;
        }
    }

    return (
        <FormManager
            inputs={[
                {
                    type: "checkbox",
                    id: `isHoliday${id}`,
                    label: "Is holiday?",
                    checked: shift?.isHoliday,
                } as checkbox,
                {
                    type: "time",
                    id: "startWork",
                    label: "Start time",
                    defaultValue: shift
                        ? dateAsTimeStructure(shift.start)
                        : undefined,
                    hour: {
                        type: "number",
                        id: `startWorkHour${id}`,
                        min: 0,
                        max: 23,
                        placeholder: "8",
                    } as inputNumber,
                    minute: {
                        type: "number",
                        id: `startWorkMinute${id}`,
                        label: "Minute work started",
                        step: "30",
                        min: 0,
                        max: 59,
                        placeholder: "00",
                    } as inputNumber,
                    meridian: {
                        isAm: true,
                    },
                } as inputTimeType,
                {
                    type: "time",
                    id: "endWork",
                    label: "End time",
                    defaultValue: shift
                        ? dateAsTimeStructure(shift.end)
                        : undefined,
                    hour: {
                        type: "number",
                        id: `endWorkHour${id}`,
                        min: 0,
                        max: 23,
                        placeholder: "5",
                    },
                    minute: {
                        type: "number",
                        id: `endWorkMinute${id}`,
                        step: "30",
                        min: 0,
                        max: 59,
                        placeholder: "00",
                    },
                } as inputTimeType,
            ]}
            submitCallback={handleSubmit}
            submitText={shift ? "Update shift" : "Create shift"}
            loading={Loading}
            serverErrorMsg={errorMsg}
        />
    );
};

export default ShiftForm;
