import { input } from "../../components/utils/form/FormTypes";

export interface user extends input {
    id: string;
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
    user: user;
};

export type authError = "autherror";
