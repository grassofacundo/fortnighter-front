import FetchService from "../../services/fetchService";
import { eventReturn } from "../../types/database/databaseTypes";
import { newModifierObj } from "../../types/job/Modifiers";
import { BaseModifier } from "./BaseModifier";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class Modifier extends BaseModifier {
    id: string;

    constructor(modifier: newModifierObj) {
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

    /**
     * Delete a modifier fro the database
     *
     * @returns An eventReturn object. Content will be empty.
     */
    async delete(): Promise<eventReturn<void>> {
        const url = `${baseUrl}/modifier/delete`;
        const method = "DELETE";
        const body = { modifierId: this.id };
        const response = await FetchService.fetchPost<void>({
            url,
            method,
            body,
        });
        return response;
    }
}
