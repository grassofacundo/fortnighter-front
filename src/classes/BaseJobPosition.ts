import { getAs24Format } from "../components/utils/form/blocks/time/select/TimeMethods";
import {
    hourStr12,
    minuteStr,
    time12Meridian,
} from "../components/utils/form/types/TimeType";
import FetchService from "../services/fetchService";
import { eventReturn } from "../types/database/databaseTypes";
import {
    priceStructure,
    workDayStructure,
    workDayType,
} from "../types/job/Position";

const baseUrl = `${import.meta.env.VITE_SERVER_DOMAIN}`;

export class BaseJob {
    name: string;
    hourPrice: priceStructure;
    workdayTimes: workDayStructure;
    paymentLapse: number;
    nextPaymentDate: Date;
    companyName?: string;

    constructor(job: {
        name: string;
        hourPrice: priceStructure;
        workdayTimes: workDayStructure;
        paymentLapse: number;
        nextPaymentDate: Date;
        companyName?: string;
    }) {
        this.name = job.name;
        this.hourPrice = job.hourPrice;
        this.workdayTimes = job.workdayTimes;
        this.paymentLapse = job.paymentLapse;
        this.nextPaymentDate = job.nextPaymentDate;
        this.companyName = job.companyName;
    }

    /**
     * Create a new job position in the database
     *
     * @returns An eventReturn return object. If ok, the content will be the job ID.
     */
    async create(): Promise<eventReturn<string>> {
        const url = `${baseUrl}/job/create`;
        const method = "PUT";
        const body = { ...this };
        const response = await FetchService.fetchPost<string>({
            url,
            method,
            body,
        });
        return response;
    }

    getTime(
        type: workDayType,
        time: "start" | "end"
    ): time12Meridian | undefined {
        const workDayTime = this.workdayTimes[type];
        if (!workDayTime) return;
        const selectedTime =
            time === "start" ? workDayTime.startTime : workDayTime.endTime;
        const meridian =
            time === "start"
                ? workDayTime.startMeridian
                : workDayTime.endMeridian;
        return `${selectedTime}-${meridian}` as time12Meridian;
    }

    getHour(type: workDayType, time: "start" | "end"): hourStr12 | undefined {
        const workDayTime = this.workdayTimes[type];
        if (!workDayTime) return;
        const selectedTime =
            time === "start" ? workDayTime.startTime : workDayTime.endTime;
        const hour = selectedTime.split(":")[0];
        return hour as hourStr12;
    }

    getMinute(type: workDayType, time: "start" | "end"): minuteStr | undefined {
        const workDayTime = this.workdayTimes[type];
        if (!workDayTime) return;
        const selectedTime =
            time === "start" ? workDayTime.startTime : workDayTime.endTime;
        const hour = selectedTime.split(":")[1];
        return hour as minuteStr;
    }

    workOvernight(type: workDayType): boolean {
        const workDayTime = this.workdayTimes[type];
        if (!workDayTime) return false;
        const hour1 = getAs24Format(
            `${workDayTime.startTime}-${workDayTime.startMeridian}`
        );
        const hour2 = getAs24Format(
            `${workDayTime.endTime}-${workDayTime.endMeridian}`
        );
        return hour1 >= hour2;
    }

    getLength(type: workDayType): number {
        const workDayTime = this.workdayTimes[type];
        if (!workDayTime) return 0;

        return workDayTime.length;
    }
}
