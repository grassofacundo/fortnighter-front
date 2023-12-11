//#region Dependency list
import { FunctionComponent, useEffect, useState } from "react";
import { shiftState } from "../../types/job/Shift";
import styles from "./Summary.module.scss";
import { jobPosition } from "../../types/job/Position";
import { getStringDMY } from "../../services/dateService";
import DatePicker from "../datePicker/DatePicker";
//#endregion

type thisProps = {
    shiftList: shiftState[];
    position: jobPosition;
    searchDates: {
        start: Date;
        end: Date;
    };
};

const Summary: FunctionComponent<thisProps> = ({
    shiftList,
    position,
    searchDates,
}) => {
    const [startDate, setStartDate] = useState<string>(getStartDate());
    const [endDate, setEndDate] = useState<string>(getEndDate());
    const [totalIncome, setTotalIncome] = useState<number>(getTotal());
    const [summaryDates, setSummaryDates] = useState<{
        start: Date;
        end: Date;
    }>({
        start: searchDates.start,
        end: searchDates.end,
    });

    function getStartDate(): string {
        if (!shiftList || shiftList.length <= 0) return "";

        const firstDate = shiftList[0].date;
        return getStringDMY(firstDate);
    }

    function getEndDate(): string {
        if (!shiftList || shiftList.length <= 0) return "";

        const endDate = shiftList[shiftList.length - 1].date;
        return getStringDMY(endDate);
    }

    function getTotal(): number {
        let total = 0;
        shiftList.forEach(
            (shift) => (total += shift.hoursWorked * position.hourPrice)
        );
        return total;
    }

    useEffect(() => {
        let total = 0;
        shiftList.forEach(
            (shift) => (total += shift.hoursWorked * position.hourPrice)
        );
        setTotalIncome(total);
    }, [shiftList, position]);

    return (
        <div className={styles.summaryBody}>
            {startDate && endDate && (
                <p>{`Total made from ${startDate} to ${endDate}: ${totalIncome}`}</p>
            )}
            <DatePicker onSetSearchDates={setSummaryDates}></DatePicker>
        </div>
    );
};

export default Summary;
