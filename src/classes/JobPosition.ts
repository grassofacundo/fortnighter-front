import { getAs24Format } from "../components/utils/form/blocks/time/select/TimeMethods";
import FetchService from "../services/fetchService";
import { eventReturn } from "../types/database/databaseTypes";
import {
    priceStructure,
    workDayStructure,
    workDayType,
} from "../types/job/Position";
import { BaseJob } from "./BaseJobPosition";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class Job extends BaseJob {
    id: string;

    constructor(job: {
        id: string;
        name: string;
        hourPrice: priceStructure;
        workdayTimes: workDayStructure;
        paymentLapse: number;
        nextPaymentDate: Date;
        companyName?: string;
    }) {
        super(job);
        this.id = job.id;
    }

    /**
     * Update a job position in the database
     *
     * @param jobPositionToUpdate - An object following the baseJobPosition interface structure
     * @returns An eventReturn return object. If ok, the content will be a jobPosition object.
     */
    async update(): Promise<eventReturn<void>> {
        const url = `${baseUrl}/job/update`;
        const method = "PUT";
        const body = { ...this };
        const response = await FetchService.fetchPost<void>({
            url,
            method,
            body,
        });
        return response;
    }

    isOvernight(type: workDayType) {
        const dayType = this.workdayTimes[type] ?? this.workdayTimes.week;
        const date1 = getAs24Format(
            `${dayType.startTime}-${dayType.startMeridian}`
        );
        const date2 = getAs24Format(
            `${dayType.endTime}-${dayType.endMeridian}`
        );
        return date1 >= date2;
    }
}
