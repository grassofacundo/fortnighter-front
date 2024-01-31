import { input } from "./FormTypes";

export interface text extends input {
    placeholder?: string;
    min?: number;
    max?: number;
    defaultValue?: string;
}
