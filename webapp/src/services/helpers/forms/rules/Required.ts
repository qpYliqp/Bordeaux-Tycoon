import {Rule} from "./Rule.ts";

export class Required implements Rule {
    validate(value: any): boolean {
        return value !== undefined && value !== null;
    }

    getDescription(name: string): string {
        return `Le champs ${name} ne doit pas être vide`;
    }
}