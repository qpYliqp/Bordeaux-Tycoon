import {Component} from "react";
import {useParams} from "react-router-dom";
import {SecuredApiService} from "../../../services/api/SecuredApiService.ts";
import {toastResponseError} from "../../../services/helpers/ErrorHandler.ts";
import {Building} from "../../../services/models/Building.ts";
import {getSubThemeName} from "../../../services/helpers/filters/SubThemeList.ts";
import { getThemeName } from "../../../services/helpers/filters/ThemesList.ts";
import { formatNumberWithSpace } from "../../../services/helpers/format/formatNumber.ts";
import { getImportanceName } from "../../../services/helpers/filters/ImportanceList.ts";
import './BuildingDetail.css'
import '../../../components/elements/PlayerProfile/PlayerProfile.css'
import { AuthService } from "../../../services/authentication/AuthService.ts";
import { User } from "../../../services/models/User.ts";
import { GenericButton } from "../../../components/inputs/GenericButton.tsx";
import { GenericTypedInput } from "../../../components/inputs/GenericTypedInput.tsx";
import { Share } from "../../../services/models/Share.ts";
import {SmallMap} from "../../../components/map/SmallMap.tsx";

export function BuildingDetailPageWrapper() {
    const { id } = useParams();
    return <BuildingDetailPage buildingId={id!} />;
}

export class BuildingDetailPage extends Component<{buildingId : string}>{

    constructor(props: any) {
        super(props);
        this.handleConfirmPurchase = this.handleConfirmPurchase.bind(this);
        this.handleConfirmSell = this.handleConfirmSell.bind(this);
    }

    state: {
        building: Building | null;
        player: User | null;
        shares: Share[]
        showModal: boolean;
        errorModal: string;
        shareAmount: string;
        buying: boolean;
        selling: boolean;
      } = {
        building: null,
        player: AuthService.getInstance().getUser(),
        shares: [],
        showModal: false,
        shareAmount: "",
        errorModal: "",
        buying: false,
        selling: false,
      };

    componentDidMount()
    {
        this.getMoreOfBuilding(this.props.buildingId);
        this.getBuildingShares(this.props.buildingId);
    }

    async getMoreOfBuilding(id: string): Promise<Building>
    {
        const api = new SecuredApiService('buildings/' + id);
        const response: Response | undefined = await api.get();
        toastResponseError(response);
        if (response === undefined) {
            throw new Error("Response is undefined");
        }
        const b = await response.json();
        this.setState({
            building : new Building(b.id, b.name, b.theme, b.importance,b.town, b.status, b.subtheme, b.latitude,b.longitude, b.originalId, b.price, b.remainingShares)
        })
    }

    async getBuildingShares(id: string)
    {
        const api = new SecuredApiService('buildings/' + id +'/shares');
        const response: Response | undefined = await api.get();
        toastResponseError(response);
        if (response === undefined) {
            throw new Error("Response is undefined");
        }
        const b = await response.json();
        const shares: Share[] = b.map((shareData: any) => 
            new Share(
                shareData.amount,
                new User(
                    shareData.owner.id,
                    shareData.owner.email,
                    shareData.owner.username,
                    shareData.owner.money,
                    shareData.rank,
                    shareData.buildingCount,
                    shareData.hourlyIncome
                )
                ))

        shares.sort((a, b) => b.amount - a.amount);
        this.setState({
            shares: shares
        })
    }

    handleBuyClick = () => 
    {
        this.setState({ showModal: true, buying: true });
    };

    handleSellClick = () =>
    {
        this.setState({ showModal: true, selling: true });
    }

    handleModalClose = () => 
    {
        this.setState({
            shareAmount: "",
            errorModal: "",
            showModal: false,
            buying: false,
            selling: false,
        });
    };

    async handleConfirmSell()
    {
        let amount = Number(this.state.shareAmount);
        if(isNaN(amount) || amount == 0)
        {
            this.setState({
                errorModal: "Champ invalide",
            });
            return;
        }
        amount *= 100;
        let playerShare = this.state.shares.find(
            (share) => share.owner.id === this.state.player?.id
        );

        if(amount > playerShare?.amount!)
        {
            this.setState({
                errorModal: "Vous n'avez que " + (playerShare?.amount!/100).toString() +"% de parts, vous ne pouvez pas vendre " + (amount/100).toString() + "%",
            });
            return;
        }

        const requestBody =
        {
            id: this.state.player?.id,
            amount: amount,
        };

        const api = new SecuredApiService('buildings/' + this.state.building?.id+'/shares');
        const response: Response | undefined = await api.delete(requestBody);
        toastResponseError(response);
        if (response === undefined) {
            throw new Error("Response is undefined");
        }
        await this.refreshDisplay();
        this.handleModalClose();
    }

    async handleConfirmPurchase()
    {
        let amount = Number(this.state.shareAmount);
        if(isNaN(amount) || amount == 0)
        {
            this.setState({
                errorModal: "Champ invalide",
            });  
            return;
        }
        amount *= 100;
        if(this.state.building?.price! * (amount  / 10000) > this.state.player?.money!)
        {
            this.setState({
                errorModal: "Vous n'avez pas assez d'argent pour prendre "+(amount/100).toString()+"% du bâtiment",
            });
            return;
        }
        if((this.state.building?.share!) - amount < 0)
        {
            this.setState({
                errorModal: "Il n'y a que " + (this.state.building?.share!/100).toString() +"% de parts disponibles, vous ne pouvez pas acheter " + (amount/100).toString()+"%",
            });  
            return;
        }

        const requestBody = 
        {
            id: this.state.player?.id,
            amount: amount,
        };

        const api = new SecuredApiService('buildings/' + this.state.building?.id+'/shares');
        const response: Response | undefined = await api.post(requestBody);
        toastResponseError(response);
        if (response === undefined) {
            throw new Error("Response is undefined");
        }
        await this.refreshDisplay();
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        let value = event.target.value;
        value = value.replace(',', '.');
        const regex = /^$|^(100(\.00?)?|(\d{1,2}(\.\d{0,2})?))$/;
        if (regex.test(value)) {
            this.setState({ shareAmount: value });
        }
    };

    async refreshDisplay()
    {
        const buildingID = this.state.building?.id!;
        await this.getMoreOfBuilding(buildingID);
        await this.getBuildingShares(buildingID);

        const api = new SecuredApiService('users/' + this.state.player?.id);
        const response: Response | undefined = await api.get();
        toastResponseError(response);
        if (response === undefined) {
            throw new Error("Response is undefined");
        }
        const u = await response.json();
        const user = new User(u.id,u.email,u.username,u.money,u.rank,u.buildingCount,u.hourlyIncome);
        AuthService.getInstance().setUser(user);
        this.setState({
            player: AuthService.getInstance().getUser()
        })
        this.handleModalClose();
    }


    render() {
        return (
            <div className="buildingDetailContainer">
                <div className="moneyContainer"><p>Votre argent : <span className="money">{formatNumberWithSpace(this.state.player?.money)}€</span></p></div>
                <div className="detailContainer">
                    <div className="mapContainer">
                        {this.state.building !== null && <SmallMap center={this.state.building?.getCoordinates()} marker={this.state.building?.getCoordinates()}/>}
                    </div>
                    <div className="informationContainer"> 
                        <p>Voici les détails à propos de  <span className="variable-highlight-name">{this.state.building?.name}</span> situé dans la ville de <span className="variable-highlight-name">{this.state.building?.town}</span>.</p>
                        <p>Ce bâtiment à une valeur totale de <span className="variable-highlight-name">{formatNumberWithSpace(this.state.building?.price)}€</span>.</p>
                        <p>Il est catégorisé comme " <span className="variable-highlight-name">{getThemeName(this.state.building?.theme!)}</span> " et plus particulièrement comme " <span className="variable-highlight-name">{getSubThemeName(this.state.building?.subTheme!)}</span> "</p>
                        <p>C'est un équipement <span className="variable-highlight-name">{getImportanceName(this.state.building?.importance)}</span>.</p>
                        <p>Ce bâtiment a <span className="variable-highlight-name">{this.state.building?.share!/100}%</span> de parts disponibles.</p>
                        <div className="sharesContainer scrollable">
                        {this.state.shares.length > 0 ? (
                        this.state.shares.map((share, index) => (
                            <div className="share" key={index}>
                                <div className="profileAbreviation">
                                    <p>{share.owner.getAbreviationName()}</p>
                                </div>
                                <p>{share.owner.name}</p>
                                <p>{(share.amount / 100).toFixed(2)}%</p>
                                <p>Top {index+1}</p>
                            </div>
                        ))
                        ) : (
                        <p>Personne ne détient de part pour ce bâtiment</p>
                        )}
                        </div>
                    </div>
                
                </div>
                <div className="buttonRow">
                    <GenericButton className="buyButton blackButton" buttonLabel="Acheter" onClick={this.handleBuyClick}></GenericButton>
                    {this.state.shares.some(share => share.owner.id === this.state.player?.id) && (
                    <GenericButton
                        className="buyButton blackButton"
                        buttonLabel="Vendre"
                        onClick={this.handleSellClick}>
                    </GenericButton>
                    )}
                </div>
                {this.state.showModal && this.state.buying &&  (
                <div className="modal">
                    <div className="modalContent">
                        <h3>Achat de parts</h3>
                        <GenericTypedInput label={"Part en %"} name={this.state.shareAmount} type={"shareAmount"} value={this.state.shareAmount} onValueChanged={this.handleInputChange}/>
                        <div className="modalActions">
                            <GenericButton className="blackButton" buttonLabel="Confirmer" onClick={this.handleConfirmPurchase}></GenericButton>
                            <GenericButton className="redButton" buttonLabel="Annuler" onClick={this.handleModalClose}></GenericButton>
                        </div>
                        {this.state.errorModal != "" && (
                            <p>{this.state.errorModal}</p>
                        )}
                     </div>
                </div>
                )}
                    {this.state.showModal && this.state.selling && (
                <div className="modal">
                    <div className="modalContent">
                        <h3>Vente de parts</h3>
                        <GenericTypedInput label={"Part en %"} name={this.state.shareAmount} type={"shareAmount"} value={this.state.shareAmount} onValueChanged={this.handleInputChange}/>
                        <div className="modalActions">
                            <GenericButton className="blackButton" buttonLabel="Confirmer" onClick={this.handleConfirmSell}></GenericButton>
                            <GenericButton className="redButton" buttonLabel="Annuler" onClick={this.handleModalClose}></GenericButton>
                        </div>
                        {this.state.errorModal != "" && (
                            <p>{this.state.errorModal}</p>
                        )}
                     </div>
                </div>
                )}
            </div>
        );
    }
}

