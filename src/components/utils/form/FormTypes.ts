import { checkbox } from "./blocks/checkbox/Types";
import { dateInput } from "./blocks/date/Types";
import { inputNumber } from "./blocks/number/Types";
import { mail } from "./blocks/mail/Types";
import { password } from "./blocks/password/Types";
import { radio } from "./blocks/radio/Types";
import { tel } from "./blocks/tel/Types";
import { text } from "./blocks/text/Types";
import { inputTimeType } from "./blocks/time/Types";

export type inputType =
    | "radio"
    | "text"
    | "password"
    | "number"
    | "mail"
    | "tel"
    | "customDate"
    | "checkbox"
    | "time";

export type inputValues = string | Date | boolean | number;
export interface inputBase {
    type: inputType;
    id: string;
    isOptional?: boolean;
    defaultValue?: inputValues;
    customClass?: CSSModuleClasses[string];
}

export interface input extends inputBase {
    label?: string;
}

export type inputField =
    | dateInput
    | radio
    | text
    | password
    | inputNumber
    | mail
    | tel
    | checkbox
    | inputTimeType;

export type formAnswersType = {
    id: string;
    value: inputValues;
    error?: string;
};

export type parsedAnswers = {
    [answerId: string]: inputValues;
};

export type actionType = "added" | "changed" | "deleted";

export type action = {
    type: actionType;
    id: string;
    value?: inputValues;
    error?: string;
};

export type error = {
    message: string;
    field: HTMLElement | null;
};

export interface inputProp {
    formAnswers: formAnswersType[];
    onUpdateAnswer: (answer: formAnswersType) => void;
}
