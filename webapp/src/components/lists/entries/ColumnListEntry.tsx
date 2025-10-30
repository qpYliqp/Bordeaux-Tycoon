import {Component} from "react";
import "./styles/ColumnListEntry.css";
import "./styles/SharedEntries.css";

export class ColumnListEntry extends Component<{columns : string[]}> {

    render() {
        return (
            <>
                <div className={"columnBlock"}>
                    {this.props.columns.map((value) => (
                        <p key={value}> {value} </p>
                    ))}
                    <div className={"spacer"}/>
                </div>
            </>
        );
    }
}