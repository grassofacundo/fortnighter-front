export type optionName = "shift" | "payment" | "amount";
export type optionItem = {
    id: optionName;
    description: string;
    example: string[];
};

export type options = optionItem[];

export type byShift = {
    forEvery: number;
};

export type byAmount = {
    moreThan: boolean;
    lessThan: boolean;
    daily: boolean;
    total: boolean;
    amount: number;
};

export type amountStructure = {
    increase: boolean;
    decrease: boolean;
    isPercentage: boolean;
    isFixed: boolean;
    amount: number;
};

export type newBaseModifierObj = {
    name: string;
    byShift?: byShift;
    byAmount?: byAmount;
    byPayment: boolean;
    amount: amountStructure;
    jobId: string;
};

export interface newModifierObj extends newBaseModifierObj {
    id: string;
}
