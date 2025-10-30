import {ApiCall} from "./ApiCall.ts";
import {QueryParam} from "../helpers/QueryParam.ts";

export class ApiService implements ApiCall {
    private readonly baseUrl : URL;
    private readonly controller : string | undefined;
    protected readonly sharedHeader : Headers;


    constructor(controller? : string) {
        this.controller = controller;
        this.baseUrl = new URL("/api/",import.meta.env.VITE_API_URL);
        this.sharedHeader = new Headers();
        this.sharedHeader.append("Content-Type","application/json");
    }

    /**
     * Concatenate all the composing members of the URL.
     * IMPORTANT : path starting character is not a slash character
     *
     * @param path (Optional) will be used as a follow-up path to call the API
     * @param params
     */
    private generateUrl(path? : string, params? : QueryParam[]) : URL {
        return new URL(`${this.controller ?? ''}${path ? "/"+path : ''}${this.unfoldParams(params)}`,this.baseUrl);
    }

    private unfoldParams(params? : QueryParam[]) : string {
        let result = "";
        for (let i = 0; i < (params?.length ?? 0); i++) {
            if(i === 0) {
                result += `?${params![i].get()}`
            } else {
                result += `&${params![i].get()}`
            }
        }
        return result;
    }

    async get(path?: string, params? : QueryParam[]): Promise<Response | undefined> {
        try {
            return fetch(this.generateUrl(path, params), {
                method: "GET",
                headers: this.sharedHeader
            });
        } catch {
            return undefined;
        }

    }

    async post(body: Object, path?: string, params? : QueryParam[]): Promise<Response | undefined> {
        try {
            return fetch(this.generateUrl(path,params), {
                method: "POST",
                headers: this.sharedHeader,
                body: JSON.stringify(body)
            });
        } catch {
            return undefined;
        }
    }

    async put(body: Object, path?: string, params? : QueryParam[]): Promise<Response | undefined> {
        try {
            return await fetch(this.generateUrl(path,params),{
                method: "PUT",
                headers: this.sharedHeader,
                body: JSON.stringify(body)
            })
        } catch {
            return undefined;
        }
    }

    async delete(body?: Object,path?: string, params? : QueryParam[]): Promise<Response | undefined> {
        try {
            return await fetch(this.generateUrl(path,params), {
                method: "DELETE",
                headers: this.sharedHeader,
                body: JSON.stringify(body)
            })
        } catch {
            return undefined;
        }
    }

}