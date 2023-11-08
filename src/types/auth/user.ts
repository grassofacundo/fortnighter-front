interface user extends input {
    email: string;
    name?: string;
    job?: string;
}

type credentials = {
    email: string;
    password: string;
};

type signUpResponse = {
    message: string;
    userId: string;
};

type logInResponse = {
    token: string;
    user: user;
};

type authError = "autherror";
