type fetchApi = {
    url: string;
    method?: method;
    contentType?: contentType;
    body?: unknown;
};

type method = "GET" | "POST" | "PUT" | "DELETE";
type contentType = "application/x-www-form-urlencoded" | "application/json";
