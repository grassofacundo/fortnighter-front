import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import dbService from "./services/dbService";
import "./style/_main.scss";
import authService from "./services/authService";

//dbService.init();
authService.init();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
