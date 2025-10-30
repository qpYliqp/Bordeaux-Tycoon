import {GeoJSON, LatLng} from "leaflet";

export interface Mappable {
    getId() : string;
    getCoordinates() : LatLng
    getGeometry() : GeoJSON | undefined
}