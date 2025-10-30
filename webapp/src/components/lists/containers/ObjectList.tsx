import React, {Component} from "react";
import {ObjectListEntry} from "../entries/ObjectListEntry.tsx";
import {Listable} from "../../../services/models/interfaces/Listable.ts";
import "./styles/PaginatedObjectList.css";
import "./styles/SharedList.css"
import {ColumnListEntry} from "../entries/ColumnListEntry.tsx";

export class ObjectList extends Component<{items : Listable[], interactable : boolean, onInteract? : Function, handlePagination? : Function}> {

    handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if(!this.props.handlePagination) {
            return;
        }

        if(this.props.items.length > 0) {
            const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
            let increment = 0;

            if (bottom) {
                increment = 1;
            } else {
                return;
            }
            this.props.handlePagination.call(this,increment);
        }
    }

    render() {
        return (
            <>
                <div className={"objectSize listContainer offset"}>
                    {this.props.items.length !== 0 && <ColumnListEntry columns={this.props.items[0].getColumns()}/>}
                    <div className={"offset scrollable"} onScroll={this.handleScroll}>
                    {this.props.items.map((item, index) => (
                        <ObjectListEntry key={index} id={item.getId()} values={item.getEntriesValues()} interactable={this.props.interactable} onInteract={this.props.onInteract}/>
                    ))}
                    </div>
                </div>
            </>
        );
    }
}