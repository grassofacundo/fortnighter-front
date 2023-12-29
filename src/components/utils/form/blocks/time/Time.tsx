//#region Dependency list
import { FunctionComponent, ChangeEvent } from "react";
import {
    inputTimeType,
    meridianValues,
    timeStructure,
} from "../../types/TimeType";
import { inputProp } from "../../types/FormTypes";
import TimeSelect from "./select/TimeSelect";
import styles from "./Time.module.scss";
//#endregion

interface thisProps extends inputProp {
    fields: inputTimeType;
}

const InputTime: FunctionComponent<thisProps> = ({
    fields,
    formAnswers,
    onUpdateAnswer,
}) => {
    const { id, label, hour, minute, isAm } = fields;
    const h = hour;
    const m = minute;

    function validInput({ target }: ChangeEvent<HTMLInputElement>): void {
        const prevAnswer = formAnswers.find((answer) => answer.id === id);
        const prevValue: timeStructure =
            (prevAnswer?.value as timeStructure) ??
            ("00:00-AM" as timeStructure);

        let newAnswer = "";

        if (target.name === "hour") {
            const minute = prevValue.split(":")[1];
            newAnswer = `${
                target.value.length === 1 ? `0${target.value}` : target.value
            }:${minute}`;
        }
        if (target.name === "minute") {
            const hour = prevValue.split(":")[0];
            newAnswer = `${hour}:${target.value}`;
        }
        const meridian = prevValue.split("-")[1] as meridianValues;
        newAnswer = `${newAnswer}-${meridian}`;
        onUpdateAnswer({
            id,
            value: newAnswer,
            error: "",
        });
    }

    function updateMeridian(meridian: meridianValues): void {
        const prevAnswer = formAnswers.find((answer) => answer.id === id);
        const prevValue = (prevAnswer?.value as string) ?? "00:00[AM]";

        const time = prevValue.split("-")[0];
        const newAnswer = `${time}-${meridian}`;
        onUpdateAnswer({
            id,
            value: newAnswer,
            error: "",
        });
    }

    return (
        <div className={`inputClass ${styles.timeInputBody}`}>
            {label && <p>{label}</p>}
            <div className={styles.inputContainer}>
                {/* Hour input */}
                <div className={styles.inputWrapper}>
                    <input
                        type="number"
                        name="hour"
                        id={h.id}
                        max={h.max}
                        min={h.min}
                        placeholder={h.placeholder}
                        required={!h.isOptional}
                        onChange={(target) => validInput(target)}
                        defaultValue={h.defaultValue}
                        step={h.step}
                    ></input>
                </div>
                <p>:</p>
                {/* Minutes input */}
                <div className={styles.inputWrapper}>
                    <input
                        type="number"
                        name="minute"
                        id={m.id}
                        max={m.max}
                        min={m.min}
                        placeholder={m.placeholder}
                        required={!m.isOptional}
                        onChange={(target) => validInput(target)}
                        defaultValue={m.defaultValue}
                        step={m.step}
                    ></input>
                </div>
                <TimeSelect
                    isAm={isAm}
                    onMeridiemChange={updateMeridian}
                ></TimeSelect>
            </div>
        </div>
    );
};

export default InputTime;
