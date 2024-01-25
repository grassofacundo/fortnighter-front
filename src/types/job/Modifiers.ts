export type optionName = "shift" | "payment" | "amount";
export type optionItem = {
    id: optionName;
    description: string;
    example: string[];
};

export type options = optionItem[];
