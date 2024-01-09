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
};

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

export type workDayType = "regular" | "saturday" | "sunday" | "holiday";
type workDayFields = {
    startTime: time;
    startMeridian: "AM" | "PM";
    endTime: time;
    endMeridian: "AM" | "PM";
    length: number;
};
export type workDayStructure = {
    regular: workDayFields;
    saturday?: workDayFields;
    sunday?: workDayFields;
    holiday?: workDayFields;
};

type minute = "00" | "30";
type hour =
    | "00"
    | "01"
    | "02"
    | "03"
    | "04"
    | "05"
    | "06"
    | "07"
    | "08"
    | "09"
    | "10"
    | "11"
    | "12";
type time = `${hour}:${minute}`;
