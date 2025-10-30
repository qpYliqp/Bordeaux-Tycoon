import {ApiService} from "../api/ApiService.ts";
import {Login} from "../models/dto/Login.ts";
import {Register} from "../models/dto/Register.ts";
import {User} from "../models/User.ts";
import {toast} from "react-toastify";
import {toastResponseError} from "../helpers/ErrorHandler.ts";

export class AuthService {

    private static instance : AuthService;
    private authApi : ApiService;

    private constructor() {
        this.authApi = new ApiService('users');
    }

    static getInstance (): AuthService {
        if (this.instance) {
            return this.instance;
        }
        return new AuthService();
    };

    async login(loginData: Login): Promise<boolean> {
        const response = await this.authApi.post(loginData, "auth");
        if (response !== undefined && response.ok && response.status !== 404 && response.headers.has("Authorization")) {
            // Remove bearer from header
            localStorage.setItem('jwt', response.headers.get("Authorization")!.substring(7));
            const json = await response.json();
            localStorage.setItem('user', JSON.stringify(json));
            window.dispatchEvent(new Event('auth-change'));
            return true;
        } else if(response?.status === 400) {
            toast.error("Email ou mot de passe invalide");
        } else {
            toastResponseError(response);
        }
        return false;
    }

    async register(data : Register) {
        const response = await this.authApi.post(data);
        toastResponseError(response);
        return response !== undefined && response.ok && response.status !== 404;
    }

    logout() {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('auth-change'));
        window.location.reload(); // Auth interceptor should redirect to login
    }

    isConnected() : boolean {
        return this.getSessionJWT() !== null;
    }

    getSessionJWT() : string | null {
        return localStorage.getItem("jwt");
    }

    getUser() : User | null {
        const user = localStorage.getItem("user");

        if(user === null) {
            this.logout();
            return null;
        }

        try {
            const json = JSON.parse(user)
            return new User(json.id, json.email, json.username, json.money,json.rank,json.buildingCount,json.hourlyIncome);
        } catch {
            this.logout();
            return null;
        }
    }


    setUser(user: User): void {
        try {
            const userJson = JSON.stringify({
                id: user.id,
                email: user.email,
                username: user.name,
                money: user.money,
                buildingCount: user.buildingCount,
                rank: user.rank,
                hourlyIncome: user.hourlyIncome
            });
            localStorage.setItem("user", userJson);
        } catch (error) {
            console.error("Failed to set user in localStorage:", error);
            this.logout();
        }
    }
}