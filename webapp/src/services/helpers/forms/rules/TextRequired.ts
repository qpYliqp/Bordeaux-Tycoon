import {Required} from "./Required.ts";

export class TextRequired extends Required {
    validate(value: any): boolean {
        return super.validate(value) && value.replace(/\s/g, '').length !== 0;
    }
}