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
type modifierRes = { modifier: Modifier; amount: number };

export function modificationByShift(
    modifier: Modifier,
    shiftsNum: number,
    total: number
): number {
    if (!modifier.byShift) return 0;

    const forEvery = modifier.byShift.forEvery;
    let taxableAmount = 0;
    for (let i = 0; i < shiftsNum; i = i + forEvery) {
        const a = modifier.amount;
        const taxAmount = a.isFixed ? a.amount : (100 * a.amount) / total;
        taxableAmount += taxAmount * (a.increase ? +1 : -1);
    }
    return taxableAmount;
}
export function applyByShiftModifiers(
    job: Job,
    shiftsNum: number,
    total: number
): modifierRes[] {
    const response: modifierRes[] = [];
    job.modifiers
        .filter((m) => !!m.byShift?.forEvery)
        .forEach((m) => {
            const responseObject: modifierRes = {
                modifier: m,
                amount: modificationByShift(m, shiftsNum, total),
            };
            response.push(responseObject);
        });

    return response;
}

function modificationByAmount(modifier: Modifier, total: number): number {
    //-1 means the amount didn't meet the criteria and the modifier was not applied
    if (!modifier.byAmount) return -1;

    const byA = modifier.byAmount;
    const a = modifier.amount;

    if (
        (byA.moreThan && total > byA.amount) ||
        (byA.lessThan && total < byA.amount)
    ) {
        const taxAmount = a.isFixed ? a.amount : (a.amount * total) / 100;
        return taxAmount * (a.increase ? +1 : -1);
    } else {
        return -1;
    }
}
export function getDailyAmount(shift: Shift, job: Job): number {
    const hp = job.hourPrice?.[shift.getTypeDay()];
    const hasInfo = hp && hp.regular && hp.overtime && hp.overwork;
    const dayType = hasInfo ? shift.getTypeDay() : "week";
    const hourPrice = job.hourPrice[dayType];

    if (
        !hourPrice ||
        !hourPrice.regular ||
        !hourPrice.overtime ||
        !hourPrice.overwork
    )
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

    const dailyTotalGross =
        shift.forcedTotal ??
        regular.hours * regular.price +
            overtime.hours * overtime.price +
            overwork.hours * overwork.price;

    return dailyTotalGross;
}
export function applyByDailyAmountModifiers(
    job: Job,
    shifts: Shift[]
): modifierRes[] {
    const response: modifierRes[] = [];

    shifts.forEach((shift) => {
        const dailyAmount = getDailyAmount(shift, job);
        job.modifiers
            .filter((m) => m.byAmount?.daily)
            .forEach((m) => {
                const amount = modificationByAmount(m, dailyAmount);
                if (amount !== -1) {
                    const responseObject: modifierRes = {
                        modifier: m,
                        amount: modificationByAmount(m, dailyAmount),
                    };
                    response.push(responseObject);
                }
            });
    });

    return response;
}
export function applyByTotalAmountModifiers(
    job: Job,
    total: number
): modifierRes[] {
    const response: modifierRes[] = [];

    job.modifiers
        .filter((m) => m.byAmount?.total)
        .forEach((m) => {
            const amount = modificationByAmount(m, total);
            if (amount !== -1) {
                const responseObject: modifierRes = {
                    modifier: m,
                    amount: modificationByAmount(m, total),
                };
                response.push(responseObject);
            }
        });

    return response;
}

export function modificationByPayment(
    modifier: Modifier,
    total: number
): number {
    let taxableAmount = 0;
    const a = modifier.amount;
    const taxAmount = a.isFixed ? a.amount : (a.amount * total) / 100;
    taxableAmount += taxAmount * (a.increase ? +1 : -1);
    return taxableAmount;
}
export function applyByPaymentModifiers(
    job: Job,
    total: number
): modifierRes[] {
    const response: modifierRes[] = [];

    job.modifiers
        .filter((m) => m.byPayment?.isByPayment)
        .forEach((m) => {
            const responseObject: modifierRes = {
                modifier: m,
                amount: modificationByPayment(m, total),
            };
            response.push(responseObject);
        });

    return response;
}

export function getGrossTotal(shiftList: Shift[], job: Job): number {
    let totalGross = 0;
    shiftList.forEach((shift) => (totalGross += getDailyAmount(shift, job)));
    return totalGross;
}

export function getNetTotal(shiftList: Shift[], job: Job): number {
    const totalGross = getGrossTotal(shiftList, job);
    let netPay = totalGross;
    /*
     * Modifiers after daily amount
     */
    applyByDailyAmountModifiers(job, shiftList).forEach(
        (res) => (netPay += res.amount)
    );
    /*
     * Modifiers after shifts count
     */
    applyByShiftModifiers(job, shiftList.length, totalGross).forEach(
        (res) => (netPay += res.amount)
    );

    /*
     * Modifiers by total amount
     */
    applyByTotalAmountModifiers(job, totalGross).forEach(
        (res) => (netPay += res.amount)
    );
    /*
     * Modifiers by payment
     */
    applyByPaymentModifiers(job, totalGross).forEach(
        (res) => (netPay += res.amount)
    );

    return netPay;
}
