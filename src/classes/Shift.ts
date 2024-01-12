import FetchService from "../services/fetchService";
import { eventReturn } from "../types/database/databaseTypes";
import { workDayType } from "../types/job/Position";
import {
    forcedPayInfoStructure,
    paymentTypes,
    priceAndHours,
} from "../types/job/Shift";
import { BaseShift } from "./BaseShift";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class Shift extends BaseShift {
    id: string;
    paymentInfo?: forcedPayInfoStructure;

    constructor(shift: {
        id: string;
        jobId: string;
        isHoliday: boolean;
        start: Date;
        end: Date;
    }) {
        super(shift.jobId, shift.isHoliday, shift.start, shift.end);
        this.id = shift.id;
    }

    async save(): Promise<eventReturn<void>> {
        const url = `${baseUrl}/shift/update`;
        const method = "PUT";
        const body = {
            id: this.id,
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

    setPay(day: workDayType, type: paymentTypes, pay: priceAndHours): void {
        if (!this.paymentInfo) {
            this.paymentInfo = { [day]: { [type]: pay } };
            return;
        }
        const payInfoDay = this.paymentInfo[day];
        if (!payInfoDay) {
            this.paymentInfo[day] = { [type]: pay };
            return;
        }
        if (payInfoDay[type]) payInfoDay[type] = pay;
    }
}
