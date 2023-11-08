import {
    FunctionComponent,
    ReactNode,
    createContext,
    useEffect,
    useRef,
    useState,
} from "react";
import authService from "../../services/authService";

type thisProps = {
    children: ReactNode;
};

type authContext = {
    isAuth: boolean | null;
    createAccount(email: string, password: string): Promise<EventReturn>;
    logIn(email: string, password: string): Promise<EventReturn>;
};

const AuthContext = createContext<authContext | null>(null);

export const UserProvider: FunctionComponent<thisProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const timeOutRef = useRef<null | NodeJS.Timeout>(null);
    const customEvent: authError = "autherror";

    function setAutoLogout() {
        timeOutRef.current = setTimeout(() => {
            authService.logOut();
            setIsAuth(false);
        }, authService.getTokenTime());
    }

    function checkUnauthenticatedError() {
        removeEventListener(customEvent, handleLogOut); //To avoid duplicates
        addEventListener(customEvent, handleLogOut);
    }

    function handleLogIn() {
        setAutoLogout();
        checkUnauthenticatedError();
        setIsAuth(true);
    }

    function handleLogOut() {
        authService.logOut();
        removeEventListener(customEvent, handleLogOut);
        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        setIsAuth(false);
    }

    async function createAccount(
        email: string,
        password: string
    ): Promise<EventReturn> {
        const response = await authService.signUp({ email, password });
        return response;
    }

    async function logIn(
        email: string,
        password: string
    ): Promise<EventReturn> {
        const response = await authService.logIn({ email, password });
        if (response.ok) {
            const { token, user } = response.content as logInResponse;
            authService.setSession(token, user);
            handleLogIn();
        }
        return response;
    }

    useEffect(() => {
        if (authService.hasSession()) {
            handleLogIn();
        } else {
            handleLogOut();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, createAccount, logIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
