//#region Dependency list
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Shift } from "../../../../classes/Shift";
import { Job } from "../../../../classes/JobPosition";
import { paymentInfoType } from "../../../../types/job/Shift";
import { workDayType } from "../../../../types/job/Position";
import shiftService from "../../../../services/shiftService";
import style from "./ShiftSummary.module.scss";
//#endregion

type thisProps = {
    shift: Shift;
    job: Job;
};

const ShiftSummary: FunctionComponent<thisProps> = ({ shift, job }) => {
    const handleDefaultTypeDay = useCallback(
        (shiftTypeDay: workDayType): workDayType => {
            const jobDay = job.hourPrice?.[shiftTypeDay];
            return jobDay?.regular ? shiftTypeDay : "week";
        },
        [job]
    );

    const getInfo = useCallback(
        (day: workDayType): paymentInfoType => {
            const shiftDay = shift?.paymentInfo?.[day];
            if (shiftDay) return shiftDay;

            const jobDay = job.hourPrice?.[day];

            return {
                regular: {
                    price: jobDay?.regular ?? 0,
                    hours: shiftService.getRegularWorkedHours(shift, job, day),
                },
                overtime: {
                    price: jobDay?.overtime ?? 0,
                    hours: shiftService.getOvertimeWorkedHours(shift, job, day),
                },
                overwork: {
                    price: jobDay?.overwork ?? 0,
                    hours: shiftService.getOverworkedHours(shift, job, day),
                },
            };
        },
        [job, shift]
    );

    const [payInfo, setPayInfo] = useState<paymentInfoType>(
        getInfo(handleDefaultTypeDay(shift.getTypeDay()))
    );
    const [infoNotSet, setInfoNotSet] = useState<boolean>(
        handleDefaultTypeDay(shift.getTypeDay()) !== shift.getTypeDay()
    );

    function hoursAsArray(hours: number): null[] {
        const hoursArr = [];
        for (let i = 0; i < hours; i++) {
            hoursArr.push(null);
        }
        return hoursArr;
    }

    useEffect(() => {
        const shiftTypeDay = shift.getTypeDay();
        const validTypeDay = handleDefaultTypeDay(shiftTypeDay);
        const typeDay = getInfo(validTypeDay);
        setPayInfo(typeDay);
        setInfoNotSet(validTypeDay !== shiftTypeDay);
    }, [getInfo, handleDefaultTypeDay, shift]);

    return (
        <div className={style.shiftSummaryBody}>
            {infoNotSet && (
                <p>{`Using "week" info, since "${shift.getTypeDay()}" work time and hour price is not set in job information`}</p>
            )}
            {
                <div className={style.timeline}>
                    {payInfo.regular?.hours &&
                        hoursAsArray(payInfo.regular.hours).map((h, i) => (
                            <div
                                className={`${style.regular} ${style.timestamp}`}
                                key={i}
                            ></div>
                        ))}
                    {payInfo.overtime?.hours &&
                        hoursAsArray(payInfo.overtime.hours).map((h, i) => (
                            <div
                                className={`${style.overtime} ${style.timestamp}`}
                                key={i}
                            ></div>
                        ))}
                    {payInfo.overwork?.hours &&
                        hoursAsArray(payInfo.overwork.hours).map((h, i) => (
                            <div
                                className={`${style.overwork} ${style.timestamp}`}
                                key={i}
                            ></div>
                        ))}
                </div>
            }
            {payInfo.regular && payInfo.regular.hours > 0 && (
                <div className={`${style.regular} ${style.infoPayText}`}>
                    <p>{`Worked ${payInfo.regular.hours} regular hours, paid $${payInfo.regular.price} each hour`}</p>
                </div>
            )}
            {payInfo.overtime && payInfo.overtime.hours > 0 && (
                <div className={`${style.overtime} ${style.infoPayText}`}>
                    <p>{`Worked ${payInfo.overtime.hours} overtime hours, paid $${payInfo.overtime.price} each hour`}</p>
                </div>
            )}
            {payInfo.overwork && payInfo.overwork.hours > 0 && (
                <div className={`${style.overwork} ${style.infoPayText}`}>
                    <p>{`Worked ${payInfo.overwork.hours} of overwork hours, paid $${payInfo.overwork.price} each hour`}</p>
                </div>
            )}
        </div>
    );
};

export default ShiftSummary;
