import { input } from "./FormTypes";

type radioElem = {
    id: string;
    name: string;
    value: string;
    label: string;
};

export interface radio extends input {
    title: string;
    radioElem: radioElem[];
}
