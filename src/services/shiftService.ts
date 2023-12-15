import { eventReturn } from "../types/database/databaseTypes";
import { shiftBase, shiftDb, shiftState } from "../types/job/Shift";
import { getDateAsInputValue, getPlainDate } from "./dateService";
import FetchService from "./fetchService";

class ShiftService {
    url = `${import.meta.env.VITE_SERVER_DOMAIN}`;

    getDateAfterStartAndEnd(startDate: Date, endDate: Date): Date {
        const start = getDateAsInputValue(startDate);
        const end = getDateAsInputValue(endDate);
        if (start === end) {
            return getPlainDate(startDate);
        } else {
            throw new Error("Couldn't get shift date");
        }
    }

    getHoursWorked(startDate: Date, endDate: Date): number {
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        const diff = Math.round(endHour - startHour);
        return diff;
    }

    isSaturday(date: Date): boolean {
        return date.getDay() === 6;
    }

    isSunday(date: Date): boolean {
        return date.getDay() === 0;
    }

    getShiftAsState(shift: shiftBase | shiftDb): shiftState {
        const start =
            typeof shift.startTime === "string"
                ? new Date(shift.startTime)
                : shift.startTime;
        const end =
            typeof shift.endTime === "string"
                ? new Date(shift.endTime)
                : shift.endTime;
        const plainDate = this.getDateAfterStartAndEnd(start, end);
        const shiftState = {
            jobPositionId: shift.jobPositionId,
            isHoliday: shift.isHoliday,
            startTime: start,
            endTime: end,
            date: plainDate,
            hoursWorked: this.getHoursWorked(start, end),
            isSaturday: this.isSaturday(plainDate),
            isSunday: this.isSunday(plainDate),
        };
        return shiftState;
    }

    async setShift(shift: shiftBase): Promise<eventReturn<shiftBase>> {
        const url = `${this.url}/shift/create`;
        const method = "PUT";
        const body = { ...shift };
        const response = await FetchService.fetchPost<shiftBase>({
            url,
            method,
            body,
        });
        return response;
    }

    async getShifts(
        startDate: Date,
        endDate: Date,
        positionId: string
    ): Promise<shiftDb[]> {
        const start: string = getDateAsInputValue(startDate);
        const end: string = getDateAsInputValue(endDate);
        const params = `?startDate=${start}&endDate=${end}&jobPositionId=${positionId}`;
        const url = `${this.url}/shift/get-shifts/${params}`;
        const response = await FetchService.fetchGet<shiftDb[]>(url);
        if (
            FetchService.isOk(response) &&
            response.content &&
            response.content.length > 0
        ) {
            return response.content;
        } else {
            return [];
        }
    }
}

const shiftService = new ShiftService();
export default shiftService;
