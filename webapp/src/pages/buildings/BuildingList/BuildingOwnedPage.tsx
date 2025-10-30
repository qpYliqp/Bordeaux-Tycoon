import {Component} from "react";
import {SecuredApiService} from "../../../services/api/SecuredApiService.ts";
import {AuthService} from "../../../services/authentication/AuthService.ts";
import {BuildingPreview} from "../../../services/models/dto/BuildingPreview.ts";
import {toastResponseError} from "../../../services/helpers/ErrorHandler.ts";
import {BuildingPlayerShare} from "../../../services/models/dto/BuildingPlayerShare.ts";
import {ObjectList} from "../../../components/lists/containers/ObjectList.tsx";
import {Navigate} from "react-router-dom";

export class BuildingOwnedPage extends Component {

    state = {
        buildings : [],
        buildingId : undefined
    }

    componentDidMount() {
        this.getPlayersBuildings();
    }

    async getPlayersBuildings() {
        const user = AuthService.getInstance().getUser();

        const api = new SecuredApiService("users/");
        const response = await api.get(user?.id + "/shares");
        toastResponseError(response);
        if(!response) {
            return;
        }

        const json = await response.json();
        const result: BuildingPlayerShare[] = [];
        json.forEach((o) => result.push(new BuildingPlayerShare(o.building as BuildingPreview, o.amount)));
        this.setState({
            buildings: result,
        });
    }

    handleInteract = (id : string) => {
        this.setState({
            buildingId : id
        })
    }

    render() {
        return (
            <>
                <ObjectList items={this.state.buildings} interactable={true} onInteract={this.handleInteract}/>
                {this.state.buildingId && <Navigate to={`/building/${this.state.buildingId}`}/>}
            </>
        );
    }
}