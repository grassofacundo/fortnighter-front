//#region Dependency list
import { FunctionComponent, useState } from "react";
import { Shift } from "../../../../classes/Shift";
import { Job } from "../../../../classes/JobPosition";
import { paymentInfoType } from "../../../../types/job/Shift";
import { workDayType } from "../../../../types/job/Position";
import shiftService from "../../../../services/shiftService";
import style from "./ShiftSummary.module.scss";
//#endregion

type thisProps = {
    shift: Shift;
    job: Job;
};

const ShiftSummary: FunctionComponent<thisProps> = ({ shift, job }) => {
    const [week, setWeek] = useState<paymentInfoType>(getInfo("week"));
    const [sat, setSat] = useState<paymentInfoType>(getInfo("saturday"));
    const [sunday, setSunday] = useState<paymentInfoType>(getInfo("sunday"));
    const [holiday, setHoliday] = useState<paymentInfoType>(getInfo("holiday"));

    function getInfo(day: workDayType): paymentInfoType {
        const shiftDay = shift?.paymentInfo?.[day];
        if (shiftDay) return shiftDay;

        const jobDay = job.hourPrice?.[day];

        return {
            regular: {
                price: jobDay?.regular ?? 0,
                hours: shiftService.getRegularWorkedHours(shift, job, day),
            },
            // overtime: shiftDay?.overtime ?? {
            //     price: jobDay?.overtime ?? 0,
            //     hours: 0,
            // },
            // overwork: shiftDay?.overwork ?? {
            //     price: jobDay?.overwork ?? 0,
            //     hours: 0,
            // },
        };
    }

    return <>{week}</>;
};

export default ShiftSummary;
