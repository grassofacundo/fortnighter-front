//#region Dependency list
import { FunctionComponent, useState } from "react";
import { paymentInfoType } from "../../../../../types/job/Shift";

import Timetable from "./Timetable/Timetable";
import InfoSection from "./InfoSection/InfoSection";
import { workDayType } from "../../../../../types/job/Position";
import { Shift } from "../../../../../classes/shift/Shift";
import style from "./Chart.module.scss";
import { timelines } from "../ShiftSummary";
import PriceSection from "./priceSection/PriceSection";
import InOutAnim from "../../../../utils/InOutAnim";
//#endregion

type thisProps = {
    payInfo: paymentInfoType;
    typeDay: workDayType;
    shift: Shift;
    id: string;
    onEnd(shift: Shift): void;
};

const Chart: FunctionComponent<thisProps> = ({
    payInfo,
    typeDay,
    shift,
    id,
    onEnd,
}) => {
    const [activeTimeline, setActiveTimeline] = useState<timelines | "">("");
    const [showPriceSection, setShowPriceSection] = useState<boolean>(false);

    return (
        <div className={style.chart}>
            <Timetable
                payInfo={payInfo.payInfo}
                shift={shift}
                missingInfo={typeDay !== shift.getTypeDay()}
                onSetActiveTimeline={setActiveTimeline}
            />

            <div className={style.infoAndPriceSection}>
                <InfoSection
                    payInfo={payInfo.payInfo}
                    activeTimeline={activeTimeline}
                    total={payInfo.total}
                />
                <p className={style.showPriceText}>
                    Is the total incorrect? You can manually set the total{" "}
                    <button
                        onClick={() => setShowPriceSection((bool) => !bool)}
                    >
                        here
                    </button>
                </p>
                <InOutAnim inState={showPriceSection} unmountOnExit={false}>
                    <PriceSection shift={shift} id={id} onEnd={onEnd} />
                </InOutAnim>
            </div>
        </div>
    );
};

export default Chart;
