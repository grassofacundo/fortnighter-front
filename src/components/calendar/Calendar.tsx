import { useState, FunctionComponent } from "react";
import Day from "./Day";
import styles from "./Calendar.module.scss";

type thisProps = {
    endDate?: Date;
    jobPositionId: string;
};

const Calendar: FunctionComponent<thisProps> = ({ endDate, jobPositionId }) => {
    const [isFortnight, setIsFortnight] = useState<boolean>(true);

    function setDays(): Date[] {
        const lastDate: Date = endDate ?? new Date();
        const daysNum = isFortnight ? 14 : 7;
        const days = Array(daysNum);
        for (let i = daysNum; i > 0; i--) {
            days[i - 1] = new Date(lastDate);
            lastDate.setDate(lastDate.getDate() - 1);
        }
        return days.reverse();
    }

    const days = setDays();

    return (
        <div className={styles.calendar}>
            <button
                onClick={() => setIsFortnight((isFortnight) => !isFortnight)}
            >
                {isFortnight ? "Show week" : "Show fortnight"}
            </button>
            <div className={styles.daysWrapper}>
                {days.map((day, i) => (
                    <Day key={i} day={day} jobPositionId={jobPositionId} />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
