export interface shiftBase {
    jobPositionId: string;
    isHoliday: boolean;
    startTime?: Date;
    endTime?: Date;
}

export interface shiftState extends shiftBase {
    date: Date;
    hoursWorked: number;
    isSaturday: boolean;
    isSunday: boolean;
}

export type shiftGrid = {
    date: Date;
    shift?: shiftState;
};
