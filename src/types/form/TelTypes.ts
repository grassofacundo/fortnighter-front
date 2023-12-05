import { input } from "./FormTypes";

export interface tel extends input {
    placeholder: string;
    maxLength: number;
    min: number;
    max: number;
}
