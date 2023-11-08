import authService from "./authService";

export default class FetchService {
    static async fetchPost({
        url,
        method,
        contentType,
        body,
    }: fetchApi): Promise<EventReturn> {
        const eventReturn: EventReturn = {
            ok: true,
            status: 500,
            errorMessage: "",
            content: null,
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
                eventReturn.errorMessage = result.message;
            } else {
                eventReturn.content = result;
            }
            return eventReturn;
        } catch (error) {
            return eventReturn;
        }
    }

    static async fetchGet(url: string): Promise<EventReturn> {
        const eventReturn: EventReturn = {
            ok: true,
            status: 500,
            errorMessage: "",
            content: null,
        };
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${authService.token}` },
        });
        eventReturn.ok = response.ok;
        eventReturn.status = response.status;
        const result = await response.json();
        if (!eventReturn.ok) {
            eventReturn.errorMessage = result.message;
        } else {
            eventReturn.content = result;
        }
        if (eventReturn.status === 401) {
            const customEvent: authError = "autherror";
            const logOutEvent = new Event(customEvent);
            dispatchEvent(logOutEvent);
        }
        return eventReturn;
    }
}
