export interface Rule {
    getDescription(name : string) : string
    validate(value : any) : boolean
}