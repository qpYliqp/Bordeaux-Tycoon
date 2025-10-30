import {BuildingTheme} from "./BuildingTheme.ts";
import education from "../../../assets/icons/buildings/themes/education.png";
import health from "../../../assets/icons/buildings/themes/health.png";
import sport from "../../../assets/icons/buildings/themes/sport.png";
import administration from "../../../assets/icons/buildings/themes/administration.png";
import security from "../../../assets/icons/buildings/themes/security.png";
import parc from "../../../assets/icons/buildings/themes/parc.png";
import transport from "../../../assets/icons/buildings/themes/transport.png";
import religion from "../../../assets/icons/buildings/themes/religion.png";
import elder from "../../../assets/icons/buildings/themes/elder.png";
import local from "../../../assets/icons/buildings/themes/local.png";
import metropole from "../../../assets/icons/buildings/themes/bordeauxMetropole.png";
import electricity from "../../../assets/icons/buildings/themes/electricity.png";
import culture from "../../../assets/icons/buildings/themes/culture.png";
import services from "../../../assets/icons/buildings/themes/services.png";
import kindergarten from "../../../assets/icons/buildings/themes/tmp_kindergarten.png";

export const themesList =
    [
        new BuildingTheme("A","Enseignement",education),
        new BuildingTheme("B","Santé",health),
        new BuildingTheme("C","Loisirs / Sport",sport),
        new BuildingTheme("D","Culture / Patrimoine",culture),
        new BuildingTheme("E","Administration",administration),
        new BuildingTheme("F","Services",services),
        new BuildingTheme("G","Sécurité",security),
        new BuildingTheme("H","Espaces urbain",parc),
        new BuildingTheme("J","Transports",transport),
        new BuildingTheme("K","Energie / Environnement",electricity),
        new BuildingTheme("L","Lieux de culte",religion),
        new BuildingTheme("M","Bordeaux Métropole",metropole),
        new BuildingTheme("N","Sénior",elder),
        new BuildingTheme("O","Batiments communaux",local),
        new BuildingTheme("P","Petite enfance",kindergarten)
    ];

export function getTheme(letter : string) {
        return themesList.find((theme) => theme.letter === letter);
}

export enum Theme {
    A = "Enseignement",
    B = "Santé",
    C = "Loisirs / Sport",
    D = "Culture / Patrimoine",
    E = "Administration",
    F = "Services",
    G = "Sécurité",
    H = "Espaces urbain",
    J = "Transports",
    K = "Energie / Environnement",
    L = "Lieux de culte",
    M = "Bordeaux Métropole",
    N = "Sénior",
    O = "Bâtiments communaux",
    P = "Petite enfance"
}

export function getThemeName(id: string)
{
    return Theme[id as keyof typeof Theme] || "";
    
}