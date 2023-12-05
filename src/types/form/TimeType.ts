import { input } from "./FormTypes";
import { inputNumber } from "./InputNumberTypes";

export interface inputTimeType extends input {
    hour: inputNumber;
    minute: inputNumber;
}

// export interface inputNumber extends input {
//     placeholder: string;
//     min?: number;
//     max?: number;
//     maxLength?: number;
//     defaultValue?: string;
//     step?: `${number}` | `${number}.${number}`;
// }
