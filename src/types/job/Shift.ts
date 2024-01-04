export interface shiftLocalState<timeType> {
    jobPositionId: string;
    isHoliday?: boolean;
    startTime?: timeType;
    endTime?: timeType;
}

export interface shiftBase extends shiftLocalState<Date> {
    isHoliday: boolean;
    startTime: Date;
    endTime: Date;
}

export interface shiftDb extends shiftLocalState<string> {
    isHoliday: boolean;
    startTime: string;
    endTime: string;
}

export interface shiftState extends shiftBase {
    hoursWorked: number;
    isSaturday: boolean;
    isSunday: boolean;
}

export type dateArray = [Date, Date?];
export type shiftGrid = {
    date: dateArray;
    shift?: shiftState;
};
