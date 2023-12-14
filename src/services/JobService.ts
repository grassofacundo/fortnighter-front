//#region Dependency list
import { eventReturn } from "../types/database/databaseTypes";
import { payment, paymentBase } from "../types/job/Payment";
import {
    baseJobPosition,
    dbJobPosition,
    jobPosition,
} from "../types/job/Position";
import { getDateAsInputValue } from "./dateService";
import FetchService from "./fetchService";
//#endregion

class JobService {
    url = `${import.meta.env.VITE_SERVER_DOMAIN}`;

    init() {
        console.log("Nothing to initialize");
    }

    /**
     * Create a new job position in the database
     *
     * @param newJobPosition - An object following the baseJobPosition interface structure
     * @returns An eventReturn return object. If ok, the content will be a jobPosition object.
     */
    async createJobPosition(
        newJobPosition: baseJobPosition<Date>
    ): Promise<eventReturn<dbJobPosition>> {
        const url = `${this.url}/job/create`;
        const method = "PUT";
        const body = { ...newJobPosition };
        const response = await FetchService.fetchPost<dbJobPosition>({
            url,
            method,
            body,
        });
        return response;
    }

    /**
     * Create a new job position in the database
     *
     * @param jobPositionToUpdate - An object following the baseJobPosition interface structure
     * @returns An eventReturn return object. If ok, the content will be a jobPosition object.
     */
    async updateJobPosition(
        jobPositionToUpdate: baseJobPosition<Date>
    ): Promise<eventReturn<dbJobPosition>> {
        const url = `${this.url}/job/update`;
        const method = "PUT";
        const body = { ...jobPositionToUpdate };
        const response = await FetchService.fetchPost<dbJobPosition>({
            url,
            method,
            body,
        });
        return response;
    }

    async getJobPositions(): Promise<dbJobPosition[]> {
        const url = `${this.url}/job/get-all`;
        const response = await FetchService.fetchGet<dbJobPosition[]>(url);
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

    parseAsJobPosition(dbJobPosition: dbJobPosition): jobPosition {
        return {
            ...dbJobPosition,
            nextPaymentDate: new Date(dbJobPosition.nextPaymentDate),
        };
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
    ): Promise<payment[]> {
        const start: string = getDateAsInputValue(startDate);
        const end: string = getDateAsInputValue(endDate);
        const params = `?startDate=${start}&endDate=${end}&jobId=${jobId}`;
        const url = `${this.url}/payment/get-last/${params}`;
        const response = await FetchService.fetchGet<payment[]>(url);
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

const jobService = new JobService();
export default jobService;
