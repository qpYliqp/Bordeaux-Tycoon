import {Mappable} from "./interfaces/Mappable.ts";
import {GeoJSON, LatLng} from "leaflet";

export class Building implements Mappable {

    id : string
    name : string;
    theme : string;
    price: number;
    importance: number;
    town: string;
    status: string;
    subTheme: string;
    latitude : number;
    longitude : number;
    originalId : string;
    share : number;

    constructor(id : string, name : string, theme : string, importance : number, town:string, status : string, subTheme : string, latitude : number, longitude : number, originalId : string,value : number,share : number) {
        this.id = id;
        this.name = name;
        this.theme = theme;
        this.price = value;
        this.importance = importance;
        this.town = town;
        this.status = status;
        this.subTheme = subTheme;
        this.latitude = latitude;
        this.longitude = longitude;
        this.originalId = originalId;
        this.share = share;
    }

    static calculateShareString(share : number) : string {
        return (share / 100).toString() + "%";
    }

    getCoordinates(): LatLng {
        return new LatLng(this.latitude,this.longitude);
    }

    getId(): string {
        return this.id;
    }

    getGeometry(): GeoJSON | undefined {
        return undefined;
    }
}