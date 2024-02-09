//#region Dependency list
import {
    FunctionComponent,
    useEffect,
    useRef,
    useState,
    MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import CloseIcon from "./CloseIcon";
import styles from "./CustomSelect.module.scss";
import { inputSelectType, option } from "./Types";
import { inputProp } from "../../FormTypes";
//#endregion

interface thisProps extends inputProp {
    fields: inputSelectType;
}

const CustomSelect: FunctionComponent<thisProps> = ({
    fields,
    onUpdateAnswer,
}) => {
    const { id, label, options, isMulti, isSearchable } = fields;

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [multiValues, setMultiValues] = useState(
        options.filter((o) => o.selected)
    );
    const [value, setValue] = useState<option | null>(getValue());
    const [searchValue, setSearchValue] = useState<string>("");
    const searchRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
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
            if (multiValues.length === 0) return label;

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
            if (!value) return label;
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
        onUpdateAnswer({ id, value: option.value, error: "" });
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
        onUpdateAnswer({ id, value: option.value, error: "" });
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
        <div className={`inputClass ${styles.customDropdownContainer}`}>
            <div
                ref={inputRef}
                onClick={() => handleShowMenu()}
                className={styles.dropdownInput}
            >
                <div className={styles.placeholder}>{getDisplay()}</div>
                <div>
                    <div>
                        <Icon isOpen={showMenu} />
                    </div>
                </div>
            </div>

            {showMenu &&
                createPortal(
                    <div className={styles.dropdownMenu}>
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
