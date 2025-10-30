import {Component} from "react";
import {DashboardButton} from "../../components/inputs/DashboardButton.tsx";
import {PlayerProfile} from "../../components/elements/PlayerProfile/PlayerProfile.tsx";
import './DashboardPage.css'
// import {DashboardButton} from "../../components/inputs/DashboardButton.tsx";

export class DashboardPage extends Component {
    render() {
        return (
            <div className="dashboardContainer">
                <PlayerProfile/>
                <div className="buttonsContainer">
                <DashboardButton buttonLabel={"Mes propriétés"} path={"/player/list"}/>
                <DashboardButton buttonLabel={"Acheter"} path={"/list"}/>
                <DashboardButton buttonLabel={"Map"} path={"/map"}/>
                <DashboardButton buttonLabel={"Classement"} path={"/ranking"}/>
                </div>
            </div>
        );
    }
}