//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import FormManager from "../../utils/form/FormManager";
import { jobPosition } from "../../../types/job/Position";
import {
    getDateAsInputValue,
    getDaysBetweenDates,
    getPastDate,
    setDateFromInput,
} from "../../../services/dateService";
import { formAnswersType } from "../../../types/form/FormTypes";
import jobService from "../../../services/JobService";
import { dateInput } from "../../../types/form/DateInputTypes";
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
    const [cycleStart, setCycleStart] = useState<string>(
        getDateAsInputValue(
            getPastDate(position.paymentLapse, position.nextPaymentDate)
        )
    );
    const [cycleEnd, setCycleEnd] = useState<string>(
        getDateAsInputValue(position.nextPaymentDate)
    );

    function handleUpdateAnswers(answers: formAnswersType[]): void {
        const cycleEndAnswer = answers
            .filter((answer) => answer.id === "cycleEnd")
            .at(0);
        if (cycleEndAnswer?.value) setCycleEnd(cycleEndAnswer.value as string);
        const cycleStartAnswer = answers
            .filter((answer) => answer.id === "cycleStart")
            .at(0);
        if (cycleStartAnswer?.value)
            setCycleStart(cycleStartAnswer.value as string);
    }

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

    useEffect(() => {
        const end = position.nextPaymentDate;
        const start = getPastDate(position.paymentLapse, end);
        jobService
            .getLastPayment(start, end, position.id)
            .then((paymentRes) => {
                console.log(paymentRes);
                // if (jobList.length > 0) {
                //     const parsedJobList = jobList.map((job) =>
                //         jobService.parseAsJobPosition(job)
                //     );
                //     setJobPositionList(parsedJobList);
                //     onSetSelectedPosition(parsedJobList[0]);
                //     setIsExpanded(false);
                // } else {
                //     setIsCreateMode(true);
                //     setIsExpanded(true);
                // }
                // setInitialLoading(false);
            });
    }, []);

    return (
        <div>
            <FormManager
                inputs={[
                    {
                        type: "text",
                        id: "positionName",
                        placeholder: "Position name",
                        defaultValue: position.name,
                    },
                    {
                        type: "number",
                        label: "Price per hour",
                        id: "hourPrice",
                        defaultValue: position?.hourPrice.toString(),
                    },
                    {
                        type: "customDate",
                        id: "cycleStart",
                        label: "Date of your last payslip",
                        yearMin: "2023",
                        yearMax: "2024",
                        defaultValue: getDateAsInputValue(
                            getPastDate(
                                position.isFortnightly ? 15 : 30,
                                position.cycleEnd
                            )
                        ),
                    } as dateInput,
                    {
                        type: "customDate",
                        id: "cycleEnd",
                        label: "Date of your next payslip",
                        yearMin: "2023",
                        yearMax: "2024",
                        defaultValue: getDateAsInputValue(position.cycleEnd),
                    },
                ]}
                submitCallback={handleSubmit}
                updateAnswers={handleUpdateAnswers}
                submitText={"Update job"}
                Loading={loading}
                serverErrorMsg={errorMsg}
            />
            {cycleStart && cycleEnd && (
                <p>{`Getting paid every ${getDaysBetweenDates(
                    setDateFromInput(cycleStart),
                    setDateFromInput(cycleEnd)
                )} days?`}</p>
            )}
        </div>
    );
};

export default UpdateJobForm;
