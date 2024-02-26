import { credentials, logInResponse, user } from "../types/auth/user";
import { eventReturn } from "../types/database/databaseTypes";
import FetchService from "./fetchService";

/*
Need some refactor
Check cookies instead or local storage
If cookie is expired, do not log out, but call for a token check to the server
In case the refresh token is also expired, log out.
*/

const cookies = ["accessToken", "refreshToken"];

class AuthService {
    url = `${import.meta.env.VITE_SERVER_DOMAIN}/auth`;
    sessionId = "";
    user: user | null = null;

    // init(): void {
    //     const cookies = this.getCookiesObject();
    //     this.token = this.getCookie("AccessToken");
    //     if (this.token) this.expiryDate = this.getExpiryDate();
    //     if (this.expiryDate && new Date(this.expiryDate) <= new Date())
    //         this.logOut();
    // }

    // setSession(user: user): void {
    //     const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000);

    //     this.expiryDate = expiryDate;
    //     this.token = token;
    //     this.user = user;

    //     localStorage.setItem("expiryDate", expiryDate.toISOString());
    //     localStorage.setItem("token", token);
    // }

    hasSession(): boolean {
        const cookies = this.getCookiesObject();
        const hasSession = !!cookies.refreshToken || !!cookies.accessToken;
        if (hasSession && !this.sessionId) this.setSessionId();
        return hasSession;
    }

    setSessionId() {
        const cookies = this.getCookiesObject();
        const refresh = cookies.refreshToken;
        const access = cookies.accessToken;
        const splittedToken = refresh
            ? refresh.split(".")[1]
            : access.split(".")[1];
        const atobValue = window.atob(splittedToken);
        const payload = JSON.parse(atobValue);
        if (payload.sessionId) this.sessionId = payload.sessionId;
    }

    removeSessionId() {
        this.sessionId = "";
    }

    getCookiesObject(): Record<string, string> {
        const cookieObject: Record<string, string> = {};
        const cookies = document.cookie;
        if (cookies) {
            const cookiesArr = cookies.split(";");
            if (cookiesArr.length > 0) {
                cookiesArr.forEach((cookie) => {
                    const cookieSplitted = cookie.trim().split("=");
                    const name = cookieSplitted[0].trim();
                    const value = cookieSplitted[1].trim();
                    cookieObject[name] = value;
                });
            }
        }

        return cookieObject;
    }

    //This would work as a deleteCookie method.
    expireCookies(): void {
        cookies.forEach(
            (cookieName) =>
                (document.cookie = `${cookieName}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`)
        );
    }

    setUser(user?: user) {
        this.user = user ?? null;
    }

    // getExpiryDate(token: string): string {
    //     const header = JSON.parse(window.atob(token.split(".")[0]));
    //     const payload = JSON.parse(window.atob(token.split(".")[1]));
    //     return payload as string;
    // }

    async logIn({
        email,
        password,
    }: credentials): Promise<eventReturn<logInResponse>> {
        const url = `${this.url}/login`;
        const body = { email, password };
        const response = await FetchService.fetchPost<logInResponse>({
            url,
            body,
        });
        return response;
    }

    async signUp({
        email,
        password,
    }: credentials): Promise<eventReturn<undefined>> {
        const url = `${this.url}/signup`;
        const body = { email, password };
        let response: eventReturn<undefined> = {
            ok: false,
            status: 500,
        };
        try {
            response = await FetchService.fetchPost({
                url,
                body,
            });
        } catch (error) {
            console.error(error);
        }
        return response;
    }

    async logOut(): Promise<eventReturn<void>> {
        const url = `${this.url}/logout`;
        const body = { sessionId: this.sessionId };
        const method = "DELETE";
        let response: eventReturn<void> = {
            ok: false,
            status: 500,
        };
        try {
            response = await FetchService.fetchPost({
                url,
                method,
                body,
            });
        } catch (error) {
            console.error(error);
        }
        return response;
    }

    logOutCleanUp() {
        if (this.hasSession()) this.expireCookies();
        this.removeSessionId();
        this.setUser();
    }
}

const authService = new AuthService();
export default authService;
