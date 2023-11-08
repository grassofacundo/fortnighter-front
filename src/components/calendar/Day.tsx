import { FunctionComponent, useState } from "react";
import styles from "./Day.module.scss";
import FormManager from "../utils/form/FormManager";
import dbService from "../../services/dbService";
import dateService from "../../services/dateService";

type thisProps = {
    day: Date;
    jobPosition: string;
};

const Day: FunctionComponent<thisProps> = ({ day, jobPosition }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [shift, setShift] = useState<shift>({
        date: day,
        timeWorked: 0,
        isSaturday: day.getDay() === 6,
        isSunday: day.getDay() === 0,
        isHoliday: false,
        hoursWorked: { from: 0, to: 0 },
    });

    function handleClick() {
        setIsExpanded((v) => !v);
    }

    async function handleSubmit(answers: formAnswersType[]): Promise<void> {
        setLoading(true);
        const shiftDateAnswer = answers
            .filter((answer) => answer.id === "shift-date")
            .at(0);
        const timeWorkedAnswer = answers
            .filter((answer) => answer.id === "time-worked")
            .at(0);
        const isHolidayAnswer = answers
            .filter((answer) => answer.id === "is-holiday")
            .at(0);
        const startWorkAnswer = answers
            .filter((answer) => answer.id === "start-work")
            .at(0);
        const endWorkAnswer = answers
            .filter((answer) => answer.id === "end-work")
            .at(0);
        const shiftDate = shiftDateAnswer?.value as Date;
        const timeWorked = timeWorkedAnswer?.value as number;
        const isHoliday = isHolidayAnswer?.value as boolean;
        const hoursWorkedFrom = startWorkAnswer?.value as number;
        const hoursWorkedTo = endWorkAnswer?.value as number;

        if (
            !shiftDate ||
            !timeWorked ||
            isHoliday == null ||
            !hoursWorkedFrom ||
            !hoursWorkedTo
        ) {
            setErrorMsg("Error on form answers");
            setLoading(false);
            return;
        }

        const localShift = {
            date: shiftDate,
            timeWorked: timeWorked,
            isSaturday: shiftDate.getDay() === 6,
            isSunday: shiftDate.getDay() === 0,
            isHoliday: isHoliday,
            hoursWorked: { from: hoursWorkedFrom, to: hoursWorkedTo },
        };

        const response = await dbService.updateShift(localShift, jobPosition);
        if (response.ok) {
            setErrorMsg("");
            setShift(localShift);
        }
        setLoading(false);
        if (!response.ok) {
            setErrorMsg(response.errorMessage);
            return;
        }
    }

    return (
        <div
            className={`${styles.dayBody} ${isExpanded ? styles.expanded : ""}`}
            onClick={handleClick}
        >
            <p>{dateService.getStr(day)}</p>
            {isExpanded && (
                <FormManager
                    inputs={[
                        {
                            type: "customDate",
                            id: "shift-date",
                            label: "Selected date",
                            defaultValue: dateService.getDateAsInputValue(day),
                        },
                        {
                            type: "number",
                            id: "time-worked",
                            label: "Time worked",
                            placeholder: shift.timeWorked.toString(),
                        },
                        {
                            type: "checkbox",
                            id: "is-holiday",
                            label: "Is holiday?",
                            checked: true,
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
