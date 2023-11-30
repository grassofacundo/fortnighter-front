import { useState, FunctionComponent } from "react";
import Day from "./Day";
import styles from "./Calendar.module.scss";
import { getDaysBetweenDates } from "../../services/dateService";
import { shiftState } from "../../types/job/Position";

type thisProps = {
    endDate?: Date;
    jobPositionId: string;
    searchDates: {
        start: Date | null;
        end: Date | null;
    };
};

const Calendar: FunctionComponent<thisProps> = ({
    searchDates,
    jobPositionId,
}) => {
    const [shifts, setShifts] = useState<shiftState[]>([]);

    function setDays(): Date[] {
        if (!searchDates.end || !searchDates.start) return [];

        const endDate: Date = structuredClone(searchDates.end);
        const startDate: Date = structuredClone(searchDates.start);

        const daysNum = getDaysBetweenDates(startDate, endDate);
        const days = Array(daysNum);
        for (let i = daysNum; i > 0; i--) {
            days[i - 1] = new Date(endDate);
            endDate.setDate(endDate.getDate() - 1);
        }
        return days.reverse();
    }

    const days = setDays();

    return (
        <div className={styles.calendar}>
            {/* <button
                onClick={() => setIsFortnight((isFortnight) => !isFortnight)}
            >
                {isFortnight ? "Show week" : "Show fortnight"}
            </button> */}
            <div className={styles.daysWrapper}>
                {days.map((day, i) => (
                    <Day key={i} day={day} jobPositionId={jobPositionId} />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
