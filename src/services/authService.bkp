import { FirebaseApp } from "firebase/app";
import {
    Auth,
    User,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import dbService from "./dbService";

interface AuthParams {
    username: string;
    password: string;
    //callback?: SetStateAction;
}

let auth: Auth;
let firebaseApp: FirebaseApp;
let monitoringAuthChange: boolean;
let isTrustedDevice: boolean;

class AuthService {
    storageKey = "fortnighter-trusted-device";

    init(firebaseAppParam: FirebaseApp) {
        firebaseApp = firebaseAppParam;
        this.setAuth();
        isTrustedDevice = !!this.getILocalStorageTrustedDevice();
    }

    setAuth() {
        const authLocal = getAuth(firebaseApp);
        auth = authLocal;
    }

    getAuthService() {
        return auth;
    }

    trustDevice() {
        isTrustedDevice = true;
        localStorage.setItem(this.storageKey, isTrustedDevice.toString());
    }

    untrustDevice() {
        localStorage.removeItem(this.storageKey);
        isTrustedDevice = false;
    }

    getILocalStorageTrustedDevice() {
        const IsTrustedOnLocalStorage = localStorage.getItem(this.storageKey);

        return IsTrustedOnLocalStorage;
    }

    getIsTrustedDevice(): boolean {
        return !!isTrustedDevice;
    }

    async createUser(AuthParams: AuthParams): Promise<FirebaseEventReturn> {
        const response = {
            ok: true,
            errorMessage: "",
        };

        if (!auth) {
            response.ok = false;
            response.errorMessage = "Auth not yet initialized";
        }

        const { username, password } = AuthParams;

        await createUserWithEmailAndPassword(auth, username, password)
            .then(({ user }) => {
                if (user.email) dbService.setCollectionName(user.email);
            })
            .catch((error) => {
                response.ok = false;
                response.errorMessage = error.message;
                if (error.message.includes("email-already-in-use"))
                    response.errorMessage =
                        "Email is already in use, try logging in instead";
            });
        return response;
    }

    async logIn(AuthParams: AuthParams): Promise<FirebaseEventReturn> {
        const response = {
            ok: true,
            errorMessage: "",
        };

        if (!auth) {
            response.ok = false;
            response.errorMessage = "Auth not yet initialized";
        }

        const { username, password } = AuthParams;

        await signInWithEmailAndPassword(auth, username, password)
            .then(({ user }) => {
                if (user.email) dbService.setCollectionName(user.email);
            })
            .catch((error) => {
                response.ok = false;
                response.errorMessage = error.message;
                if (
                    error.message.includes("wrong-password") ||
                    error.message.includes("user-not-found")
                )
                    response.errorMessage = "Username or password is incorrect";
            });
        return response;
    }

    logOut() {
        dbService.clearCollectionName();
        auth.signOut();
    }

    getAuthState(onStateChange: Dispatch<SetStateAction<User | null>>): void {
        if (monitoringAuthChange) return;

        monitoringAuthChange = true;
        onAuthStateChanged(authService.getAuthService(), (user) => {
            if (user) {
                if (user.email) dbService.setCollectionName(user.email);
                onStateChange(user);
                // ...
            } else {
                dbService.clearCollectionName();
                onStateChange(null);
            }
        });
    }
}

const authService = new AuthService();
export default authService;
