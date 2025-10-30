import {Component} from "react";
import {GenericButton} from "../../inputs/GenericButton.tsx";
import "./styles/ObjectListEntry.css";
import "./styles/SharedEntries.css"

export class ObjectListEntry extends Component<{id : string, values : string[], interactable : boolean, onInteract? : Function}> {

    render() {
        return (
            <>
                <div className={"objectRow elementContainer"}>
                    {this.props.values.map((value, index) => (
                        <p key={index}> {value} </p>
                    ))}
                    <div className={"spacer"}></div>
                    {this.props.interactable && <GenericButton buttonLabel={"Détails"} onClick={this.props.onInteract?.bind(this,this.props.id)} className={"redButton"}/>}
                </div>
            </>
        );
    }
}