import { FunctionComponent } from "react";
import Landing from "./landing/Landing";
import { UserProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const App: FunctionComponent = () => {
    return (
        <UserProvider>
            <ThemeProvider>
                <Landing />
            </ThemeProvider>
        </UserProvider>
    );
};

export default App;
