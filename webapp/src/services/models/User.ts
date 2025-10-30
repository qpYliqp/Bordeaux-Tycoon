export class User {
    id : string;
    email : string;
    name : string;
    money : number;
    buildingCount : number;
    rank : number;
    hourlyIncome : number;


    constructor(id : string, email : string, name : string, money: number,rank: number, buildingCount: number, hourlyIncome: number) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.money =  Math.floor(money);
        this.buildingCount = buildingCount
        this.rank = rank;
        this.hourlyIncome = Math.floor(hourlyIncome);
    }

    getAbreviationName(): string {
        return this.name.slice(0, 2).toUpperCase();
    }

    // formatNumber(money : number) : string
    // {
    //     return money.toLocaleString();
    // }

}