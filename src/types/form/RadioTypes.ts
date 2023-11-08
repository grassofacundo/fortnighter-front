type radioElem = {
    id: string;
    name: string;
    value: string;
    label: string;
};

interface radio extends input {
    title: string;
    radioElem: radioElem[];
}
