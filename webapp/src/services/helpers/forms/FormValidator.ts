import {InputDescriptor} from "./InputDescriptor.ts";

export class FormValidator {
    errors : string[]
    fields : InputDescriptor[];

    constructor(fields : InputDescriptor[]) {
        this.errors = [];
        this.fields = fields;
    }

    getErrors() : string [] {
        return this.errors;
    }

    validate() : boolean {
        this.errors = [];
        this.fields.forEach((input) => {
            input.validate().forEach((desc : string) => this.errors.push(desc))
        })
        return this.errors.length === 0;
    }


}