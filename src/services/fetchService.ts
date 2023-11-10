import { eventReturn } from "../types/database/databaseTypes";
import authService from "./authService";

export default class FetchService {
    static async fetchPost<contentType>({
        url,
        method,
        contentType,
        body,
    }: fetchApi): Promise<eventReturn<contentType>> {
        const eventReturn: eventReturn<contentType> = {
            ok: true,
            status: 500,
        };
        try {
            const response = await fetch(url, {
                method: method ?? "POST",
                headers: {
                    "Content-Type": contentType ?? "application/json",
                    Authorization: `Bearer ${authService.token}`,
                },
                body: JSON.stringify(body),
            });

            eventReturn.ok = response.ok;
            eventReturn.status = response.status;
            const result = await response.json();
            if (!eventReturn.ok) {
                eventReturn.error = { message: result.message };
            } else {
                eventReturn.content = result as contentType;
            }
        } catch (error) {
            eventReturn.error = {
                message: `Error during ${method} request`,
                content: error,
            };
        }
        if (eventReturn.status === 401) {
            const logOutEvent = new Event("autherror");
            dispatchEvent(logOutEvent);
        }
        return eventReturn;
    }

    static async fetchGet<contentType>(
        url: string
    ): Promise<eventReturn<contentType>> {
        const eventReturn: eventReturn<contentType> = {
            ok: false,
            status: 500,
        };
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authService.token}`,
                },
            });
            eventReturn.ok = response.ok;
            eventReturn.status = response.status;
            const result = await response.json();
            if (!this.isOk(eventReturn)) {
                eventReturn.error = {
                    message: result.message,
                };
            } else {
                eventReturn.content = result as contentType;
            }
        } catch (error) {
            eventReturn.error = {
                message:
                    error instanceof Error
                        ? error.message
                        : "Error during GET request",
                content: error,
            };
        } finally {
            if (eventReturn.status === 401) {
                const logOutEvent = new Event("autherror");
                dispatchEvent(logOutEvent);
            }
        }
        return eventReturn;
    }

    static isOk = (resp: eventReturn<unknown>) =>
        resp.ok && resp.status <= 200 && resp.status <= 299;
}
