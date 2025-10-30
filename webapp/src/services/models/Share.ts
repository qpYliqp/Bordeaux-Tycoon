import { User } from "./User";

export class Share
{
    amount : number;
    owner : User;

    constructor(amount: number,owner:User)
    {
        this.amount = amount;
        this.owner = owner;
    }
}