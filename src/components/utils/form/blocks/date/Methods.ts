import { dateParts, dayNum, dayStr, monthNum, monthStr, year } from "./Types";

export function getDateAsInputValue(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${date.getFullYear()}-${month > 9 ? month : `0${month}`}-${
        day > 9 ? day : `0${day}`
    }`; //T00:00
}

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

export function isValid(date: Date): boolean {
    return date.toString() !== "Invalid Date";
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
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31;
        case 3:
        case 5:
        case 8:
        case 10:
            return 30;
        default:
            return 30;
    }
}

export function isLeapYear(yearParam: year): boolean {
    const year = Number(yearParam);
    return (0 === year % 4 && 0 !== year % 100) || 0 === year % 400;
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
        const nextMonth = "01" as monthStr;
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
        const lastMonth = "12" as monthStr;
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
