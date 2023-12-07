import { input } from "./FormTypes";

export interface password extends input {
    placeholder: string;
    defaultValue?: string;
}
