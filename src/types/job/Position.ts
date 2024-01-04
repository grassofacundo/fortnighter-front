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
    hourPrice: priceStructure;
    workdayTimes?: {
        regular: {
            normal: {
                start: number;
                end: number;
            };
            overtime: {
                start: number;
                end: number;
            };
            length: number;
        };
        saturday: {
            normal: {
                start: number;
                end: number;
            };
            overtime: {
                start: number;
                end: number;
            };
            length: number;
        };
        sunday: {
            normal: {
                start: number;
                end: number;
            };
            overtime: {
                start: number;
                end: number;
            };
            length: number;
        };
        holiday: {
            normal: {
                start: number;
                end: number;
            };
            overtime: {
                start: number;
                end: number;
            };
            length: number;
        };
    };

    paymentLapse: number;
    nextPaymentDate: T;
    companyName?: string;
}

/**
 * Job position type
 *
 * @property id - string
 * @property name - string
 * @property hourPrice - number
 * @property paymentLapse - number
 * @property nextPaymentDate - Date
 * @property companyName? - string
 */
export interface jobPosition extends baseJobPosition<Date> {
    id: string;
}

export interface dbJobPosition extends baseJobPosition<string> {
    id: string;
}

export type priceStructure = {
    regular: hourPriceType;
    saturday?: hourPriceType;
    sunday?: hourPriceType;
    holiday?: hourPriceType;
};
export type hourPriceType = {
    normal: number;
    overtime?: number;
    overwork?: number;
};
