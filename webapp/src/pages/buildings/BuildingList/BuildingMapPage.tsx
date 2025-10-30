import {Component} from "react";
import {Map} from "../../../components/map/Map.tsx";
import {LatLng} from "leaflet";
import {SecuredApiService} from "../../../services/api/SecuredApiService.ts";
import {toastResponseError} from "../../../services/helpers/ErrorHandler.ts";
import {BuildingPreview} from "../../../services/models/dto/BuildingPreview.ts";
import {SmallObjectList} from "../../../components/lists/containers/SmallObjectList.tsx";
import {Mappable} from "../../../services/models/interfaces/Mappable.ts";
import {Navigate} from "react-router-dom";

export class BuildingMapPage extends Component {

    state: {
        buildings: BuildingPreview[],
        visible: BuildingPreview[],
        markerSelect?: LatLng,
        selectedId?: string,
        redirectToBuilding?: string
    } = {
        buildings: [],
        visible: [],
        markerSelect: undefined,
        selectedId: undefined,
        redirectToBuilding: undefined
    }

    componentDidMount() {
        this.getBuildings();
    }

    async getBuildings() {
        const api = new SecuredApiService('buildings');
        const response: Response | undefined = await api.get(undefined);
        toastResponseError(response);
        if (response === undefined) {
            return;
        }

        const json = await response.json();
        const result: BuildingPreview[] = [];
        json.forEach((b) => result.push(new BuildingPreview(b.id,b.name,b.theme,b.importance,b.latitude,b.longitude,b.town,b.remainingShares)));
        this.setState({
            buildings: result,
            visible: result
        });
    }

    handleUpdate = (visible: Mappable) => {
        this.setState({
            visible: visible
        })
    }

    handleHoverEnter = (id: string) => {
        const building = this.state.visible.find((b) => b.id == id)
        this.setState({
            markerSelect: building?.getCoordinates()
        })
    }

    handleHoverExit = () => {
        this.setState({
            markerSelect: undefined
        })
    }

    handleSelection = (id: string) => {
        this.setState({
            selectedId: this.state.selectedId ? (this.state.selectedId === id ? undefined : id) : id
        })
    }

    handleInteract = (id: string) => {
        this.setState({
            redirectToBuilding: id
        })
    }

    render() {
        return (
            <div className={"frame"}>
                <SmallObjectList items={this.state.visible} onHoverEnter={this.handleHoverEnter}
                                 onHoverExit={this.handleHoverExit} selectedId={this.state.selectedId}
                                 onInteract={this.handleInteract}/>
                <Map zoom={12} center={new LatLng(44.83360, -0.57421)} items={this.state.buildings}
                     externalUpdate={this.handleUpdate} selectedMarker={this.state.markerSelect}
                     select={this.handleSelection}/>
                {this.state.redirectToBuilding &&
                    <Navigate state={this.state} to={`/building/${this.state.redirectToBuilding}`}/>}
            </div>
        );
    }
}