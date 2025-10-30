import {Component} from "react";
import {Listable} from "../../../services/models/interfaces/Listable.ts";
import "./styles/SharedEntries.css";
import "./styles/SmallObjectListEntry.css"

export class SmallObjectListEntry extends Component<{
    item: Listable,
    selected : boolean,
    onInteract?: Function,
    onHoverEnter?: Function,
    onHoverExit?: Function
}> {
    render() {
        return (
            <div className={"container " + (this.props.selected ? "selected" : "")}
                 onMouseEnter={this.props.onHoverEnter?.bind(this, this.props.item.getId())}
                 onMouseLeave={this.props.onHoverExit?.bind(this, this.props.item.getId())}
                 onClick={this.props.onInteract?.bind(this, this.props.item.getId())}
            >
                <h3>{this.props.item.getTitle()}</h3>
                <div className={"bottom-container"}>
                    {this.props.item.getSmallEntriesValues().map((value) => (
                        <p key={value}> {value} </p>
                    ))}
                </div>
            </div>
        );
    }
}