import {BuildingPreview} from "./BuildingPreview.ts";
import {Listable} from "../interfaces/Listable.ts";
import {Building} from "../Building.ts";
import {getTheme} from "../../helpers/filters/ThemesList.ts";

export class BuildingPlayerShare implements Listable {
    building : BuildingPreview;
    amount : number;

    constructor(building : BuildingPreview, amount : number) {
        this.building = building;
        this.amount = amount;
    }

    getColumns(): string[] {
        return ["Nom du batiment", "Ville", "Theme", "Restantes", "Détenues"];
    }

    getEntriesValues(): string[] {
        return [
            this.building.name,
            this.building.town,
            getTheme(this.building.theme)!.displayName,
            Building.calculateShareString(this.building.remainingShares),
            Building.calculateShareString(this.amount)
        ];
    }

    getId(): string {
        return this.building.id;
    }

    getSmallEntriesValues(): string[] {
        return [];
    }

    getTitle(): string {
        return this.building.name;
    }
}