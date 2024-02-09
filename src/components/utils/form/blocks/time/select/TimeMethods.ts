import {
    hourNumPlusZero,
    hourStr12,
    hourStr24,
    meridianValues,
    minuteNum,
    minuteStr,
    time12,
    time12Meridian,
    time24,
} from "../Types";

export function getDefaultHourValue(defaultValue: string | undefined) {
    if (!defaultValue || typeof defaultValue !== "string") return;
    const splitTime = defaultValue.split(":");
    return splitTime[0].length === 1 ? `0${splitTime[0]}` : splitTime[0];
}

export function getDefaultMinuteValue(defaultValue: string | undefined) {
    if (!defaultValue || typeof defaultValue !== "string") return;
    let splitTime = defaultValue.split(":");
    splitTime = splitTime[1].split("-");
    return splitTime[0].length === 1 ? `0${splitTime[0]}` : splitTime[0];
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

export function getHourNumber(time: time12Meridian): hourNumPlusZero {
    const splitTime = time.split(":");
    const hourStr = splitTime[0] as hourStr12;
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

export function getHourString(time: time12Meridian): hourStr12 {
    const splitTime = time.split(":");
    const hourStr = splitTime[0] as hourStr12;
    return hourStr;
}

export function getMinutesNumber(time: time12Meridian): minuteNum {
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

export function getMinutesString(time: time12Meridian): minuteStr {
    let minuteStr = "00" as minuteStr;
    try {
        minuteStr = time.split(":")[1].split("-")[0] as minuteStr;
    } catch (error) {
        console.log("Error parsing minute");
        console.log(error);
    }
    return minuteStr;
}

export function getMeridian(time: time12Meridian): meridianValues {
    let meridian = "";
    try {
        meridian = time.split(":")[1].split("-")[1];
    } catch (error) {
        console.log("Error parsing meridian");
        console.log(error);
    }
    return meridian as meridianValues;
}

export function getAs24Format(time: time12Meridian): number {
    const hour = getHourNumber(time);
    const minutes = getMinutesNumber(time);
    const hourAndMinutes = hour + (minutes === 30 ? 0.5 : 0);
    const meridian = getMeridian(time);
    return meridian === "PM" ? hourAndMinutes + 12 : hourAndMinutes;
}

export function getTime12(time: time12Meridian): time12 {
    const hourStr = getHourString(time) as hourStr12;
    const minute =
        getMinutesString(time).length === 1
            ? (`0${getMinutesString(time)}` as minuteStr)
            : getMinutesString(time);
    return `${hourStr}:${minute}`;
}

export function getTime24(time: time12Meridian): time24 {
    const hourStr = getHourString(time);
    const hourNum = getHourNumber(time);
    const minute =
        getMinutesString(time).length === 1
            ? (`0${getMinutesString(time)}` as minuteStr)
            : getMinutesString(time);
    const meridian = getMeridian(time);
    const hourVal = `${
        meridian === "PM" ? hourNum + 12 : hourStr
    }` as hourStr24;
    return `${
        hourVal.length === 1 ? `0${hourVal}` : hourVal
    }:${minute}` as time24;
}

export function dateAsTimeStructure(date: Date): time12Meridian {
    const hourNum = date.getHours();
    const meridian = hourNum > 12 ? "PM" : "AM";
    const isPm = meridian === "PM";
    const hour =
        `${hourNum}`.length === 1
            ? (`0${hourNum}` as hourStr12)
            : (`${isPm ? hourNum - 12 : hourNum}` as hourStr12);
    const minutesNum = date.getMinutes();
    const minutes =
        minutesNum === 30 || minutesNum === 0
            ? `${minutesNum}`
            : minutesNum > 15
            ? "30"
            : "00";
    return `${hour}:${minutes}-${meridian}` as time12Meridian;
}
