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
    getDaysBetweenDates,
    getPastDate,
    getPlainDate,
    parseDateAsId,
} from "../../services/dateService";
import { dateArray, shiftGrid, shiftState } from "../../types/job/Shift";
import Workday from "./Workday";
//#endregion

type thisProps = {
    endDate: Date;
    startDate: Date;
    shiftList: shiftState[];
    overnightJob: boolean;
    onSetShiftList: Dispatch<SetStateAction<shiftState[]>>;
};

const Calendar: FunctionComponent<thisProps> = ({
    endDate,
    startDate,
    shiftList,
    overnightJob,
    onSetShiftList,
}) => {
    const [shiftGrid, setShiftGrid] = useState<shiftGrid[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const setDays = useCallback(
        (shifts: shiftState[]): shiftGrid[] => {
            let localEndDate: Date = structuredClone(endDate);
            const localStartDate: Date = structuredClone(startDate);

            const daysNum =
                getDaysBetweenDates(localStartDate, localEndDate) + 1; //Necessary offset apparently.
            //I think when JS calculates the past date, it starts subtracting from the day before.
            //meaning there is an implicit +1 there.
            const days: shiftGrid[] = Array(daysNum);
            for (let i = daysNum; i > 0; i--) {
                const index = shifts.findIndex((shift) =>
                    datesAreEqual(shift.startTime, getPlainDate(localEndDate))
                );
                const shift = index > -1 ? shifts[index] : undefined;
                let dateToSave = [localEndDate] as dateArray;
                if (shift && !datesAreEqual(shift.startTime, shift.endTime)) {
                    const start = structuredClone(shift.startTime);
                    const end = structuredClone(shift.endTime);
                    dateToSave = [start, end];
                }
                days[i - 1] = { date: dateToSave, shift };
                localEndDate = getPastDate(1, localEndDate);
            }
            return days.reverse();
        },
        [endDate, startDate]
    );

    function updateShift(updatedShift: shiftState): void {
        const shiftIndex = shiftList.findIndex((shift) =>
            datesAreEqual(shift.startTime, updatedShift.startTime)
        );
        if (shiftIndex < 0)
            throw new Error("Shift date is not included on loaded shifts");

        const shiftListCopy = structuredClone(shiftList);
        shiftListCopy[shiftIndex] = updatedShift;
        onSetShiftList(shiftListCopy);
    }

    function createShift(updatedShift: shiftState): void {
        const shiftListCopy = structuredClone(shiftList);
        shiftListCopy.push(updatedShift);
        onSetShiftList(shiftListCopy);
    }

    useEffect(() => {
        setLoading(true);
        const gridToSave = setDays(shiftList);
        setShiftGrid(gridToSave);
        setLoading(false);
    }, [setDays, shiftList]);

    return (
        <div className={styles.calendar}>
            <div className={styles.daysWrapperAnimation}>
                <div className={styles.daysWrapper}>
                    {shiftGrid.map((shift, i) => (
                        <Workday
                            key={parseDateAsId(shift.date[0])}
                            days={shift.date}
                            shift={shift.shift}
                            onUpdateShift={updateShift}
                            onCreateShift={createShift}
                            order={i}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
