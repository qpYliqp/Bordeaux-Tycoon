import {Rule} from "./rules/Rule.ts";

export class InputDescriptor {
    inputName : string;
    inputValue;
    rules : Rule[];

    constructor(inputName : string, inputValue : any, rules : Rule[]) {
        this.rules = rules;
        this.inputValue = inputValue;
        this.inputName = inputName;
    }

    updateValue(newValue : any) : InputDescriptor {
        this.inputValue = newValue;
        return this;
    }

    validate() : string[] {
        const errors : string[] = [];

        for(let i : number = 0; i < this.rules.length; i++) {
            if(!this.rules[i].validate(this.inputValue)) {
                errors.push(this.rules[i].getDescription(this.inputName));
            }
        }
        return errors;
    }
}