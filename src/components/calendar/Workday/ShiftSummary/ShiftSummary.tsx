//#region Dependency list
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Shift } from "../../../../classes/Shift";
import { Job } from "../../../../classes/JobPosition";
import { paymentInfoType } from "../../../../types/job/Shift";
import { workDayType } from "../../../../types/job/Position";
import shiftService from "../../../../services/shiftService";
import style from "./ShiftSummary.module.scss";
import Chart from "./chart/Chart";
//#endregion

type thisProps = {
    shift: Shift;
    job: Job;
};
export type timelines = "regular" | "overtime" | "overwork";

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
            const r = {
                price: jobDay?.regular ?? 0,
                hours: shiftService.getRegularWorkedHours(shift, job, day),
            };
            const ot = {
                price: jobDay?.overtime ?? 0,
                hours: shiftService.getOvertimeWorkedHours(shift, job, day),
            };
            const ow = {
                price: jobDay?.overwork ?? 0,
                hours: shiftService.getOverworkedHours(shift, job, day),
            };

            return {
                payInfo: {
                    regular: r,
                    overtime: ot,
                    overwork: ow,
                },
                total:
                    r.hours * r.price +
                    ot.hours * ot.price +
                    ow.hours * ow.price,
            };
        },
        [job, shift]
    );

    const [payInfo, setPayInfo] = useState<paymentInfoType>(
        getInfo(handleDefaultTypeDay(shift.getTypeDay()))
    );

    useEffect(() => {
        const shiftTypeDay = shift.getTypeDay();
        const validTypeDay = handleDefaultTypeDay(shiftTypeDay);
        const typeDay = getInfo(validTypeDay);
        setPayInfo(typeDay);
    }, [getInfo, handleDefaultTypeDay, shift]);

    return (
        <div className={style.shiftSummaryBody}>
            <Chart
                payInfo={payInfo}
                typeDay={handleDefaultTypeDay(shift.getTypeDay())}
                shift={shift}
            />
        </div>
    );
};

export default ShiftSummary;
