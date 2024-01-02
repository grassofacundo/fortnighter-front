import { hourStr, timeStructure } from "../../../types/TimeType";

export function getDefaultHourValue(defaultValue: string | undefined) {
    if (!defaultValue || typeof defaultValue !== "string") return;
    const splitTime = defaultValue.split(":");
    return splitTime[0];
}

export function getDefaultMinuteValue(defaultValue: string | undefined) {
    if (!defaultValue || typeof defaultValue !== "string") return;
    let splitTime = defaultValue.split(":");
    splitTime = splitTime[1].split("-");
    return splitTime[0];
}

export function getMeridian(
    defaultValue: string | undefined,
    meridian:
        | {
              isAm: boolean;
          }
        | undefined
): "AM" | "PM" {
    if (defaultValue) {
        return defaultValue.indexOf("AM") > -1 ? "AM" : "PM";
    } else {
        return meridian?.isAm ? "AM" : "PM";
    }
}

export function getHour(time: timeStructure): string | number {
    const splitTime = time.split(":");
    const hourStr = splitTime[0] as hourStr;
    let hourNum = 0;
    try {
        hourNum = Number(hourStr);
    } catch (error) {
        console.log("Error parsing hour");
        console.log(error);
    }
    return hourNum;
}
