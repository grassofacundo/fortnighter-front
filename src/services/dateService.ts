import {
    dateParts,
    dayNum,
    dayStr,
    monthNum,
    monthStr,
    timeParams,
    year,
} from "../types/dateService";

export function setDateFromInput(targetValue: string | dateParts): Date {
    if (typeof targetValue === "string") {
        return new Date(`${targetValue}T00:00`);
    } else {
        const day =
            targetValue.day.length === 1
                ? `0${targetValue.day}`
                : targetValue.day;
        const month =
            targetValue.month.length === 1
                ? `0${targetValue.month}`
                : targetValue.month;
        const year = targetValue.year;
        return new Date(`${year}-${month}-${day}T00:00`);
    }
}

export function getToday(): Date {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}

export function getYesterday(date: Date) {
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    return yesterday;
}

export function getTomorrow(date: Date) {
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    return tomorrow;
}

export function getNextMonth(date: Date): Date {
    const currentDay = date.getDate();
    const currentMonth = date.getMonth(); //Months are index 0
    const currentYear = date.getFullYear();
    const monthPlusOne = currentMonth + 1;
    if (monthPlusOne === 12) {
        const nextYear = (currentYear + 1).toString() as year;
        const nextMonth = "00" as monthStr;
        const newDate = setDateFromInput({
            year: nextYear,
            month: nextMonth,
            day: currentDay.toString() as dayStr,
        });
        return newDate;
    } else {
        const nextMonth = (currentMonth + 1) as monthNum;
        const lastDayOfMonth = getLastDayOfMonth(nextMonth, currentYear);
        const day =
            currentDay > lastDayOfMonth
                ? lastDayOfMonth.toString()
                : currentDay.toString();
        const newDate = setDateFromInput({
            year: currentYear.toString() as year,
            month: nextMonth.toString() as monthStr,
            day: day as dayStr,
        });
        return newDate;
    }
}

export function getLastMonth(date: Date): Date {
    const currentDay = date.getDate();
    const currentMonth = date.getMonth(); //Months are index 0
    const currentYear = date.getFullYear();
    const monthMinusOne = currentMonth - 1;
    if (monthMinusOne === -1) {
        const lastYear = (currentYear - 1).toString() as year;
        const lastMonth = "11" as monthStr;
        const newDate = setDateFromInput({
            year: lastYear.toString() as year,
            month: lastMonth.toString() as monthStr,
            day: currentDay.toString() as dayStr,
        });
        return newDate;
    } else {
        const lastMonth = monthMinusOne.toString() as monthStr;
        const lastDayOfMonth = getLastDayOfMonth(
            monthMinusOne as monthNum,
            currentYear
        );
        const day =
            currentDay > lastDayOfMonth
                ? (lastDayOfMonth.toString() as dayStr)
                : (currentDay.toString() as dayStr);
        const newDate = setDateFromInput({
            year: currentYear.toString() as year,
            month: lastMonth,
            day: day,
        });
        return newDate;
    }
}

export function getLastDayOfMonth(
    month: monthNum,
    year: number | year
): dayNum {
    switch (month) {
        case 0:
            return 31;
        case 1:
            return isLeapYear(year.toString() as year) ? 29 : 28;
        case 2:
            return 31;
        case 3:
            return 30;
        case 4:
            return 31;
        case 5:
            return 30;
        case 6:
            return 31;
        case 7:
            return 31;
        case 8:
            return 30;
        case 9:
            return 31;
        case 10:
            return 30;
        case 11:
            return 31;
        default:
            return 30;
    }
}

export function getPlainDate(date: Date): Date {
    const copyDate = structuredClone(date);
    copyDate.setHours(0);
    copyDate.setMinutes(0);
    copyDate.setSeconds(0);
    return copyDate;
}

export function getPastDate(daysInThePast: number, referenceDate?: Date): Date {
    const pastDate = structuredClone(referenceDate) ?? getToday();
    pastDate.setDate(pastDate.getDate() - daysInThePast);
    return pastDate;
}

export function datesAreEqual(date1: Date, date2: Date): boolean {
    const date1Text = getDateAsInputValue(date1);
    const date2Text = getDateAsInputValue(date2);
    return date1Text === date2Text;
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

export function isLeapYear(yearParam: year): boolean {
    const year = Number(yearParam);
    return (0 === year % 4 && 0 !== year % 100) || 0 === year % 400;
}

export function parseDateAsId(date: Date | string): string {
    const dateToParse = date instanceof Date ? getDateAsInputValue(date) : date;
    const id = dateToParse.replaceAll("-", "");

    return id;
}

export function setTime({ date, hour, minutes }: timeParams): Date {
    const startTime = new Date(date);
    if (hour) startTime.setHours(hour);
    if (minutes) startTime.setMinutes(minutes);
    return startTime;
}

export function setMinutes(date: Date, startTimeMinutes: number): Date {
    const startTime = new Date(date);
    startTime.setMinutes(startTimeMinutes);
    return startTime;
}

export function getDaysBetweenDates(startDate: Date, endDate: Date): number {
    const timeDifference = endDate.getTime() - startDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.round(daysDifference);
}
