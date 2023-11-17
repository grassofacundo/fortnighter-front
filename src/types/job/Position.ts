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

export interface shiftBase {
    jobPositionId: string;
    isHoliday: boolean;
    startTime: Date;
    endTime: Date;
}

export interface shiftState extends shiftBase {
    date: Date;
    hoursWorked: number;
    isSaturday: boolean;
    isSunday: boolean;
}
