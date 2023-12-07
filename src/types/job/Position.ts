export interface baseJobPosition<T> {
    name: string;
    hourPrice: number;
    isFortnightly: boolean;
    companyName?: string;
    description?: string;
    address?: string;
    cycleEnd: T;
}

export interface jobPosition extends baseJobPosition<Date> {
    id: string;
}

export interface dbJobPosition extends baseJobPosition<string> {
    id: string;
}
