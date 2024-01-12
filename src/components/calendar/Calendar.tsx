//#region Dependency list
import {
    useState,
    FunctionComponent,
    useEffect,
    useCallback,
    Dispatch,
    SetStateAction,
} from "react";
import {
    datesAreEqual,
    getDaysBetweenDates,
    getPastDate,
    getPlainDate,
    parseDateAsId,
} from "../../services/dateService";
import Workday from "./Workday/Workday";
import styles from "./Calendar.module.scss";
import { Shift } from "../../classes/Shift";
//#endregion

type thisProps = {
    endDate: Date;
    startDate: Date;
    shiftList: Shift[];
    onSetShiftList: Dispatch<SetStateAction<Shift[]>>;
};

type shiftGrid = {
    date: Date;
    shift?: Shift;
}[];

const Calendar: FunctionComponent<thisProps> = ({
    endDate,
    startDate,
    shiftList,
    onSetShiftList,
}) => {
    const [shiftGrid, setShiftGrid] = useState<shiftGrid>([]);

    const setDays = useCallback(
        (shifts: Shift[]): shiftGrid => {
            let localEndDate: Date = structuredClone(endDate);
            const localStartDate: Date = structuredClone(startDate);

            const daysNum =
                getDaysBetweenDates(localStartDate, localEndDate) + 1; //Necessary offset apparently.
            //I think when JS calculates the past date, it starts subtracting from the day before.
            //meaning there is an implicit -1 there.
            const days: shiftGrid = Array(daysNum);
            for (let i = daysNum; i > 0; i--) {
                const index = shifts.findIndex((shift) =>
                    datesAreEqual(shift.start, getPlainDate(localEndDate))
                );

                days[i - 1] =
                    index > -1
                        ? { date: localEndDate, shift: shifts[index] }
                        : { date: localEndDate };
                localEndDate = getPastDate(1, localEndDate);
            }
            return days.reverse();
        },
        [endDate, startDate]
    );

    function updateShift(updatedShift: Shift): void {
        const shiftIndex = shiftList.findIndex((shift) =>
            datesAreEqual(shift.start, updatedShift.start)
        );
        if (shiftIndex < 0)
            throw new Error("Shift date is not included on loaded shifts");

        const shifts = structuredClone(shiftList);
        shifts[shiftIndex] = updatedShift;
        onSetShiftList(shifts);
    }

    function createShift(createdShift: Shift): void {
        const shifts = structuredClone(shiftList);
        shifts.push(createdShift);
        onSetShiftList(shifts);
    }

    useEffect(() => {
        const gridToSave = setDays(shiftList);
        setShiftGrid(gridToSave);
    }, [setDays, shiftList]);

    return (
        <div className={styles.calendar}>
            <div className={styles.daysWrapperAnimation}>
                <div className={styles.daysWrapper}>
                    {shiftGrid.map((shift) => (
                        <Workday
                            key={parseDateAsId(shift.date)}
                            day={shift.date}
                            shift={shift.shift}
                            onUpdateShift={updateShift}
                            onCreateShift={createShift}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;

/*

*/
