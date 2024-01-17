//#region Dependency list
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Shift } from "../../../../classes/Shift";
import { Job } from "../../../../classes/JobPosition";
import { paymentInfoType } from "../../../../types/job/Shift";
import { workDayType } from "../../../../types/job/Position";
import shiftService from "../../../../services/shiftService";
import style from "./ShiftSummary.module.scss";
import Chart from "./chart/Chart";
import InfoSection from "./chart/InfoSection/InfoSection";
//#endregion

type thisProps = {
    shift: Shift;
    job: Job;
    id: string;
    onEnd(shift: Shift): void;
};
export type timelines = "regular" | "overtime" | "overwork";

const ShiftSummary: FunctionComponent<thisProps> = ({
    shift,
    job,
    id,
    onEnd,
}) => {
    const handleDefaultTypeDay = useCallback(
        (shiftTypeDay: workDayType): workDayType => {
            const jobDay = job.hourPrice?.[shiftTypeDay];
            return jobDay?.regular ? shiftTypeDay : "week";
        },
        [job]
    );
    const getInfo = useCallback(
        (day: workDayType): paymentInfoType => {
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
                    shift.forcedTotal ??
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    async function resetForceTotal() {
        setLoading(true);

        const shiftCopy = structuredClone(shift);
        const updatedShift = new Shift(shiftCopy);
        updatedShift.forcedTotal = undefined;

        const response = await updatedShift.save();

        if (response.ok) {
            setError("");
            onEnd(updatedShift);
        }

        setLoading(false);

        if (!response.ok && response.error) {
            setError(response.error.message);
            return;
        }
    }

    useEffect(() => {
        const shiftTypeDay = shift.getTypeDay();
        const validTypeDay = handleDefaultTypeDay(shiftTypeDay);
        const typeDay = getInfo(validTypeDay);
        setPayInfo(typeDay);
    }, [getInfo, handleDefaultTypeDay, shift]);

    return (
        <div className={style.shiftSummaryBody}>
            {!shift.forcedTotal ? (
                <Chart
                    payInfo={payInfo}
                    typeDay={handleDefaultTypeDay(shift.getTypeDay())}
                    shift={shift}
                    id={id}
                    onEnd={onEnd}
                />
            ) : (
                <>
                    <InfoSection
                        total={shift.forcedTotal}
                        totalIsForced={true}
                    />
                    <p className={style.showPriceText}>
                        You can stop forcing the value by clicking{" "}
                        <button disabled={loading} onClick={resetForceTotal}>
                            here
                        </button>{" "}
                        and get back to calculate the total dynamically.
                    </p>
                    {error && <p>{error}</p>}
                </>
            )}
        </div>
    );
};

export default ShiftSummary;
