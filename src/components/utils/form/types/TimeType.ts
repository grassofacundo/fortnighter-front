import { input } from "./FormTypes";
import { inputNumber } from "./InputNumberTypes";

export interface inputTimeType extends input {
    hour: inputNumber;
    minute: inputNumber;
    meridian?: {
        isAm: boolean;
    };
    defaultValue?: string;
}

export type meridianValues = "AM" | "PM";
export type timeSelectProps = {
    isAm: boolean;
    onMeridiemChange(meridian: meridianValues): void;
};

export type timeStructure = `${hourStr}:${minuteStr}-${meridianValues}`;
export type minuteNum = 0 | 30;
export type minuteStr = `${minuteNum}`;
export type hourStr = `${hourNum}`;
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
