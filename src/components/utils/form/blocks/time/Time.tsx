//#region Dependency list
import { FunctionComponent, ChangeEvent, useRef } from "react";
import { inputTimeType, meridianValues, time12Meridian } from "./Types";
import { inputProp } from "../../FormTypes";
import TimeSelect from "./select/TimeSelect";
import styles from "./Time.module.scss";
import {
    getDefaultHourValue,
    getDefaultMinuteValue,
    getDefaultMeridian,
    dateAsTimeStructure,
} from "./select/TimeMethods";
//#endregion

interface thisProps extends inputProp {
    fields: inputTimeType;
}

const InputTime: FunctionComponent<thisProps> = ({
    fields,
    formAnswers,
    onUpdateAnswer,
}) => {
    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);

    const { id, label, hour, minute, meridian, defaultValue } = fields;
    const h = hour;
    const m = minute;

    function getDefaultValue(): time12Meridian | undefined {
        if (!defaultValue) return;

        return defaultValue instanceof Date
            ? dateAsTimeStructure(defaultValue)
            : (defaultValue as time12Meridian);
    }

    function validInput({ target }: ChangeEvent<HTMLInputElement>): void {
        const prevAnswer = formAnswers.find((answer) => answer.id === id);
        const prevValue: time12Meridian =
            (prevAnswer?.value as time12Meridian) ??
            (`00:00-${getDefaultMeridian(
                getDefaultValue(),
                meridian
            )}` as time12Meridian);

        let newAnswer = "";

        if (target.name === "hour") {
            const minuteStart = prevValue.indexOf(":");
            const minuteEnd = prevValue.indexOf("-");
            const minute = prevValue.substring(minuteStart + 1, minuteEnd);
            let hour = 1;
            try {
                hour = Number(target.value);
                let hourStr = "";
                if (hour > 12) hourStr = "12";
                if (hour < 1) hourStr = "1";
                if (!hourStr) hourStr = `${hour}`;
                if (hourStr.length === 1) hourStr = `0${hourStr}`;
                if (target.value !== hourStr) updateInput("hour", hourStr);
            } catch (error) {
                console.log(error);
            }
            newAnswer = `${
                target.value.length === 1 ? `0${hour}` : hour
            }:${minute}`;
        }
        if (target.name === "minute") {
            const hour = prevValue.split(":")[0];
            let minute = 0;
            try {
                minute = Number(target.value);
                let minuteStr = "";
                if (minute > 30) minuteStr = "30";
                if (minute < 0) minuteStr = "00";
                if (minute === 3) {
                    minuteStr = "30";
                    minute = 30;
                }
                if (minute !== 0 && minute !== 30)
                    minute > 15 ? (minuteStr = "30") : (minuteStr = "00");

                if (!minuteStr) minuteStr = `${minute}`;
                if (minuteStr.length === 1) minuteStr = `0${minuteStr}`;

                if (target.value !== minuteStr)
                    updateInput("minute", minuteStr);
            } catch (error) {
                console.log(error);
            }
            newAnswer = `${hour}:${minute}`;
        }
        const meridianVal = prevValue.split("-")[1] as meridianValues;
        newAnswer = `${newAnswer}-${meridianVal}`;
        onUpdateAnswer({
            id,
            value: newAnswer,
            error: "",
        });
    }

    function updateMeridian(meridianParam: meridianValues): void {
        const prevAnswer = formAnswers.find((answer) => answer.id === id);
        const prevValue =
            (prevAnswer?.value as string) ??
            `00:00-${getDefaultMeridian(getDefaultValue(), meridian)}`;

        const time = prevValue.split("-")[0];
        const newAnswer = `${time}-${meridianParam}`;
        onUpdateAnswer({
            id,
            value: newAnswer,
            error: "",
        });
    }

    function updateInput(
        time: "hour" | "minute",
        value: string | number
    ): void {
        let input: HTMLInputElement | undefined | null;
        if (time === "hour") {
            input = hourRef.current;
        }
        if (time === "minute") {
            input = minuteRef.current;
        }

        if (!input || !input?.value) return;
        input.value = value.toString();
    }

    return (
        <div className={`inputClass ${styles.timeInputBody}`}>
            {label && <p className={styles.timeLabel}>{label}</p>}
            <div className={styles.inputContainer}>
                {/* Hour input */}
                <div className={styles.inputWrapper}>
                    <input
                        ref={hourRef}
                        type="number"
                        name="hour"
                        id={h.id}
                        max={h.max ?? 12}
                        min={h.min ?? 1}
                        placeholder={h.placeholder}
                        required={!h.isOptional}
                        onChange={(target) => validInput(target)}
                        defaultValue={getDefaultHourValue(getDefaultValue())}
                        step={h.step}
                    ></input>
                </div>
                <p className={styles.separator}>:</p>
                {/* Minutes input */}
                <div className={styles.inputWrapper}>
                    <input
                        ref={minuteRef}
                        type="number"
                        name="minute"
                        id={m.id}
                        max={m.max ?? 30}
                        min={m.min ?? 0}
                        placeholder={m.placeholder}
                        required={!m.isOptional}
                        onChange={(target) => validInput(target)}
                        defaultValue={getDefaultMinuteValue(getDefaultValue())}
                        step={m.step}
                    ></input>
                </div>
                <TimeSelect
                    isAm={
                        getDefaultMeridian(getDefaultValue(), meridian) === "AM"
                    }
                    onMeridiemChange={updateMeridian}
                ></TimeSelect>
            </div>
        </div>
    );
};

export default InputTime;
