import { input } from "./FormTypes";

export interface dateInput extends input {
    defaultValue?: string;
    min?: string;
    max?: string;
}
