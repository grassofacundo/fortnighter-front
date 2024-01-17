//#region Dependency list
import { FunctionComponent } from "react";
import { paymentTypes, priceAndHours } from "../../../../../../types/job/Shift";
import { timelines } from "../../ShiftSummary";
import style from "./InfoSection.module.scss";
//#endregion

type thisProps = {
    payInfo?: Partial<Record<paymentTypes, priceAndHours>>;
    activeTimeline?: "" | timelines;
    total: number;
    totalIsForced?: boolean;
};

const InfoSection: FunctionComponent<thisProps> = ({
    payInfo,
    activeTimeline,
    total,
    totalIsForced,
}) => {
    const times = [
        {
            name: "regular" as timelines,
            value: payInfo?.regular,
        },
        {
            name: "overtime" as timelines,
            value: payInfo?.overtime,
        },
        {
            name: "overwork" as timelines,
            value: payInfo?.overwork,
        },
    ];

    return (
        <div className={style.payInfoSection}>
            {times.map((time, i) => {
                return (
                    !!time.value?.price &&
                    !!time.value?.hours &&
                    time.value.hours > 0 && (
                        <p
                            key={i}
                            className={`${style.infoPayText} ${
                                activeTimeline === time.name ? style.active : ""
                            }`}
                        >{`Worked ${time.value.hours} ${time.name} hours, $${time.value.price} each hour`}</p>
                    )
                );
            })}

            <p className={style.totalText}>{`${
                totalIsForced ? "Forced total" : "Total"
            }: $${total}`}</p>
        </div>
    );
};

export default InfoSection;
