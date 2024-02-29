import { FunctionComponent, useContext, useState } from "react";
import FormManager from "../utils/form/FormManager";
import AuthContext from "../contexts/AuthContext";
import styles from "./Login.module.scss";
import { parsedAnswers } from "../utils/form/FormTypes";

const Login: FunctionComponent = () => {
    const authContext = useContext(AuthContext);
    const [hasAccount, setHasAccount] = useState<boolean>(true);
    const [Loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");

    function handleOptionChange() {
        setHasAccount((prevState) => !prevState);
        setErrorMsg("");
    }

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        if (!authContext) {
            setErrorMsg("Can't get auth information");
            return;
        }

        if (!answers.email || !answers.password) {
            setErrorMsg("Error on form answers");
            return;
        }
        const email = answers.email as string;
        const password = answers.password as string;

        if (!hasAccount) {
            setLoading(true);

            const signUpResponse = await authContext.createAccount(
                email,
                password
            );
            if (!signUpResponse.ok) {
                setErrorMsg(
                    signUpResponse?.error?.message ?? "Error creating account"
                );
                setLoading(false);
                return;
            }

            const logInResponse = await authContext.logIn(email, password);
            if (!logInResponse.ok) {
                setErrorMsg(
                    logInResponse?.error?.message ??
                        "Error logging in after creating account"
                );
                setHasAccount(true);
                setLoading(false);
                return;
            }

            return;
        }
        if (hasAccount) {
            console.log("User has account");
            setLoading(true);

            console.log("Starting request");
            const logInResponse = await authContext.logIn(email, password);
            console.log("The response from the service is");
            console.log(logInResponse);
            if (!logInResponse.ok) {
                console.log("LogInResponse is not ok");
                setErrorMsg(logInResponse?.error?.message ?? "Couldn't log in");
                setLoading(false);
                return;
            }
            console.log("Last return");
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
                        loading={Loading}
                        serverErrorMsg={errorMsg}
                    />
                </>
            }
        </div>
    );
};

export default Login;
