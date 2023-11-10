export interface eventReturn<contentType> {
    ok: boolean;
    status: number;
    content?: contentType;
    error?: {
        message: string;
        content?: unknown;
    };
}
