interface jobPosition {
    id: string;
    name: string;
    hourPrice: number;
    cycleEnd: Date;
    isFortnightly: boolean;
    companyName?: string;
    description?: string;
    address?: string;
    isSelected: boolean;
}

interface newJobPosition {
    name: string;
    hourPrice: number;
    cycleEnd: Date;
    isFortnightly: boolean;
    companyName?: string;
    description?: string;
    address?: string;
}

interface shift {
    date: Date;
    timeWorked: number;
    isSaturday: boolean;
    isSunday: boolean;
    isHoliday: boolean;
    hoursWorked: { from: number; to: number };
}
