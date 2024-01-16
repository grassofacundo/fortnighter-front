//#region Dependency list
import { FunctionComponent, useState } from "react";
import { paymentInfoType } from "../../../../../types/job/Shift";

import Timetable from "../Timetable/Timetable";
import InfoSection from "../InfoSection/InfoSection";
import { workDayType } from "../../../../../types/job/Position";
import { Shift } from "../../../../../classes/Shift";
import style from "./Chart.module.scss";
import { timelines } from "../ShiftSummary";
//#endregion

type thisProps = {
    payInfo: paymentInfoType;
    typeDay: workDayType;
    shift: Shift;
};

const Chart: FunctionComponent<thisProps> = ({ payInfo, typeDay, shift }) => {
    const [activeTimeline, setActiveTimeline] = useState<timelines | "">("");

    return (
        <div className={style.chart}>
            <Timetable
                payInfo={payInfo.payInfo}
                shift={shift}
                missingInfo={typeDay !== shift.getTypeDay()}
                onSetActiveTimeline={setActiveTimeline}
            />

            <InfoSection
                payInfo={payInfo.payInfo}
                activeTimeline={activeTimeline}
                total={payInfo.total}
            />
        </div>
    );
};

export default Chart;
