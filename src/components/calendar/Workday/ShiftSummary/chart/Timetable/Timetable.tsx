//#region Dependency list
import {
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useState,
    useRef,
} from "react";
import { paymentTypes, priceAndHours } from "../../../../../../types/job/Shift";
import Tooltip from "../../../../../utils/tooltip/Tooltip";
import { Shift } from "../../../../../../classes/shift/Shift";
import { timelines } from "../../ShiftSummary";
import style from "./Timetable.module.scss";
//#endregion

type thisProps = {
    payInfo: Partial<Record<paymentTypes, priceAndHours>>;
    missingInfo: boolean;
    shift: Shift;
    onSetActiveTimeline: Dispatch<SetStateAction<"" | timelines>>;
};

const Timetable: FunctionComponent<thisProps> = ({
    payInfo,
    missingInfo,
    shift,
    onSetActiveTimeline,
}) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const warningSign = useRef(null);
    const delayValue = 50;
    const times = [
        {
            name: "regular" as timelines,
            value: payInfo.regular?.hours ? payInfo.regular.hours : 0,
        },
        {
            name: "overtime" as timelines,
            value: payInfo.overtime?.hours ? payInfo.overtime.hours : 0,
        },
        {
            name: "overwork" as timelines,
            value: payInfo.overwork?.hours ? payInfo.overwork.hours : 0,
        },
    ];

    function hoursAsArray(hours: number): number[] {
        let hasHalfAnHour = false;
        if (`${hours}`.indexOf(".5") > -1) {
            hours = hours - 0.5;
            hasHalfAnHour = true;
        }

        const hoursArr = [];
        for (let i = 0; i < hours; i++) {
            hoursArr.push(0);
        }
        if (hasHalfAnHour) hoursArr.push(1);
        return hoursArr;
    }

    function getDelay(index: number) {
        let delay = 0;
        if (index === 1) {
            const regular = times[0];
            delay = delay + regular.value * delayValue;
        }
        if (index === 2) {
            const regular = times[0];
            const overtime = times[1];
            delay =
                delay +
                regular.value * delayValue +
                overtime.value * delayValue;
        }
        return delay;
    }

    return (
        <div
            className={style.timeline}
            onMouseLeave={() => onSetActiveTimeline("")}
        >
            {missingInfo && (
                <div
                    ref={warningSign}
                    className={style.warning}
                    onMouseOver={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <span>!</span>
                    {showTooltip && warningSign.current && (
                        <Tooltip
                            text={`Using "week" info, since "${shift.getTypeDay()}" work time and hour price is not set in job information`}
                            element={warningSign.current as HTMLElement}
                        />
                    )}
                </div>
            )}

            {times.map((time, index) => {
                return (
                    time.value > 0 && (
                        <div
                            key={index}
                            className={`${style[time.name]} ${style.section}`}
                        >
                            {hoursAsArray(time.value).map((t, i) => (
                                <div
                                    className={`${style.timestamp} ${
                                        t === 1 ? style.half : ""
                                    }`}
                                    style={{
                                        animationDelay: `${
                                            getDelay(index) + i * delayValue
                                        }ms`,
                                    }}
                                    key={i}
                                    onMouseOver={() =>
                                        onSetActiveTimeline(time.name)
                                    }
                                ></div>
                            ))}
                        </div>
                    )
                );
            })}
        </div>
    );
};

export default Timetable;
