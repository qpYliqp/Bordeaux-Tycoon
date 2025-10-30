import {Component} from "react";
import {ObjectList} from "../../../components/lists/containers/ObjectList.tsx";
import './BuildingList.css'
import {FilterSelector} from "../../../components/lists/containers/FilterSelector.tsx";
import {themesList} from "../../../services/helpers/filters/ThemesList.ts";
import {Navigate} from "react-router-dom";
import {SecuredApiService} from "../../../services/api/SecuredApiService.ts";
import {QueryParam} from "../../../services/helpers/QueryParam.ts";
import {SearchBar} from "../../../components/lists/containers/SearchBar.tsx";
import {toastResponseError, toastSearchNotFound} from "../../../services/helpers/ErrorHandler.ts";
import {BuildingPreview} from "../../../services/models/dto/BuildingPreview.ts";

export class BuildingListPage extends Component {

    state : {buildings : BuildingPreview[], activeThemes : string[], buildingId? : string, activeSearch : string, page : number, lastPage : number, allowPaging : boolean} = {
        buildings: [],
        activeThemes : [],
        buildingId : undefined,
        activeSearch : "",
        page : 0,
        lastPage : 0,
        allowPaging : true
    }

    componentDidMount() {
        this.getBuildings();
    }

    async getBuildings() {
        if(!this.state.allowPaging) {
            return;
        }

        const api = new SecuredApiService('buildings');

        const params : QueryParam[] = [
            new QueryParam("name",this.state.activeSearch),
            new QueryParam("page",this.state.page.toString())
        ];

        this.state.activeThemes.forEach((theme) => {
            params.push(new QueryParam("theme",theme));
        });

        const response : Response | undefined = await api.get(undefined,params);
        toastResponseError(response);
        if(response === undefined) {
            return;
        }

        const json = await response.json();
        const result : BuildingPreview[] = [];
        json.forEach((b : any) => result.push(new BuildingPreview(b.id,b.name,b.theme,b.importance,b.latitude,b.longitude,b.town,b.remainingShares)))
        if(result.length === 0) {
            this.setState({
                allowPaging : false
            }, () => {
                if(this.state.page === 0) {
                    toastSearchNotFound();
                }
            })
            return;
        }
        this.setBuildings(result);
    }

    setBuildings(newBuildings : BuildingPreview[]) {
        if(this.state.lastPage !== this.state.page) {
            this.setState({
                buildings: [...this.state.buildings, ...newBuildings]
            })
        } else {
            this.setState({
                buildings: newBuildings
            })
        }
    }

    filterChange = (letter : string) => {
        const index = this.state.activeThemes.indexOf(letter);
        this.setState({
            page : 0,
            lastPage : 0,
            allowPaging : true,
            activeThemes : index !== -1 ? this.state.activeThemes.filter((theme) => theme !== letter) : [...this.state.activeThemes, letter]
        }, () => this.getBuildings())
    }

    listMoreButton = (id : string) => {
        this.setState({
            buildingId : id
        })
    }

    handleSearch = (newValue : string) => {
        this.setState({
            activeSearch : newValue,
            page : 0,
            lastPage : 0,
            allowPaging : true
        },() => this.getBuildings())
    }

    handlePagination = (increment : number) => {
        this.setState({
            lastPage : this.state.page,
            page : this.state.page + increment,
        },() => this.getBuildings())
    }

    render() {
        return (
            <div className={"grid"}>
                <div/>
                <SearchBar submit={this.handleSearch}/>
                <FilterSelector filtersTheme={themesList} filterChange={this.filterChange}/>
                <ObjectList items={this.state.buildings} interactable={true} onInteract={this.listMoreButton} handlePagination={this.handlePagination}/>
                {this.state.buildingId && <Navigate to={`/building/${this.state.buildingId}`}/>}
            </div>
        );
    }
}