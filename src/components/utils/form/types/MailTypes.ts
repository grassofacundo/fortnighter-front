import { input } from "./FormTypes";

export interface mail extends input {
    placeholder: string;
    min: number;
    max: number;
    defaultValue?: string;
}
