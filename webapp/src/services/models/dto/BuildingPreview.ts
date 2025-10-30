import {Listable} from "../interfaces/Listable.ts";
import {getTheme} from "../../helpers/filters/ThemesList.ts";
import {Mappable} from "../interfaces/Mappable.ts";
import {GeoJSON, LatLng} from "leaflet";
import {Building} from "../Building.ts";

export class BuildingPreview implements Listable, Mappable {

    id: string
    name: string;
    theme: string;
    importance: number;
    latitude : number;
    longitude : number;
    town: string;
    remainingShares: number;

    constructor(id: string, name: string, theme: string, importance: number, latitude: number, longitude: number, town : string, remainingShares: number) {
        this.id = id;
        this.name = name;
        this.theme = theme;
        this.importance = importance;
        this.latitude = latitude;
        this.longitude = longitude;
        this.town = town;
        this.remainingShares = remainingShares;
    }

    getColumns(): string[] {
        return ["Nom du batiment", "Ville", "Theme", "Parts"];
    }

    getId(): string {
        return this.id;
    }

    getEntriesValues(): string[] {
        return [this.name, this.town, getTheme(this.theme)?.displayName ?? "Na", Building.calculateShareString(this.remainingShares)];
    }

    getCoordinates(): LatLng {
        return new LatLng(this.latitude, this.longitude);
    }

    getGeometry(): GeoJSON | undefined {
        return undefined;
    }

    getSmallEntriesValues(): string[] {
        return [getTheme(this.theme)?.displayName ?? "Na", Building.calculateShareString(this.remainingShares)];
    }

    getTitle(): string {
        return this.name;
    }
}