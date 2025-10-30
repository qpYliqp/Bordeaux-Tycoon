import {Component} from "react";
import './RankingPage.css'
import '../../components/elements/PlayerProfile/PlayerProfile.css'
import { User } from "../../services/models/User";
import { SecuredApiService } from "../../services/api/SecuredApiService";
import { toastResponseError } from "../../services/helpers/ErrorHandler";


export class RankingPage extends Component {

    state: {
        players: User[] 
      } = {
        players: []
      };

    componentDidMount() 
    {
        this.getPlayers()
    }

       async getPlayers()
       {
           const api = new SecuredApiService('users');
           const response: Response | undefined = await api.get();
           toastResponseError(response);
           if (response === undefined) {
               throw new Error("Response is undefined");
           }
           const b = await response.json();
            const p: User[] = b.map((user: any) => 
                       new User(
                            user.id,
                               user.email,
                               user.username,
                               user.money,
                               user.rank,
                               user.buildingCount,
                               user.hourlyIncome                    
                           ))
          console.log("players : ", p)              
        this.setState({ players: p});
        //    return new Building(b.id, b.name, b.theme, b.importance,b.town, b.status, b.subtheme, b.location, b.originalId, b.price, b.remainingShares);
       }


    render() {
        return (
            <div className="rankingContainer">
               <div className="rankContainer scrollable">
                     {this.state.players.length > 0 ? (
                        this.state.players.map((player, index) => (
                            <div className="rank" key={index}>
                                <div className="profileAbreviation">
                                    <p>{player.getAbreviationName()}</p>
                                </div>
                                <p>{player.name}</p>
                                <p>{player.buildingCount} bâtiments</p>
                                <p>{player.hourlyIncome}€/h</p>                                
                                <p>Top {player.rank}</p>                            
                            </div>
                        ))
                        ) : (
                        <p>Aucun joueur dans la base de donnée. Que faîtes vous là ?</p>
                        )}
                </div> 
            </div>
        )
    }
}