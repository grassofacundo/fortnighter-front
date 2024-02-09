import { formAnswersType, input } from "../../FormTypes";

export interface inputSelectType extends input {
    options: option[];
    isMulti?: boolean;
    isSearchable?: boolean;
    onUpdateAnswer: (answer: formAnswersType) => void;
    //customClass?: CSSModuleClasses[string];
}

export type option = { label: string; value: string; selected?: boolean };
