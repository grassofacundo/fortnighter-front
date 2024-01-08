import {
    hourNumPlusZero,
    hourStr,
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

export function getTime(time: timeStructure): `${hourStr}:${minuteStr}` {
    const hour = getHourString(time);
    const minute = getMinutesString(time);
    return `${hour}:${minute}`;
}
