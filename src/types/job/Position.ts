import { time12 } from "../../components/utils/form/types/TimeType";
import { newModifierObj } from "./Modifiers";

/**
 * Database job position type
 *
 * @property name - string
 * @property hourPrice - number
 * @property paymentLapse - number
 * @property nextPaymentDate - string
 * @property companyName? - string
 * @property description? - string
 * @property address? - string
 */
export type dbJobPositionType = {
    id: string;
    name: string;
    hourPrice: priceStructure;
    workdayTimes: workDayStructure;
    paymentLapse: number;
    nextPaymentDate: string;
    companyName?: string;
    modifiers: newModifierObj[];
};

export type priceStructure = {
    week: hourPriceType;
    saturday?: hourPriceType;
    sunday?: hourPriceType;
    holiday?: hourPriceType;
};
export type hourPriceType = {
    regular: number;
    overtime?: number;
    overwork?: number;
};

export type workDayType = "week" | "saturday" | "sunday" | "holiday";
export type workDayStructure = {
    week: workDayFields;
    saturday?: workDayFields;
    sunday?: workDayFields;
    holiday?: workDayFields;
};
type workDayFields = {
    startTime: time12;
    startMeridian: "AM" | "PM";
    endTime: time12;
    endMeridian: "AM" | "PM";
    length: number;
};
