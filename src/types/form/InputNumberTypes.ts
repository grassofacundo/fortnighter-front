import { input } from "./FormTypes";

export interface inputNumber extends input {
    placeholder: string;
    step?: `${number}` | `${number}.${number}`;
    min?: number;
    max?: number;
    maxLength?: number;
    defaultValue?: string;
}
