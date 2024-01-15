import { getTomorrow } from "../services/dateService";
import FetchService from "../services/fetchService";
import { eventReturn } from "../types/database/databaseTypes";
import { workDayType } from "../types/job/Position";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class BaseShift {
    jobId: string;
    isHoliday: boolean;
    start: Date;
    end: Date;

    constructor(jobId: string, isHoliday: boolean, start: Date, end: Date) {
        this.jobId = jobId;
        this.isHoliday = isHoliday;
        this.start = start;
        this.end = end;
    }

    getHoursWorked(): number {
        const startHour = this.start.getHours();
        const startMinutes = this.start.getMinutes() === 30 ? 0.5 : 0;
        const start = startHour + startMinutes;
        const endHour = this.end.getHours();
        const endMinutes = this.end.getMinutes() === 30 ? 0.5 : 0;
        const end = endHour + endMinutes + (this.isOvernight() ? 24 : 0);
        const diff = end - start;
        return diff;
    }

    startsOnSaturday() {
        return this.start.getDay() === 6;
    }

    endOnSaturday() {
        return this.end.getDay() === 6;
    }

    startsOnSunday() {
        return this.start.getDay() === 0;
    }

    endsOnSunday() {
        return this.end.getDay() === 0;
    }

    isOvernight() {
        return getTomorrow(this.start).getDate() === this.end.getDate();
    }

    getTypeDay(): workDayType {
        let day = "week" as workDayType;
        if (this.startsOnSaturday()) day = "saturday";
        if (this.startsOnSunday()) day = "sunday";
        if (this.isHoliday) day = "holiday";
        return day;
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
