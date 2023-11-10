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

export interface modelJobPosition {
    _id: string;
    name: string;
    hourPrice: number;
    cycleEnd: Date;
    isFortnightly: boolean;
    companyName: string;
    description: string;
    address: string;
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

export interface shift {
    date: Date;
    timeWorked: number;
    isSaturday: boolean;
    isSunday: boolean;
    isHoliday: boolean;
    hoursWorked: { from: number; to: number };
}
