//#region Dependency list
import { FunctionComponent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { meridianValues, timeSelectProps } from "../../../types/TimeType";
import styles from "../Time.module.scss";
//#endregion

const TimeSelect: FunctionComponent<timeSelectProps> = ({
    isAm,
    onMeridiemChange,
}) => {
    const options: meridianValues[] = ["AM", "PM"];

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [value, setValue] = useState<meridianValues>(isAm ? "AM" : "PM");
    const inputRef = useRef<HTMLDivElement>(null);
    const root = document.querySelector("#root") as HTMLElement;

    function handleShowMenu() {
        const container = inputRef?.current?.parentElement;
        if (container && !showMenu) {
            const { top, left, height } = container.getBoundingClientRect();
            root.style.setProperty(`--height`, `${height + 5}px`);
            root.style.setProperty(`--top`, `${top}px`);
            root.style.setProperty(`--left`, `${left}px`);
        }
        setShowMenu((showMenuValue) => !showMenuValue);
    }

    function handleStateUpdate(newValue: meridianValues): void {
        setShowMenu(false);
        setValue(newValue);
        onMeridiemChange(newValue);
    }

    return (
        <div className={styles.customDropdownContainer}>
            <div
                ref={inputRef}
                onClick={() => handleShowMenu()}
                className={styles.dropdownInput}
            >
                <div className={styles.placeholder}>{value}</div>
                <div className={styles.svgWrapper}>
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="#222"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={showMenu ? styles.translate : ""}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>

            {showMenu &&
                createPortal(
                    <div className={styles.dropdownMenu}>
                        {options.map((option) => (
                            <div
                                onClick={() => handleStateUpdate(option)}
                                key={option}
                                className={`${styles.dropdownItem} ${
                                    option === value ? styles.selected : ""
                                }`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>,
                    root
                )}
        </div>
    );
};

export default TimeSelect;
