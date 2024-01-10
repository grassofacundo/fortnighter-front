import {
    hourNumPlusZero,
    hourStr,
    hourStr24,
    meridianValues,
    minuteNum,
    minuteStr,
    timeStructure,
} from "../../../types/TimeType";

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

export function getDefaultMeridian(
    defaultValue: string | undefined,
    meridian:
        | {
              isAm: boolean;
          }
        | undefined
): meridianValues {
    if (defaultValue) {
        return defaultValue.indexOf("AM") > -1 ? "AM" : "PM";
    } else {
        return meridian?.isAm ? "AM" : "PM";
    }
}

export function getHourNumber(time: timeStructure): hourNumPlusZero {
    const splitTime = time.split(":");
    const hourStr = splitTime[0] as hourStr;
    let hourNum = 0 as hourNumPlusZero;
    if (hourStr === "12" && getMeridian(time) === "AM") return hourNum;
    try {
        hourNum = Number(hourStr) as hourNumPlusZero;
    } catch (error) {
        console.log("Error parsing hour");
        console.log(error);
    }
    return hourNum;
}

export function getHourString(time: timeStructure): hourStr {
    const splitTime = time.split(":");
    const hourStr = splitTime[0] as hourStr;
    return hourStr;
}

export function getMinutesNumber(time: timeStructure): minuteNum {
    let minuteNum = 0;
    try {
        const minuteStr = time.split(":")[1].split("-")[0];
        minuteNum = Number(minuteStr);
    } catch (error) {
        console.log("Error parsing minute");
        console.log(error);
    }
    return minuteNum as minuteNum;
}

export function getMinutesString(time: timeStructure): minuteStr {
    let minuteStr = "00" as minuteStr;
    try {
        minuteStr = time.split(":")[1].split("-")[0] as minuteStr;
    } catch (error) {
        console.log("Error parsing minute");
        console.log(error);
    }
    return minuteStr;
}

export function getMeridian(time: timeStructure): meridianValues {
    let meridian = "";
    try {
        meridian = time.split(":")[1].split("-")[1];
    } catch (error) {
        console.log("Error parsing meridian");
        console.log(error);
    }
    return meridian as meridianValues;
}

export function getAs24Format(time: timeStructure): number {
    const hour = getHourNumber(time);
    const minutes = getMinutesNumber(time);
    const hourAndMinutes = hour + (minutes === 30 ? 0.5 : 0);
    const meridian = getMeridian(time);
    return meridian === "PM" ? hourAndMinutes + 12 : hourAndMinutes;
}

export function getTime(
    time: timeStructure,
    as24Format = false
): `${hourStr}:${minuteStr}` | `${hourStr24}:${minuteStr}` {
    const hourStr = getHourString(time);
    const hourNum = getHourNumber(time);
    const minute = getMinutesString(time);
    const meridian = getMeridian(time);
    const hourVal = as24Format
        ? (`${meridian === "PM" ? hourNum + 12 : hourStr}` as hourStr24)
        : hourStr;
    return `${hourVal}:${minute}`;
}

export function dateAsTimeStructure(date: Date): timeStructure {
    const hourNum = date.getHours();
    const meridian = hourNum > 12 ? "PM" : "AM";
    const isPm = meridian === "PM";
    const hour =
        `${hourNum}`.length === 1
            ? (`0${hourNum}` as hourStr)
            : (`${isPm ? hourNum - 12 : hourNum}` as hourStr);
    const minutesNum = date.getMinutes();
    const minutes =
        minutesNum === 30 || minutesNum === 0
            ? `${minutesNum}`
            : minutesNum > 15
            ? "30"
            : "00";
    return `${hour}:${minutes}-${meridian}` as timeStructure;
}
