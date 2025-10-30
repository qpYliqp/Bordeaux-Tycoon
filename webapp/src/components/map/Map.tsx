import {Component, memo} from "react";
import "./Map.css";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import {Icon, LatLng, LatLngBounds} from "leaflet";
import {Mappable} from "../../services/models/interfaces/Mappable.ts";
import 'react-leaflet-markercluster/styles'
import {MapEventHandlers} from "./MapEventHandlers.tsx";
import red from "../../assets/icons/map/red-marker.png";
import black from "../../assets/icons/map/black-marker.png";

export class Map extends Component<{
    items?: Mappable[],
    center: LatLng,
    zoom: number,
    externalUpdate?: Function,
    select?: Function,
    selectedMarker?: LatLng
}> {

    selectedIcon = new Icon({
        iconUrl: red,
        iconSize: [38, 38]
    });

    baseIcon = new Icon({
        iconUrl: black,
        iconSize: [32, 32]
    })

    // Advanced optimization to avoid unneccesary map rendering
    shouldComponentUpdate(nextProps: Readonly<{
        items?: Mappable[];
        center: LatLng;
        zoom: number;
        externalUpdate?: Function;
        select?: Function;
        selectedMarker?: LatLng
    }>, _nextState: Readonly<{}>, _nextContext: any): boolean {
        return (this.props.items !== nextProps.items) || (this.props.selectedMarker !== nextProps.selectedMarker);
    }

    handleMovement = (bounds: LatLngBounds) => {
        const visible = this.props.items?.filter((i) => bounds.contains(i.getCoordinates()));
        this.props.externalUpdate?.call(this, visible);
    }

    render() {
        return (
            <MapContainer center={this.props.center} zoom={this.props.zoom} bounceAtZoomLimits={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventHandlers handler={this.handleMovement}/>
                {!this.props.selectedMarker &&
                    <MarkerClusterGroup
                        chunkedLoading
                        disableClusteringAtZoom={18}
                    >
                        {this.props.items && this.props.items?.map((location) => (
                            <Marker key={location.getId()} position={location.getCoordinates()} eventHandlers={{
                                click: () => {
                                    this.props.select?.call(this, location.getId());
                                },
                            }} icon={this.baseIcon}></Marker>
                        ))}
                    </MarkerClusterGroup>
                }
                {this.props.selectedMarker && <Marker position={this.props.selectedMarker} icon={this.selectedIcon}/>}
            </MapContainer>
        );
    }
}