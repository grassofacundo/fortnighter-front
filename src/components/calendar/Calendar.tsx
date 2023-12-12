//#region Dependency list
import {
    useState,
    FunctionComponent,
    useEffect,
    useCallback,
    Dispatch,
    SetStateAction,
} from "react";
import styles from "./Calendar.module.scss";
import {
    datesAreEqual,
    getDateAsInputValue,
    getDaysBetweenDates,
    getPastDate,
    getPlainDate,
} from "../../services/dateService";
import { shiftGrid, shiftState } from "../../types/job/Shift";
import Workday from "./Workday";
//#endregion

type thisProps = {
    endDate: Date;
    distanceBetweenDates: number;
    jobPositionId: string;
    shiftList: shiftState[];
    onSetShiftList: Dispatch<SetStateAction<shiftState[]>>;
};

const Calendar: FunctionComponent<thisProps> = ({
    endDate,
    distanceBetweenDates,
    jobPositionId,
    shiftList,
    onSetShiftList,
}) => {
    const [shiftGrid, setShiftGrid] = useState<shiftGrid[]>([]);

    const setDays = useCallback(
        (shifts: shiftState[]): shiftGrid[] => {
            let localEndDate: Date = structuredClone(endDate);
            const localStartDate: Date = getPastDate(
                distanceBetweenDates,
                localEndDate
            );

            const daysNum =
                getDaysBetweenDates(localStartDate, localEndDate) + 1; //Necessary offset apparently.
            //I think when JS calculates the past date, it starts subtracting from the day before.
            //meaning there is an implicit +1 there.
            const days: shiftGrid[] = Array(daysNum);
            for (let i = daysNum; i > 0; i--) {
                const index = shifts.findIndex((shift) =>
                    datesAreEqual(shift.date, getPlainDate(localEndDate))
                );
                const shift = index > -1 ? shifts[index] : undefined;
                days[i - 1] = { date: localEndDate, shift };
                localEndDate = getPastDate(1, localEndDate);
            }
            return days.reverse();
        },
        [endDate, distanceBetweenDates]
    );

    function updateShift(updatedShift: shiftState): void {
        const shiftIndex = shiftList.findIndex(
            (shift) =>
                getDateAsInputValue(shift.date) ===
                getDateAsInputValue(updatedShift.date)
        );
        if (shiftIndex < 0)
            throw new Error("Shift date is not included on loaded shifts");

        const shiftListCopy = structuredClone(shiftList);
        shiftListCopy[shiftIndex] = updatedShift;
        onSetShiftList(shiftListCopy);
    }

    useEffect(() => {
        const gridToSave = setDays(shiftList);
        setShiftGrid(gridToSave);
    }, [setDays, shiftList]);

    return (
        <div className={styles.calendar}>
            <div className={styles.daysWrapper}>
                {shiftGrid.map((shift, i) => {
                    const day = shift.date;
                    const thisShift = shift.shift;
                    return (
                        <Workday
                            key={i}
                            day={day}
                            shift={thisShift}
                            jobPositionId={jobPositionId}
                            onUpdateShift={updateShift}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
