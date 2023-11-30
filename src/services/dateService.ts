export function getToday(): Date {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}

export function getPastDate(daysInThePast: number, referenceDate?: Date): Date {
    const pastDate = structuredClone(referenceDate) ?? getToday();
    pastDate.setDate(pastDate.getDate() - daysInThePast);
    return pastDate;
}

export function getFutureDate(
    daysInTheFuture: number,
    referenceDate?: Date
): Date {
    const futureDate = structuredClone(referenceDate) ?? getToday();
    futureDate.setDate(futureDate.getDate() + daysInTheFuture);
    return futureDate;
}

export function getStringDMY(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function getDateAsInputValue(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${date.getFullYear()}-${month > 9 ? month : `0${month}`}-${
        day > 9 ? day : `0${day}`
    }`; //T00:00
}

export function setHour(date: Date, startTimeHour: number): Date {
    const startTime = new Date(date);
    startTime.setHours(startTimeHour);
    return startTime;
}

export function getDaysBetweenDates(startDate: Date, endDate: Date): number {
    const timeDifference = endDate.getTime() - startDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.round(daysDifference);
}
