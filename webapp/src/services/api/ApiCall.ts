
/*
Considerations : path is only concatenated to base path,
if you want to include one or more IDs in the path, integrate it directly in the path string.
 */
import {QueryParam} from "../helpers/QueryParam.ts";

export interface ApiCall {
    get(path?: string, params? : QueryParam[]) : Promise<Response | undefined>
    post(body : Object, path? : string, params? : QueryParam[]) : Promise<Response | undefined>
    put(body : Object, path? : string, params? : QueryParam[]) : Promise<Response | undefined>
    delete(body?: Object,path? : string, params? : QueryParam[]) : Promise<Response | undefined>
}