import FetchService from "../../services/fetchService";
import { eventReturn } from "../../types/database/databaseTypes";
import {
    amountStructure,
    byAmount,
    byShift,
    newBaseModifierObj,
} from "../../types/job/Modifiers";
import { Modifier } from "./Modifier";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class BaseModifier {
    name: string;
    byShift?: byShift;
    byAmount?: byAmount;
    paymentId?: string;
    amount: amountStructure;
    jobId: string;

    constructor(modifier: newBaseModifierObj) {
        this.name = modifier.name;
        this.byShift = modifier.byShift;
        this.byAmount = modifier.byAmount;
        this.paymentId = modifier.paymentId;
        this.amount = modifier.amount;
        this.jobId = modifier.jobId;
    }

    /**
     * Create a new modifier in the database
     *
     * @returns An eventReturn return object. If ok, the content will be the modifier ID.
     */
    async create(): Promise<eventReturn<Modifier>> {
        const url = `${baseUrl}/modifier/create`;
        const method = "PUT";
        const body = { ...this };
        const response = await FetchService.fetchPost<Modifier>({
            url,
            method,
            body,
        });
        return response;
    }
}
