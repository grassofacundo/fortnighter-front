import {
    FunctionComponent,
    ReactNode,
    createContext,
    useEffect,
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
    logOut: () => Promise<void>;
};

const AuthContext = createContext<authContext | null>(null);

export const UserProvider: FunctionComponent<thisProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const customEvent: authError = "autherror";

    const logOut = useCallback(async () => {
        if (authService.hasSession()) await authService.logOut();
        authService.logOutCleanUp();
        removeEventListener(customEvent, logOut);
        setIsAuth(false);
    }, []);

    const checkUnauthenticatedError = useCallback(() => {
        removeEventListener(customEvent, logOut); //To avoid duplicates
        addEventListener(customEvent, logOut);
    }, [logOut]);

    const handleLogIn = useCallback(() => {
        checkUnauthenticatedError();
        setIsAuth(true);
    }, [checkUnauthenticatedError]);

    const logIn = useCallback(
        async (
            email: string,
            password: string
        ): Promise<eventReturn<logInResponse>> => {
            const response = await authService.logIn({ email, password });
            if (response.ok && response.content && authService.hasSession()) {
                const { user } = response.content as logInResponse;
                authService.setUser(user);
                handleLogIn();
            }
            return response;
        },
        [handleLogIn]
    );

    async function createAccount(
        email: string,
        password: string
    ): Promise<eventReturn<undefined>> {
        const response = await authService.signUp({ email, password });
        return response;
    }

    useEffect(() => {
        if (authService.hasSession()) {
            handleLogIn();
        } else {
            logOut();
        }
    }, [handleLogIn, logOut]);

    return (
        <AuthContext.Provider value={{ isAuth, createAccount, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
