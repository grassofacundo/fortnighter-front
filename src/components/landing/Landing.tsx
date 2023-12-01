//#region Dependency list
import { useState, FunctionComponent, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import WelcomeAnimation from "../blocks/welcomeAnimation/WelcomeAnimation";
import InOutAnim from "../utils/InOutAnim";
import Login from "../login/Login";
import Dashboard from "../dashboard/Dashboard";
import ThemeContext from "../contexts/ThemeContext";
import authService from "../../services/authService";
import styles from "./Landing.module.scss";
//#endregion

const Landing: FunctionComponent = () => {
    const authContext = useContext(AuthContext);
    const isAuth = authContext?.isAuth;
    const themeContent = useContext(ThemeContext);
    const theme = themeContent?.theme;
    const toggleTheme = themeContent?.toggleTheme;

    const [animationEnded, setAnimationEnded] = useState<boolean>(false);

    return (
        <div className={styles.appContainer}>
            {!isAuth && (
                <div>
                    <WelcomeAnimation
                        fullText="Fortnighter"
                        onSetAnimationEnded={setAnimationEnded}
                    />
                    <InOutAnim
                        inState={animationEnded}
                        unmountOnExit={false}
                        customClass={styles.loginWrapper}
                    >
                        <Login></Login>
                    </InOutAnim>
                </div>
            )}
            {
                <InOutAnim inState={!!isAuth} customClass="bodyInOut">
                    <Dashboard />
                </InOutAnim>
            }
            {animationEnded && (
                <footer>
                    <button
                        className={styles.logOutButton}
                        style={{ opacity: isAuth ? "1" : "0" }}
                        disabled={!!isAuth === false}
                        onClick={() => authService.logOut()}
                    >
                        Log out
                    </button>
                    <button
                        className={`${styles.themeButton} ${
                            theme === "dark" ? styles.inverted : ""
                        }`}
                        onClick={() => {
                            if (toggleTheme) toggleTheme();
                        }}
                    ></button>
                </footer>
            )}
        </div>
    );
};

export default Landing;
