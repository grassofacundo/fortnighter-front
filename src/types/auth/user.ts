import { input } from "../../components/utils/form/types/FormTypes";

export interface user extends input {
    email: string;
    name?: string;
    job?: string;
}

export type credentials = {
    email: string;
    password: string;
};

export type signUpResponse = {
    message: string;
    userId: string;
};

export type logInResponse = {
    token: string;
    user: user;
};

export type authError = "autherror";
