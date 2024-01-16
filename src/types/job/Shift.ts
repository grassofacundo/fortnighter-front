import { hourNum } from "../dateService";
import { workDayType } from "./Position";

export interface shiftDb {
    id: string;
    isHoliday: boolean;
    startTime: string;
    endTime: string;
}

export type forcedPayInfoStructure = Partial<
    Record<workDayType, paymentInfoType>
>;
export type paymentInfoType = {
    payInfo: Partial<Record<paymentTypes, priceAndHours>>;
    total: number;
};
export type paymentTypes = "regular" | "overtime" | "overwork";
export type priceAndHours = {
    price: number;
    hours: hourNum;
};
