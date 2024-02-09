//#region Dependency list
import { FunctionComponent } from "react";
import { getPastDate, getToday } from "../../services/dateService";
import styles from "./DatePicker.module.scss";
import DateInput from "./dateInput/DateInput";
//#endregion

type thisProps = {
    id: string;
    onChange: ({
        moment,
        endParam,
        startParam,
    }: {
        moment: "start" | "end" | "both";
        endParam?: Date | undefined;
        startParam?: Date | undefined;
    }) => void;
    onSubmit: () => void;
    initialLapseBetweenDates?: number;
    pastDaysLimit?: number;
    futureDaysLimit?: number;
    startDate?: Date;
    endDate?: Date;
    customClass?: CSSModuleClasses[string];
    buttonText?: string;
    areDatesValid: boolean;
};

const DatePicker: FunctionComponent<thisProps> = ({
    id,
    onChange,
    onSubmit,
    endDate = getToday(),
    startDate = getPastDate(30, endDate),
    customClass = "",
    buttonText = "Search",
    areDatesValid,
}) => {
    return (
        <div className={`${customClass} ${styles.dateContainer}`}>
            <DateInput
                id={`${id}-start`}
                label="From"
                defaultValue={startDate}
                onHandleDateChange={(date?: Date) =>
                    onChange({
                        moment: "start",
                        startParam: date,
                    })
                }
            />
            <DateInput
                id={`${id}-end`}
                label="To"
                defaultValue={endDate}
                onHandleDateChange={(date?: Date) =>
                    onChange({
                        moment: "end",
                        endParam: date,
                    })
                }
            />
            <button disabled={!areDatesValid} onClick={() => onSubmit()}>
                {buttonText}
            </button>
        </div>
    );
};

export default DatePicker;
