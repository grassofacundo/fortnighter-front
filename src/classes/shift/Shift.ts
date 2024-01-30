import FetchService from "../../services/fetchService";
import { eventReturn } from "../../types/database/databaseTypes";
import { BaseShift } from "./BaseShift";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class Shift extends BaseShift {
    id: string;
    forcedTotal?: number;

    constructor(shift: {
        id: string;
        jobId: string;
        isHoliday: boolean;
        start: Date;
        end: Date;
        forcedTotal?: number;
    }) {
        super(shift.jobId, shift.isHoliday, shift.start, shift.end);
        this.id = shift.id;
        this.forcedTotal = shift.forcedTotal;
    }

    async save(): Promise<eventReturn<void>> {
        const url = `${baseUrl}/shift/update`;
        const method = "PUT";
        const body = { ...this };
        const response = await FetchService.fetchPost<void>({
            url,
            method,
            body,
        });
        return response;
    }

    // setPay(day: workDayType, type: paymentTypes, pay: priceAndHours): void {
    //     if (!this.paymentInfo) {
    //         this.paymentInfo = { [day]: { [type]: pay } };
    //         return;
    //     }
    //     const payInfoDay = this.paymentInfo[day];
    //     if (!payInfoDay) {
    //         this.paymentInfo[day] = { [type]: pay };
    //         return;
    //     }
    //     if (payInfoDay[type]) payInfoDay[type] = pay;
    // }
}
