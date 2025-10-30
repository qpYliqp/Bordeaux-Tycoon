import {ApiService} from "./ApiService.ts";
import {AuthService} from "../authentication/AuthService.ts";
import {QueryParam} from "../helpers/QueryParam.ts";

export class SecuredApiService extends ApiService {
    private authentication : AuthService;

    constructor(controller? : string) {
        super(controller);
        this.authentication = AuthService.getInstance();
        this.sharedHeader.set('Authorization',`Bearer ${this.authentication.getSessionJWT()}`);
    }

    private interceptFailedJWT(response : Response | undefined) : void {
        if (response !== undefined && response.status === 401) {
            this.authentication.logout();
        }
    }

    async get(path? : string, params? : QueryParam[]) {
        const response = await super.get(path,params);
        this.interceptFailedJWT(response);
        return response;
    }

    async post(body : Object, path? : string, params? : QueryParam[]) {
        const response = await super.post(body, path, params);
        this.interceptFailedJWT(response);
        return response;
    }

    async put(body : Object, path? : string, params? : QueryParam[]) {
        const response = await super.put(body, path, params);
        this.interceptFailedJWT(response);
        return response;
    }

    async delete(body?: Object,path? : string, params? : QueryParam[]) {
        const response = await super.delete(body,path, params);
        this.interceptFailedJWT(response);
        return response;
    }

}