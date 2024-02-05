import { Job } from "../classes/job/JobPosition";
import { Modifier } from "../classes/modifier/Modifier";
import { Shift } from "../classes/shift/Shift";
import shiftService from "./shiftService";

export function getSaturdays(shiftList: Shift[]): number {
    const saturdays = shiftList.filter((shift) => shift.startsOnSaturday());
    return saturdays.length;
}

export function getSundays(shiftList: Shift[]): number {
    const sundays = shiftList.filter((shift) => shift.startsOnSunday());
    return sundays.length;
}

function applyModifierByShift(
    modifier: Modifier,
    shiftList: Shift[],
    total: number
): number {
    if (!modifier.byShift) return total;

    const forEvery = modifier.byShift.forEvery;
    const totalBackUp = total;
    for (let i = 0; i < shiftList.length; i = i + forEvery) {
        const a = modifier.amount;
        const taxAmount = a.isFixed ? a.amount : (100 * a.amount) / totalBackUp;
        total = total + taxAmount * (a.increase ? +1 : -1);
    }
    return total;
}

function applyDailyModifier(modifier: Modifier, dailyTotal: number): number {
    if (!modifier.byAmount) return dailyTotal;

    const byA = modifier.byAmount;
    const a = modifier.amount;
    const dailyTotalBackUp = dailyTotal;
    const taxAmount = a.isFixed
        ? a.amount
        : (100 * a.amount) / dailyTotalBackUp;
    if (
        (byA.moreThan && dailyTotal > byA.amount) ||
        (byA.lessThan && dailyTotal < byA.amount)
    ) {
        return dailyTotal + taxAmount * (a.increase ? +1 : -1);
    } else {
        return dailyTotal;
    }
}

export function getTotal(
    shiftList: Shift[],
    job: Job,
    startDate: Date,
    endDate: Date
): number {
    let total = 0;
    shiftList.forEach((shift) => {
        if (shift.start >= startDate && shift.end <= endDate) {
            const jobHourPrice = job.hourPrice?.[shift.getTypeDay()];
            const dayType = jobHourPrice?.regular ? shift.getTypeDay() : "week";
            const hourPrice = job.hourPrice[dayType];

            if (!hourPrice || !hourPrice.overtime || !hourPrice.overwork)
                return 0;

            const regular = {
                price: hourPrice.regular,
                hours: shiftService.getRegularWorkedHours(shift, job, dayType),
            };
            const overtime = {
                price: hourPrice.overtime,
                hours: shiftService.getOvertimeWorkedHours(shift, job, dayType),
            };
            const overwork = {
                price: hourPrice.overwork,
                hours: shiftService.getOverworkedHours(shift, job, dayType),
            };

            let dailyTotal =
                shift.forcedTotal ??
                regular.hours * regular.price +
                    overtime.hours * overtime.price +
                    overwork.hours * overwork.price;

            const dailyModifiers = job.modifiers.filter(
                (m) => m.byAmount?.daily
            );
            if (dailyModifiers.length > 0)
                dailyModifiers.forEach(
                    (m) => (dailyTotal = applyDailyModifier(m, dailyTotal))
                );
            total += dailyTotal;
        }

        const byShiftModifiers = job.modifiers.filter(
            (m) => !!m.byShift?.forEvery
        );
        if (byShiftModifiers.length > 0)
            byShiftModifiers.forEach(
                (m) => (total = applyModifierByShift(m, shiftList, total))
            );
    });
    return total;
}
