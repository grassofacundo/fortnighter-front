import { input } from "./FormTypes";
import { inputNumber } from "./InputNumberTypes";

export interface inputTimeType extends input {
    hour: inputNumber;
    minute: inputNumber;
    isAm: boolean;
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
export type hourNum =
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
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23;
