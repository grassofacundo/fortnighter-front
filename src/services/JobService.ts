//#region Dependency list
import { Job } from "../classes/job/JobPosition";
import { eventReturn } from "../types/database/databaseTypes";
import { payment, paymentBase } from "../types/job/Payment";
import { dbJobPositionType } from "../types/job/Position";
import { getDateAsInputValue } from "./dateService";
import FetchService from "./fetchService";
//#endregion

class JobService {
    url = `${import.meta.env.VITE_SERVER_DOMAIN}`;

    async getJobPositions(): Promise<dbJobPositionType[]> {
        const url = `${this.url}/job/get-all`;
        const response = await FetchService.fetchGet<dbJobPositionType[]>(url);
        if (
            FetchService.isOk(response) &&
            response.content &&
            response.content.length > 0
        ) {
            const jobList = response.content.map((job) => {
                return { ...job };
            });
            return jobList;
        } else {
            return [];
        }
    }

    parseAsJobPosition(dbJobPosition: dbJobPositionType): Job {
        const job = new Job({
            ...dbJobPosition,
            nextPaymentDate: new Date(dbJobPosition.nextPaymentDate),
        });
        return job;
    }

    /**
     * Create a new payment in the database
     *
     * @param newPayment - An object following the paymentBase interface structure
     * @returns An eventReturn return object. If ok, the content will be a payment object.
     */
    async createNewPayment(
        newPayment: paymentBase
    ): Promise<eventReturn<payment>> {
        const url = `${this.url}/payment/create`;
        const method = "PUT";
        const body = { ...newPayment };
        const response = await FetchService.fetchPost<payment>({
            url,
            method,
            body,
        });
        return response;
    }

    async getLastPayment(
        startDate: Date,
        endDate: Date,
        jobId: string
    ): Promise<payment | null> {
        const start: string = getDateAsInputValue(startDate);
        const end: string = getDateAsInputValue(endDate);
        const params = `?startDate=${start}&endDate=${end}&jobId=${jobId}`;
        const url = `${this.url}/payment/get-last/${params}`;
        const r = await FetchService.fetchGet<payment>(url);
        if (FetchService.isOk(r) && r.content) {
            return r.content;
        } else {
            return null;
        }
    }
}

const jobService = new JobService();
export default jobService;
