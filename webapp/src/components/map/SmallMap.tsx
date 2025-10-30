import {Component} from "react";
import {Icon, LatLng} from "leaflet";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import red from "../../assets/icons/map/red-marker.png";

export class SmallMap extends Component<{marker?: LatLng, center: LatLng, zoom? : number}> {
    render() {
        return (
            <MapContainer center={this.props.center} zoom={this.props.zoom ?? 19} bounceAtZoomLimits={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.props.marker && <Marker icon={new Icon({
                    iconUrl: red,
                    iconSize: [32, 32]
                })} position={this.props.marker}/>}
            </MapContainer>
        );
    }
}