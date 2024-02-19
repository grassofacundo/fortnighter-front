import { Modifier } from "../../classes/modifier/Modifier";
import { Shift } from "../../classes/shift/Shift";
import { priceStructure, workDayStructure } from "./Position";

export interface paymentBaseInterface<dateType> {
    startDate: dateType;
    endDate: dateType;
}

export interface paymentDb extends paymentBaseInterface<string> {
    id: string;
    hourPrice: priceStructure;
    workdayTimes: workDayStructure;
    modifiers: Modifier[];
    shifts: Shift[];
    job: string; //jobId
}

export interface paymentBase extends paymentBaseInterface<Date> {
    hourPrice: priceStructure;
    workdayTimes: workDayStructure;
    modifiers: Modifier[];
    shifts: Shift[];
    jobId: string;
}

export interface payment extends paymentBase {
    id: string;
}
