//#region Dependency list
import {
    FunctionComponent,
    useState,
    ChangeEvent,
    Dispatch,
    SetStateAction,
} from "react";
import styles from "./DatePicker.module.scss";
import dateService from "../../services/dateService";
//#endregion

type thisProps = {
    onSetStart: Dispatch<SetStateAction<Date>>;
    onSetEnd: Dispatch<SetStateAction<Date>>;
};

const DatePicker: FunctionComponent<thisProps> = ({ onSetStart, onSetEnd }) => {
    const [startError, setStartError] = useState<string>("");
    const [endError, setEndError] = useState<string>("");

    function handleStartDateChange(dateEvent: ChangeEvent<HTMLInputElement>) {
        const dateValue = dateEvent.target.value;
        const date = new Date(dateValue);
        onSetStart(date);
    }

    function handleEndDateChange(dateEvent: ChangeEvent<HTMLInputElement>) {
        const dateValue = dateEvent.target.value;
        const date = new Date(dateValue);
        onSetEnd(date);
    }

    function getDefault(): string {
        const today = dateService.getToday();
        return dateService.getStr(today);
    }

    return (
        <div className={styles.dateContainer}>
            <input
                type="date"
                onChange={handleStartDateChange}
                defaultValue={getDefault()}
            />
            {startError && <p className={styles.startError}>{startError}</p>}
            <input
                type="date"
                onChange={handleEndDateChange}
                defaultValue={getDefault()}
            />
            {endError && <p className={styles.endError}>{endError}</p>}
        </div>
    );
};

export default DatePicker;
