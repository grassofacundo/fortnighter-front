import FetchService from "../services/fetchService";
import { eventReturn } from "../types/database/databaseTypes";
import { priceStructure, workDayStructure } from "../types/job/Position";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class BaseJob {
    name: string;
    hourPrice: priceStructure;
    workdayTimes: workDayStructure;
    paymentLapse: number;
    nextPaymentDate: Date;
    companyName?: string;

    constructor(job: {
        name: string;
        hourPrice: priceStructure;
        workdayTimes: workDayStructure;
        paymentLapse: number;
        nextPaymentDate: Date;
        companyName?: string;
    }) {
        this.name = job.name;
        this.hourPrice = job.hourPrice;
        this.workdayTimes = job.workdayTimes;
        this.paymentLapse = job.paymentLapse;
        this.nextPaymentDate = job.nextPaymentDate;
        this.companyName = job.companyName;
    }

    /**
     * Create a new job position in the database
     *
     * @returns An eventReturn return object. If ok, the content will be the job ID.
     */
    async create(): Promise<eventReturn<string>> {
        const url = `${baseUrl}/job/create`;
        const method = "PUT";
        const body = { ...this };
        const response = await FetchService.fetchPost<string>({
            url,
            method,
            body,
        });
        return response;
    }
}
