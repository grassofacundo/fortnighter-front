export interface jobPosition {
    id: string;
    name: string;
    hourPrice: number;
    cycleEnd: Date;
    isFortnightly: boolean;
    companyName?: string;
    description?: string;
    address?: string;
}

export interface newJobPosition {
    name: string;
    hourPrice: number;
    cycleEnd: Date;
    isFortnightly: boolean;
    companyName?: string;
    description?: string;
    address?: string;
}
