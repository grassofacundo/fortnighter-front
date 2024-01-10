import { BaseShift } from "../classes/BaseShift";
import { Shift } from "../classes/Shift";
import { shiftDb } from "../types/job/Shift";
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

    convertShiftFromDbToShift(shiftDb: shiftDb, jobId: string): Shift {
        const start = new Date(shiftDb.startTime);
        const end = new Date(shiftDb.endTime);
        const isHoliday = shiftDb.isHoliday;
        const shiftBase = new BaseShift(jobId, isHoliday, start, end);
        const shift = new Shift({ ...shiftBase, id: shiftDb.id });
        return shift;
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
