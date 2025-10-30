import {BuildingTheme} from "./BuildingTheme.ts";

export class FilterEntryProperties {
    theme : BuildingTheme;
    state : boolean;

    constructor(theme : BuildingTheme) {
        this.theme = theme;
        this.state = true;
    }

    setState(state : boolean) {
        this.state = state;
    }
}