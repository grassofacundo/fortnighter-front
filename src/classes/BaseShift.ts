import FetchService from "../services/fetchService";
import { eventReturn } from "../types/database/databaseTypes";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class BaseShift {
    jobId: string;
    isHoliday: boolean;
    start: Date;
    end: Date;
    hoursWorked: number;
    isSaturday: boolean;
    isSunday: boolean;

    constructor(jobId: string, isHoliday: boolean, start: Date, end: Date) {
        this.jobId = jobId;
        this.isHoliday = isHoliday;
        this.start = start;
        this.end = end;
        this.hoursWorked = this.getHoursWorked(start, end);
        this.isSaturday = start.getDay() === 6;
        this.isSunday = start.getDay() === 0;
    }

    getHoursWorked(startDate: Date, endDate: Date): number {
        const startHour = startDate.getHours();
        const startMinutes = startDate.getMinutes() === 30 ? 0.5 : 0;
        const start = startHour + startMinutes;
        const endHour = endDate.getHours();
        const endMinutes = endDate.getMinutes() === 30 ? 0.5 : 0;
        const end = endHour + endMinutes;
        const diff = end - start;
        return diff;
    }

    async save(): Promise<eventReturn<void>> {
        const url = `${baseUrl}/shift/create`;
        const method = "PUT";
        const body = {
            jobId: this.jobId,
            isHoliday: this.isHoliday,
            startTime: this.start,
            endTime: this.end,
        };
        const response = await FetchService.fetchPost<void>({
            url,
            method,
            body,
        });
        return response;
    }
}
