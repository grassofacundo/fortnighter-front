import { useState, FunctionComponent, useEffect, useCallback } from "react";
import Day from "./Day";
import styles from "./Calendar.module.scss";
import {
    datesAreEqual,
    getDaysBetweenDates,
    getPlainDate,
} from "../../services/dateService";
import { shiftGrid, shiftState } from "../../types/job/Shift";
import shiftService from "../../services/shiftService";

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
    const [shiftGrid, setShiftGrid] = useState<shiftGrid[]>([]);

    const setDays = useCallback(
        (shifts: shiftState[]): shiftGrid[] => {
            if (!searchDates.end || !searchDates.start) return [];

            const endDate: Date = structuredClone(searchDates.end);
            const startDate: Date = structuredClone(searchDates.start);

            const daysNum = getDaysBetweenDates(startDate, endDate);
            const days: shiftGrid[] = Array(daysNum);
            for (let i = daysNum; i > 0; i--) {
                const date = new Date(endDate);
                const index = shifts.findIndex((shift) =>
                    datesAreEqual(shift.date, getPlainDate(date))
                );
                const shift = index > -1 ? shifts[index] : undefined;
                days[i - 1] = { date, shift };
                endDate.setDate(endDate.getDate() - 1);
            }
            return days.reverse();
        },
        [searchDates]
    );

    useEffect(() => {
        if (searchDates.start === null || searchDates.end === null) return;

        const startDate: Date = searchDates.start;
        const endDate: Date = searchDates.end;
        const positionId: string = jobPositionId;
        shiftService
            .getShifts(startDate, endDate, positionId)
            .then((shiftList) => {
                const shiftsStates = shiftList.map((shiftBase) =>
                    shiftService.getShiftAsState(shiftBase)
                );
                const grid = setDays(shiftsStates);
                setShiftGrid(grid);
            });
    }, [searchDates, jobPositionId, setDays]);

    return (
        <div className={styles.calendar}>
            <div className={styles.daysWrapper}>
                {shiftGrid.map((shiftGrid, i) => (
                    <Day
                        key={i}
                        day={shiftGrid.date}
                        shift={shiftGrid.shift}
                        jobPositionId={jobPositionId}
                    />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
