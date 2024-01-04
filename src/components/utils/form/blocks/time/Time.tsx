//#region Dependency list
import { FunctionComponent, ChangeEvent, useRef } from "react";
import {
    inputTimeType,
    meridianValues,
    timeStructure,
} from "../../types/TimeType";
import { inputProp } from "../../types/FormTypes";
import TimeSelect from "./select/TimeSelect";
import styles from "./Time.module.scss";
import {
    getDefaultHourValue,
    getDefaultMinuteValue,
    getDefaultMeridian,
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

    function validInput({ target }: ChangeEvent<HTMLInputElement>): void {
        const prevAnswer = formAnswers.find((answer) => answer.id === id);
        const prevValue: timeStructure =
            (prevAnswer?.value as timeStructure) ??
            (`00:00-${getDefaultMeridian(
                defaultValue,
                meridian
            )}` as timeStructure);

        let newAnswer = "";

        if (target.name === "hour") {
            const minuteStart = prevValue.indexOf(":");
            const minuteEnd = prevValue.indexOf("-");
            const minute = prevValue.substring(minuteStart + 1, minuteEnd);
            let hour = 1;
            try {
                hour = Number(target.value);
                if (hour > 12) hour = 12;
                if (hour < 1) hour = 1;
                if (Number(target.value) !== hour) updateInput("hour", hour);
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
                if (minute > 30) minute = 30;
                if (minute < 0) minute = 0;
                if (minute === 3) minute = 30;
                if (minute !== 0 && minute !== 30)
                    minute > 15 ? (minute = 30) : (minute = 0);
                if (Number(target.value) !== minute)
                    updateInput("minute", minute);
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
            `00:00-${getDefaultMeridian(defaultValue, meridian)}`;

        const time = prevValue.split("-")[0];
        const newAnswer = `${time}-${meridianParam}`;
        onUpdateAnswer({
            id,
            value: newAnswer,
            error: "",
        });
    }
    ("");
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
            {label && <p>{label}</p>}
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
                        defaultValue={getDefaultHourValue(defaultValue)}
                        step={h.step}
                    ></input>
                </div>
                <p>:</p>
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
                        defaultValue={getDefaultMinuteValue(defaultValue)}
                        step={m.step}
                    ></input>
                </div>
                <TimeSelect
                    isAm={getDefaultMeridian(defaultValue, meridian) === "AM"}
                    onMeridiemChange={updateMeridian}
                ></TimeSelect>
            </div>
        </div>
    );
};

export default InputTime;
