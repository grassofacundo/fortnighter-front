//#region Dependency list
import {
    FunctionComponent,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
    useContext,
} from "react";
import FormManager from "../../utils/form/FormManager";
import { jobPosition } from "../../../types/job/Position";
import {
    getDateAsInputValue,
    getDaysBetweenDates,
    getPastDate,
    setDateFromInput,
} from "../../../services/dateService";
import { parsedAnswers } from "../../utils/form/types/FormTypes";
import jobService from "../../../services/JobService";
import { dateInput } from "../../utils/form/types/DateInputTypes";
import { JobContext } from "../../dashboard/Dashboard";
//#endregion

type answerData = {
    positionName: string;
    hourPrice: number;
    cycleEnd: Date;
    cycleStart: Date;
};
type thisProps = {
    jobPositionList: jobPosition[];
    onEnd(updatedJobPosition: jobPosition): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const BaseInfoForm: FunctionComponent<thisProps> = ({
    onEnd,
    loading,
    onSetLoading,
}) => {
    const position = useContext(JobContext);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [cycleStart, setCycleStart] = useState<string>(
        position
            ? getDateAsInputValue(
                  getPastDate(position.paymentLapse, position.nextPaymentDate)
              )
            : ""
    );
    const [cycleEnd, setCycleEnd] = useState<string>(
        position ? getDateAsInputValue(position.nextPaymentDate) : ""
    );

    function handleUpdateAnswers(answers: parsedAnswers): void {
        if (answers.cycleEnd) setCycleEnd(answers.cycleEnd as string);
        if (answers.cycleStart) setCycleStart(answers.cycleStart as string);
    }

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        let data: answerData | undefined = undefined;
        try {
            const positionName = answers.positionName as string;
            const hourPrice = Number(answers.hourPrice);
            const cycleEndInput = setDateFromInput(answers.cycleEnd as string);
            const cycleStartInput = setDateFromInput(
                answers.cycleStart as string
            );

            data = {
                positionName,
                hourPrice,
                cycleEnd: cycleEndInput,
                cycleStart: cycleStartInput,
            };
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Error parsing input values"
            );
        }

        if (!position || !data || Object.values(data).some((v) => v == null)) {
            setErrorMsg("Error on form answers");
            return;
        }

        onSetLoading(true);

        const { positionName, hourPrice, cycleEnd } = data;
        const daysDiff = getDaysBetweenDates(data.cycleStart, data.cycleEnd);
        const updatedJobPosition: jobPosition = {
            id: position.id,
            name: positionName,
            hourPrice: { regular: { normal: hourPrice } },
            paymentLapse: daysDiff,
            nextPaymentDate: cycleEnd,
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
        if (!position) return;

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
            {position && (
                <FormManager
                    inputs={[
                        {
                            type: "text",
                            id: "positionName",
                            label: "Position name",
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
                                    position.paymentLapse,
                                    position.nextPaymentDate
                                )
                            ),
                        } as dateInput,
                        {
                            type: "customDate",
                            id: "cycleEnd",
                            label: "Date of your next payslip",
                            yearMin: "2023",
                            yearMax: "2024",
                            defaultValue: getDateAsInputValue(
                                position.nextPaymentDate
                            ),
                        },
                    ]}
                    submitCallback={handleSubmit}
                    updateAnswers={handleUpdateAnswers}
                    submitText={"Update job"}
                    Loading={loading}
                    serverErrorMsg={errorMsg}
                >
                    {cycleStart && cycleEnd && (
                        <p>{`Getting paid every ${getDaysBetweenDates(
                            setDateFromInput(cycleStart),
                            setDateFromInput(cycleEnd)
                        )} days?`}</p>
                    )}
                </FormManager>
            )}
        </div>
    );
};

export default BaseInfoForm;
