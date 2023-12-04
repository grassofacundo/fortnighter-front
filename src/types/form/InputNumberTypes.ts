export interface inputNumber extends input {
    placeholder: string;
    min?: number;
    max?: number;
    maxLength?: number;
    defaultValue?: string;
    step?: `${number}` | `${number}.${number}`;
}
