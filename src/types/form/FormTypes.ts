import { checkbox } from "./CheckboxTypes";
import { dateInput } from "./DateInputTypes";
import { inputNumber } from "./InputNumberTypes";
import { mail } from "./MailTypes";
import { password } from "./PasswordTypes";
import { radio } from "./RadioTypes";
import { tel } from "./TelTypes";
import { text } from "./TextTypes";
import { inputTimeType } from "./TimeType";

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
export type action = {
    type: "added" | "changed" | "deleted";
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

export type formCallback = (answers: formAnswersType[]) => Promise<void>;
