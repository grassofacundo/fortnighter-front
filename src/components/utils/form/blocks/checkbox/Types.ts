import { input } from "../../FormTypes";

export interface checkbox extends input {
    checked?: boolean;
    defaultValue: boolean;
}
