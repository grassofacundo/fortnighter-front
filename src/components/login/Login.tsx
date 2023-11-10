import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import FormManager from "../utils/form/FormManager";
import AuthContext from "../contexts/AuthContext";
import authService from "../../services/authService";
import dbService from "../../services/JobService";
import styles from "./Login.module.scss";

type LoginProps = {
    onLogIn: Dispatch<SetStateAction<boolean>>;
};

const Login: FunctionComponent<LoginProps> = ({ onLogIn }) => {
    const authContext = useContext(AuthContext);
    const [hasAccount, setHasAccount] = useState<boolean>(true);
    const [Loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");

    function handleNewUser() {
        setHasAccount(false);
        onLogIn(false);
        authService.logOut();
    }

    function handleOptionChange() {
        setHasAccount((prevState) => !prevState);
        setErrorMsg("");
    }

    async function handleSubmit(answers: formAnswersType[]): Promise<void> {
        if (!authContext) {
            setErrorMsg("Can't get auth information");
            return;
        }
        const emailAnswer = answers
            .filter((answer) => answer.id === "email")
            .at(0);
        const passwordAnswer = answers
            .filter((answer) => answer.id === "password")
            .at(0);
        const email = emailAnswer?.value as string;
        const password = passwordAnswer?.value as string;

        if (!email || !password) {
            setErrorMsg("Error on form answers");
            return;
        }

        if (!hasAccount) {
            setLoading(true);

            const signUpResponse = await authContext.createAccount(
                email,
                password
            );
            if (!signUpResponse.ok) {
                setErrorMsg(signUpResponse.errorMessage);
                setLoading(false);
                return;
            }

            const logInResponse = await authContext.logIn(email, password);
            if (!logInResponse.ok) {
                setErrorMsg(logInResponse.errorMessage);
                setLoading(false);
                return;
            }

            return;
        }
        if (hasAccount) {
            setLoading(true);

            const logInResponse = await authContext.logIn(email, password);
            if (!logInResponse.ok) {
                setErrorMsg(logInResponse.errorMessage);
                setLoading(false);
                return;
            }
            return;
        }
    }

    return (
        <div id="loginContainer" className={styles.loginContainer}>
            {
                <>
                    <button onClick={handleOptionChange}>
                        {hasAccount
                            ? "I don't have an account yet"
                            : "I have an account"}
                    </button>
                    <FormManager
                        inputs={[
                            {
                                type: "mail",
                                id: "email",
                                placeholder: "email",
                                isOptional: false,
                            },
                            {
                                type: "password",
                                id: "password",
                                placeholder: "password",
                                isOptional: false,
                            },
                        ]}
                        submitCallback={handleSubmit}
                        submitText={hasAccount ? "Log in" : "Sign in"}
                        Loading={Loading}
                        serverErrorMsg={errorMsg}
                    />
                </>
            }
        </div>
    );
};

export default Login;
