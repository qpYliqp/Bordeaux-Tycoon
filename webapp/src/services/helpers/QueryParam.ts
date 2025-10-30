export class QueryParam {
    name : string;
    value : string;

    constructor(name : string, value : string) {
        this.name = name;
        this.value = value;
    }

    get() : string {
         return `${this.name}=${this.value}`;
    }
}