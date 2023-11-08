interface EventReturn {
    ok: boolean;
    status: number;
    errorMessage: string;
    content?: unknown;
}

enum Collections {
    position = "job-positions",
}
