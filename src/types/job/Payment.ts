import { Modifier } from "../../classes/modifier/Modifier";
import { Shift } from "../../classes/shift/Shift";
import { priceStructure } from "./Position";

export interface paymentBase {
    startDate: Date;
    endDate: Date;
    hourPrice: priceStructure;
    modifiers: Modifier[];
    shifts: Shift[];
    jobId: string;
}

export interface payment extends paymentBase {
    id: string;
}
