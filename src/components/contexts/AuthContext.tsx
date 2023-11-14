import {
    FunctionComponent,
    ReactNode,
    createContext,
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import authService from "../../services/authService";
import { eventReturn } from "../../types/database/databaseTypes";
import { authError, logInResponse } from "../../types/auth/user";

type thisProps = {
    children: ReactNode;
};

type authContext = {
    isAuth: boolean | null;
    createAccount(
        email: string,
        password: string
    ): Promise<eventReturn<undefined>>;
    logIn(email: string, password: string): Promise<eventReturn<logInResponse>>;
};

const AuthContext = createContext<authContext | null>(null);

export const UserProvider: FunctionComponent<thisProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const timeOutRef = useRef<null | NodeJS.Timeout>(null);
    const customEvent: authError = "autherror";

    const handleLogOut = useCallback(() => {
        authService.logOut();
        removeEventListener(customEvent, handleLogOut);
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        setIsAuth(false);
    }, []);

    const checkUnauthenticatedError = useCallback(() => {
        removeEventListener(customEvent, handleLogOut); //To avoid duplicates
        addEventListener(customEvent, handleLogOut);
    }, [handleLogOut]);

    const handleLogIn = useCallback(() => {
        setAutoLogout();
        checkUnauthenticatedError();
        setIsAuth(true);
    }, [checkUnauthenticatedError]);

    function setAutoLogout() {
        timeOutRef.current = setTimeout(() => {
            authService.logOut();
            setIsAuth(false);
        }, authService.getTokenTime());
    }

    async function createAccount(
        email: string,
        password: string
    ): Promise<eventReturn<undefined>> {
        const response = await authService.signUp({ email, password });
        return response;
    }

    const logIn = useCallback(
        async (
            email: string,
            password: string
        ): Promise<eventReturn<logInResponse>> => {
            const response = await authService.logIn({ email, password });
            if (response.ok && response.content) {
                const { token, user } = response.content as logInResponse;
                authService.setSession(token, user);
                handleLogIn();
            }
            return response;
        },
        [handleLogIn]
    );

    useEffect(() => {
        if (authService.hasSession()) {
            handleLogIn();
        } else {
            handleLogOut();
        }
    }, [handleLogIn, handleLogOut]);

    return (
        <AuthContext.Provider value={{ isAuth, createAccount, logIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
