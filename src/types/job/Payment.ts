export interface paymentBase {
    amount: number;
    startDate: Date;
    endDate: Date;
}

export interface payment extends paymentBase {
    id: string;
}
