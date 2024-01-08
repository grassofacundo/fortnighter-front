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
export type workDayStructure = {
    regular: workDayType;
    saturday?: workDayType;
    sunday?: workDayType;
    holiday?: workDayType;
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

export type workDayType = {
    startTime: time;
    startMeridian: "AM" | "PM";
    endTime: time;
    endMeridian: "AM" | "PM";
    length: number;
};
