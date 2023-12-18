//#region Dependency list
import { FunctionComponent } from "react";
import styles from "./Arrow.module.scss";
//#endregion

type thisProps = { isOpen: boolean };

const Arrow: FunctionComponent<thisProps> = ({ isOpen }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="#222"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isOpen ? styles.translate : ""}
        >
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );
};

export default Arrow;
