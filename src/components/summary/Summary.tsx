//#region Dependency list
import { FunctionComponent, useState } from "react";
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
    const [startDate, setStartDate] = useState<Date>(searchDates.start);
    const [endDate, setEndDate] = useState<Date>(searchDates.end);
    //const [totalIncome, setTotalIncome] = useState<number>(getTotal());

    function getSaturdays() {
        const saturdays = shiftList.filter((shift) => shift.isSaturday);
        return saturdays.length;
    }

    function getSundays() {
        const sundays = shiftList.filter((shift) => shift.isSunday);
        return sundays.length;
    }

    function getTotal(): number {
        let total = 0;
        shiftList.forEach((shift) => {
            if (shift.date >= startDate && shift.date <= endDate)
                total += shift.hoursWorked * position.hourPrice;
        });
        return total;
    }

    function handleDateChange(start: Date, end: Date): void {
        setStartDate(start);
        setEndDate(end);
    }

    return (
        <div className={styles.summaryBody}>
            <div className={styles.infoPanel}>
                <p>{`Next payment: ${getStringDMY(
                    position.nextPaymentDate
                )}`}</p>
                <p>{`Total made: $${getTotal()}`}</p>
                <p>{`Saturdays worked: ${getSaturdays()}`}</p>
                <p>{`Sundays worked: ${getSundays()}`}</p>
            </div>
            <DatePicker
                id="summary-dates"
                onChange={handleDateChange}
                initialLapseBetweenDated={position.paymentLapse}
                endDate={endDate}
                pastDaysLimit={60}
                futureDaysLimit={30}
                customClass={styles.datePicker}
                buttonText="Change dates"
            ></DatePicker>
        </div>
    );
};

export default Summary;
