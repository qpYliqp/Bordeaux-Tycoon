import './PlayerProfile.css'
import {Component} from "react";
import houseIcon from './../../../assets/icons/house.svg'
import coinIcon from './../../../assets/icons/coin.png'
import trophyIcon from '../../../assets/icons/trophy.png'
import {AuthService} from "../../../services/authentication/AuthService.ts";
import { formatNumberWithSpace } from '../../../services/helpers/format/formatNumber.ts';



export class PlayerProfile extends Component {

    state = {
        player :
            AuthService.getInstance().getUser()
    }

    render() {
        return (
            <>
                <div className="profileContainer">
                    <div className="profileHeader">
                        <div className="profileAbreviationContainer">
                            <p className="profileAbreviation">{this.state.player.getAbreviationName()}</p>
                        </div>
                        <p className="profileName">{this.state.player.name}</p>
                    </div>
                    <hr/>
                    <div className="profileInformationContainer profileMoneyContainer">
                        <p>{formatNumberWithSpace(this.state.player?.money)}€</p>
                    </div>
                    <div className="profileInformationContainer">
                        <div className="profileInformationIcon">
                            <img className="profileInformationIcon" src={houseIcon}></img>
                        </div>
                        <p>{formatNumberWithSpace(this.state.player?.buildingCount)} propriétés</p>
                    </div>
                    <div className="profileInformationContainer">
                        <div className="profileInformationIcon">
                            <img className="profileInformationIcon" src={coinIcon}></img>
                        </div>
                        <p>{formatNumberWithSpace(this.state.player?.hourlyIncome)} € / h</p>
                    </div>
                    <div className="profileInformationContainer">
                        <div className="profileInformationIcon">
                            <img className="profileInformationIcon" src={trophyIcon}></img>
                        </div>
                        <p>Top {formatNumberWithSpace(this.state.player.rank)}</p>
                    </div>
                    <hr/>
                </div>

            </>
        );
    }
}