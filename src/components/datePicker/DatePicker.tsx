//#region Dependency list
import { FunctionComponent, useState, useEffect, useCallback } from "react";
import {
    getFutureDate,
    getPastDate,
    getToday,
} from "../../services/dateService";
import styles from "./DatePicker.module.scss";
import DateInput from "./dateInput/DateInput";
//#endregion

type thisProps = {
    id: string;
    onChange: (moment: "start" | "end", date: Date) => void;
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
                onHandleDateChange={(date: Date) => onChange("start", date)}
            />
            <DateInput
                id={`${id}-end`}
                label="To"
                defaultValue={endDate}
                onHandleDateChange={(date: Date) => onChange("end", date)}
            />
            <button disabled={!areDatesValid} onClick={() => onSubmit()}>
                {buttonText}
            </button>
        </div>
    );
};

export default DatePicker;
