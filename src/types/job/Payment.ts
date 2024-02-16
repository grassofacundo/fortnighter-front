import { Modifier } from "../../classes/modifier/Modifier";
import { Shift } from "../../classes/shift/Shift";
import { priceStructure } from "./Position";

export interface paymentBaseInterface<dateType> {
    startDate: dateType;
    endDate: dateType;
}

export interface paymentBase extends paymentBaseInterface<Date> {
    hourPrice: priceStructure;
    modifiers: Modifier[];
    shifts: Shift[];
    jobId: string;
}

export interface payment extends paymentBase {
    id: string;
}

export interface paymentDb extends paymentBaseInterface<string> {
    id: string;
    hourPrice: priceStructure;
    modifiers: Modifier[];
    shifts: Shift[];
    jobId: string;
}
