//#region Dependency list
import { Job } from "../classes/job/JobPosition";
import { Modifier } from "../classes/modifier/Modifier";
import { Shift } from "../classes/shift/Shift";
import { eventReturn } from "../types/database/databaseTypes";
import { payment, paymentBase, paymentDb } from "../types/job/Payment";
import { dbJobPositionType } from "../types/job/Position";
import FetchService from "./fetchService";
//#endregion

class JobService {
    baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

    async getJobPositions(): Promise<dbJobPositionType[]> {
        const url = `${this.baseUrl}/job/get-all`;
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

    parseDbJobAsJob(dbJobPosition: dbJobPositionType): Job {
        const modifiers: Modifier[] = [];
        if (dbJobPosition.modifiers) {
            dbJobPosition.modifiers.forEach((m) =>
                modifiers.push(new Modifier(m))
            );
        }
        const job = new Job({
            ...dbJobPosition,
            nextPayment: new Date(dbJobPosition.nextPayment),
            lastPayment: new Date(dbJobPosition.lastPayment),
            modifiers: modifiers,
        });
        return job;
    }

    parseDbPaymentAsPayment(dbPayment: paymentDb): payment {
        const payment: payment = {
            ...dbPayment,
            jobId: dbPayment.job,
            startDate: new Date(dbPayment.startDate),
            endDate: new Date(dbPayment.endDate),
        };
        return payment;
    }

    parsePaymentAsJob(payment: payment): Job {
        const archivedJob = new Job({
            id: payment.jobId,
            name: "",
            hourPrice: payment.hourPrice,
            workdayTimes: payment.workdayTimes,
            lastPayment: payment.startDate,
            nextPayment: payment.endDate,
            companyName: "",
            modifiers: payment.modifiers,
        });

        return archivedJob;
    }

    /**
     * Create a payment in the database
     *
     * @returns An eventReturn return object. If ok, the content will be a payment id.
     */
    async createPayment(
        shifts: Shift[],
        jobId: string
    ): Promise<
        eventReturn<{
            paymentId: string;
            newLastPayment: string;
            newNextPayment: string;
        }>
    > {
        const url = `${this.baseUrl}/payment/create`;
        const method = "PUT";
        const body = { shifts, jobId };
        const response = await FetchService.fetchPost<{
            paymentId: string;
            newLastPayment: string;
            newNextPayment: string;
        }>({
            url,
            method,
            body,
        });
        return response;
    }

    /**
     * Retrieve the latest payment in the database
     *
     * @returns An eventReturn return object. If ok, the content will be the payment object.
     */
    async getLastPayment(jobId: string): Promise<eventReturn<paymentDb>> {
        const params = `?jobId=${jobId}`;
        const url = `${this.baseUrl}/payment/get-last/${params}`;
        const response = await FetchService.fetchGet<paymentDb>(url);
        return response;
    }

    /**
     * Retrieve all payments from the database
     *
     * @returns An eventReturn return object. If ok, the content will be the payment object.
     */
    async getAllPayments(
        jobId: string,
        pagination: number
    ): Promise<
        eventReturn<[paymentDb, paymentDb, paymentDb, paymentDb, paymentDb]>
    > {
        const params = `?jobId=${jobId}&page=${pagination}`;
        const url = `${this.baseUrl}/payment/get-all/${params}`;
        const response = await FetchService.fetchGet<
            [paymentDb, paymentDb, paymentDb, paymentDb, paymentDb]
        >(url);
        return response;
    }
}

const jobService = new JobService();
export default jobService;
