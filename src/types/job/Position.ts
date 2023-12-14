import { payment } from "./Payment";

/**
 * Base job position type
 *
 * @property name - string
 * @property hourPrice - number
 * @property paymentLapse - number
 * @property nextPaymentDate - Date | string
 * @property companyName? - string
 * @property description? - string
 * @property address? - string
 */
export interface baseJobPosition<T> {
    name: string;
    hourPrice: number;
    paymentLapse: number;
    nextPaymentDate: T;
    companyName?: string;
    description?: string;
    address?: string;
}

export interface jobPosition extends baseJobPosition<Date> {
    id: string;
}

export interface dbJobPosition extends baseJobPosition<string> {
    id: string;
}
