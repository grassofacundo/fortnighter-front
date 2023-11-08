import FetchService from "./fetchService";

class AuthService {
    token: string | null = null;
    expiryDate: string | Date | null = null;
    url = `${import.meta.env.VITE_SERVER_DOMAIN}/auth`;
    user: user | null = null;

    init(): void {
        this.token = localStorage.getItem("token");
        this.expiryDate = localStorage.getItem("expiryDate");
        if (this.expiryDate && new Date(this.expiryDate) <= new Date())
            this.logOut();
    }

    setSession(token: string, user: user): void {
        const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000);

        this.expiryDate = expiryDate;
        this.token = token;
        this.user = user;

        localStorage.setItem("expiryDate", expiryDate.toISOString());
        localStorage.setItem("token", token);
    }

    hasSession(): boolean {
        let hasSession = true;
        if (!this.token) hasSession = false;
        if (!this.expiryDate) hasSession = false;
        if (this.expiryDate && new Date(this.expiryDate) <= new Date())
            hasSession = false;

        return hasSession;
    }

    getTokenTime(): number {
        if (!this.expiryDate) return 0;
        return new Date(this.expiryDate).getTime() - new Date().getTime();
    }

    async logIn({ email, password }: credentials): Promise<EventReturn> {
        const url = `${this.url}/login`;
        const body = { email, password };
        let response: EventReturn = {
            ok: false,
            status: 500,
            errorMessage: "Couldn't process Sign Up",
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

    async signUp({ email, password }: credentials): Promise<EventReturn> {
        const url = `${this.url}/signup`;
        const body = { email, password };
        let response: EventReturn = {
            ok: false,
            status: 500,
            errorMessage: "Couldn't process Sign Up",
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

    logOut(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate");
        this.token = null;
        this.expiryDate = null;
        this.user = null;
    }
}

const authService = new AuthService();
export default authService;
