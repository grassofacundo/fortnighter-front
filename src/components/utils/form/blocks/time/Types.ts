import { input } from "../../FormTypes";
import { inputNumber } from "../number/Types";

export interface inputTimeType extends input {
    hour: inputNumber;
    minute: inputNumber;
    meridian?: {
        isAm: boolean;
    };
    defaultValue?: string | Date;
}

export type meridianValues = "AM" | "PM";
export type timeSelectProps = {
    isAm: boolean;
    onMeridiemChange(meridian: meridianValues): void;
};

export type time12 = `${hourStr12}:${minuteStr}`;
export type time24 = `${hourStr24}:${minuteStr}`;
export type time12Meridian = `${time12}-${meridianValues}`;
export type minuteNum = 0 | 30;
export type minuteStr = "00" | "30";
export type hourStr12 =
    | "00"
    | "01"
    | "02"
    | "03"
    | "04"
    | "05"
    | "06"
    | "07"
    | "08"
    | "09"
    | "10"
    | "11"
    | "12";
export type hourStr24 =
    | "00"
    | "01"
    | "02"
    | "03"
    | "04"
    | "05"
    | "06"
    | "07"
    | "08"
    | "09"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16"
    | "17"
    | "18"
    | "19"
    | "20"
    | "21"
    | "22"
    | "23";
export type hourNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type hourNumPlusZero =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12;
