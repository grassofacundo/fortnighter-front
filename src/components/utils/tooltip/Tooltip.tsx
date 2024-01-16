//#region Dependency list
import { FunctionComponent } from "react";
import style from "./Tooltip.module.scss";
import { createPortal } from "react-dom";
//#endregion

type thisProps = { text: string; element: HTMLElement };

const Tooltip: FunctionComponent<thisProps> = ({ text, element }) => {
    const root = document.querySelector("#root") as HTMLElement;

    const { top, left, height, width } = element.getBoundingClientRect();
    root.style.setProperty(`--tooltip-top`, `${top + height / 2}px`);
    root.style.setProperty(`--tooltip-left`, `${left + width / 2}px`);

    return createPortal(
        <div className={style.tooltip}>
            <p className={style.innerText}>{text}</p>
        </div>,
        root
    );
};

export default Tooltip;
