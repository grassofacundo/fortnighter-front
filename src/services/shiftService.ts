import { BaseShift } from "../classes/BaseShift";
import { Job } from "../classes/JobPosition";
import { Shift } from "../classes/Shift";
import {
    dateAsTimeStructure,
    getAs24Format,
} from "../components/utils/form/blocks/time/select/TimeMethods";
import { hourNum } from "../types/dateService";
import { workDayType } from "../types/job/Position";
import { shiftDb } from "../types/job/Shift";
import { getDateAsInputValue, getPlainDate } from "./dateService";
import FetchService from "./fetchService";

class ShiftService {
    url = `${import.meta.env.VITE_SERVER_DOMAIN}`;

    getDateAfterStartAndEnd(startDate: Date, endDate: Date): Date {
        const start = getDateAsInputValue(startDate);
        const end = getDateAsInputValue(endDate);
        if (start === end) {
            return getPlainDate(startDate);
        } else {
            throw new Error("Couldn't get shift date");
        }
    }

    convertShiftFromDbToShift(shiftDb: shiftDb, jobId: string): Shift {
        const start = new Date(shiftDb.startTime);
        const end = new Date(shiftDb.endTime);
        const isHoliday = shiftDb.isHoliday;
        const shiftBase = new BaseShift(jobId, isHoliday, start, end);
        const shift = new Shift({ ...shiftBase, id: shiftDb.id });
        return shift;
    }

    async getShifts(
        startDate: Date,
        endDate: Date,
        positionId: string
    ): Promise<shiftDb[]> {
        const start: string = getDateAsInputValue(startDate);
        const end: string = getDateAsInputValue(endDate);
        const params = `?startDate=${start}&endDate=${end}&jobPositionId=${positionId}`;
        const url = `${this.url}/shift/get-shifts/${params}`;
        const response = await FetchService.fetchGet<shiftDb[]>(url);
        if (
            FetchService.isOk(response) &&
            response.content &&
            response.content.length > 0
        ) {
            return response.content;
        } else {
            return [];
        }
    }

    getRegularWorkedHours(shift: Shift, job: Job, day: workDayType): hourNum {
        const workDay = job.workdayTimes[day]?.startTime ? day : "week";

        const workShiftStartTime = job.getTime(workDay, "start") ?? `00:00-AM`; //Second condition should never happen
        const workShiftStart = getAs24Format(workShiftStartTime);
        const workShiftEndTime = job.getTime(workDay, "end") ?? `12:00-PM`; //Second condition should never happen
        const workShiftEnd =
            getAs24Format(workShiftEndTime) +
            (job.isOvernight(workDay) ? 24 : 0);

        const shiftStartTime = dateAsTimeStructure(shift.start);
        const shiftStart = getAs24Format(shiftStartTime);
        // const shiftEndTime = dateAsTimeStructure(shift.end);
        // const shiftEnd =
        //     getAs24Format(shiftEndTime) + (shift.isOvernight() ? 24 : 0);

        let regularHoursWorked: hourNum = 0;
        // if (shiftStart < workShiftStart && shiftEnd > workShiftEnd)
        //     return regularHoursWorked;

        const hoursWorked =
            shift.getHoursWorked() >= job.getLength(workDay)
                ? job.getLength(workDay)
                : shift.getHoursWorked();
        for (let i = 0; i < hoursWorked; i++) {
            const timeWorked = shiftStart + i;
            if (timeWorked >= workShiftStart && timeWorked <= workShiftEnd)
                regularHoursWorked++;
        }

        return regularHoursWorked as hourNum;
    }

    getOvertimeWorkedHours(shift: Shift, job: Job, day: workDayType): hourNum {
        const workDay = job.workdayTimes[day]?.startTime ? day : "week";

        const regularWorkedHours = this.getRegularWorkedHours(shift, job, day);
        if (regularWorkedHours >= job.getLength(workDay)) return 0;
        const newWorkDayLength = job.getLength(workDay) - regularWorkedHours;

        //const workShiftStartTime = job.getTime(workDay, "start") ?? `00:00-AM`; //Second condition should never happen
        // const workShiftStart =
        //     getAs24Format(workShiftStartTime) -
        //     (job.isOvernight(workDay) ? 24 : 0);
        //const workShiftEndTime = job.getTime(workDay, "end") ?? `12:00-PM`; //Second condition should never happen
        //const workShiftEnd = getAs24Format(workShiftEndTime);

        //const shiftStartTime = dateAsTimeStructure(shift.start);
        //const shiftStart = getAs24Format(shiftStartTime);
        // const shiftEndTime = dateAsTimeStructure(shift.end);
        // const shiftEnd =
        //     getAs24Format(shiftEndTime) + (shift.isOvernight() ? 24 : 0);

        //let overtimeHoursWorked: hourNum = 0;
        // if (shiftStart < workShiftStart && shiftEnd > workShiftEnd)
        //     return overtimeHoursWorked;

        const nonRegularWorkedHours =
            shift.getHoursWorked() - regularWorkedHours;
        const hoursWorked =
            nonRegularWorkedHours >= newWorkDayLength
                ? newWorkDayLength
                : nonRegularWorkedHours;

        // for (let i = 0; i < hoursWorked; i++) {
        //     const timeWorked = shiftStart + i;
        //     const afterEnd = timeWorked >= workShiftEnd;
        //     if (afterEnd && timeWorked <= workShiftStart + (afterEnd ? 24 : 0))
        //         overtimeHoursWorked++;
        // }

        return hoursWorked as hourNum;
    }

    getOverworkedHours(shift: Shift, job: Job, day: workDayType): hourNum {
        const workDay = job.workdayTimes[day]?.startTime ? day : "week";
        return shift.getHoursWorked() > job.getLength(workDay)
            ? ((shift.getHoursWorked() - job.getLength(workDay)) as hourNum)
            : 0;
    }
}

const shiftService = new ShiftService();
export default shiftService;
