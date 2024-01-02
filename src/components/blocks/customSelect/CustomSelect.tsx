//#region Dependency list
import {
    FunctionComponent,
    useEffect,
    useRef,
    useState,
    MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import styles from "./CustomSelect.module.scss";
//#endregion

type option = { label: string; value: string; selected?: boolean };
type thisProps = {
    placeHolder: string;
    options: option[];
    isMulti?: boolean;
    isSearchable?: boolean;
    onChange: ([value]: string) => void;
    align?: "left" | "right";
    customClass?: CSSModuleClasses[string];
};
// Icon component
const Icon = ({ isOpen }: { isOpen: boolean }) => {
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

// CloseIcon component
const CloseIcon = () => {
    return (
        <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
};

// CustomSelect component
const CustomSelect: FunctionComponent<thisProps> = ({
    placeHolder,
    options,
    isMulti,
    isSearchable,
    onChange,
    align,
    customClass,
}) => {
    // State variables using React hooks
    const [showMenu, setShowMenu] = useState<boolean>(false); // Controls the visibility of the dropdown menu
    const [multiValues, setMultiValues] = useState(
        options.filter((o) => o.selected)
    );
    const [value, setValue] = useState<option | null>(getValue());
    const [searchValue, setSearchValue] = useState<string>(""); // Stores the value entered in the search input
    const searchRef = useRef<HTMLInputElement>(null); // Reference to the search input element
    const inputRef = useRef<HTMLDivElement>(null); // Reference to the custom select input element
    const root = document.querySelector("#root") as HTMLElement;

    useEffect(() => {
        function reset() {
            setMultiValues([]);
            setValue(null);
        }
        const customEvent = "resetCustomSelect";
        addEventListener(customEvent, reset);

        return () => removeEventListener(customEvent, reset);
    }, []);

    useEffect(() => {
        setSearchValue("");
        if (showMenu && searchRef.current) {
            searchRef.current.focus();
        }
    }, [showMenu]);

    useEffect(() => {
        const handler = (ev: globalThis.MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(ev.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        window.addEventListener("click", handler);
        return () => {
            window.removeEventListener("click", handler);
        };
    });

    function getValue(): option | null {
        const selectedOptionArr = options.filter((o) => o.selected);
        const selectedOption = selectedOptionArr[0];
        return selectedOption ? selectedOption : null;
    }

    function getDisplay() {
        if (isMulti) {
            if (multiValues.length === 0) return placeHolder;

            return (
                <div className={styles.dropdownTags}>
                    {multiValues.map((option, index) => (
                        <div
                            key={`${option.value}-${index}`}
                            className={styles.item}
                        >
                            {option.label}
                            <span
                                onClick={(e) => onTagRemove(e, option)}
                                className={styles.close}
                            >
                                <CloseIcon />
                            </span>
                        </div>
                    ))}
                </div>
            );
        } else {
            if (!value) return placeHolder;
            return value.label;
        }
    }

    function removeOption(option: option) {
        const copiedValues = structuredClone(multiValues);
        return copiedValues.filter((o) => o.value !== option.value);
    }

    function onTagRemove(
        e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>,
        option: option
    ) {
        e.stopPropagation();
        if (isMulti) {
            setMultiValues(removeOption(option));
        }
        onChange(option.value);
    }

    function onItemClick(option: option) {
        if (isMulti) {
            if (multiValues.findIndex((o) => o.value === option.value) >= 0) {
                setMultiValues(removeOption(option));
            } else {
                setMultiValues([...multiValues, option]);
            }
        } else {
            setValue(option);
        }
        onChange(option.value);
    }

    function isSelected(option: option) {
        if (isMulti)
            return (
                multiValues.filter((o) => o.value === option.value).length > 0
            );

        if (!value) return false;

        return value.value === option.value;
    }

    function getOptions() {
        if (!searchValue) {
            return options;
        }

        return options.filter(
            (option) =>
                option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >=
                0
        );
    }

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

    return (
        <div className={`${styles.customDropdownContainer} ${customClass}`}>
            <div
                ref={inputRef}
                onClick={() => handleShowMenu()}
                className={styles.dropdownInput}
            >
                <div className={styles.placeholder}>{getDisplay()}</div>
                <div>
                    <div className={styles.svgWrapper}>
                        <Icon isOpen={showMenu} />
                    </div>
                </div>
            </div>

            {showMenu &&
                createPortal(
                    <div
                        className={`${styles.dropdownMenu} ${
                            align === "right"
                                ? styles.alignmentRight
                                : styles.alignmentLeft
                        }`}
                    >
                        {isSearchable && (
                            <div className={styles.searchBox}>
                                <input
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    value={searchValue}
                                    ref={searchRef}
                                />
                            </div>
                        )}
                        {getOptions().map((option) => (
                            <div
                                onClick={() => onItemClick(option)}
                                key={option.value}
                                className={`${styles.dropdownItem} ${
                                    isSelected(option) ? styles.selected : ""
                                }`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>,
                    root
                )}
        </div>
    );
};

export default CustomSelect;
