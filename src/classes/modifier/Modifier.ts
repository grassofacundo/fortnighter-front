import FetchService from "../../services/fetchService";
import { eventReturn } from "../../types/database/databaseTypes";
import { amountStructure, byAmount, byShift } from "../../types/job/Modifiers";
import { BaseModifier } from "./BaseModifier";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class Modifier extends BaseModifier {
    id: string;

    constructor(modifier: {
        id: string;
        name: string;
        byShift: byShift;
        byAmount: byAmount;
        paymentId: string;
        amount: amountStructure;
        jobId: string;
    }) {
        super(modifier);
        this.id = modifier.id;
    }

    /**
     * Update a modifier in the database
     *
     * @param modifierToUpdate - An object following the BaseModifier interface structure.
     * @returns An eventReturn object. If ok, the content will be a modifier object.
     */
    async update(): Promise<eventReturn<Modifier>> {
        const url = `${baseUrl}/modifier/update`;
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
