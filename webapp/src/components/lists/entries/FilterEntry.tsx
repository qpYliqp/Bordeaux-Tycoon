import {Component} from "react";
import {BuildingTheme} from "../../../services/helpers/filters/BuildingTheme.ts";
import "./styles/FilterEntry.css";
import "./styles/SharedEntries.css";

export class FilterEntry extends Component<{filter : BuildingTheme, onChange : Function}> {

    state = {
        filterState : false
    }

    handleLocalChange = () => {
        this.setState({
            filterState : !this.state.filterState
        })
        this.props.onChange.call(this,this.props.filter.letter);
    }

    render() {
        return (
            <>
                <div className={"entry"} onClick={this.handleLocalChange}>
                    <div className={"leftGroup"}>
                        <img className={"icon"} src={this.props.filter.logo} alt={"prop"}/>
                        <h4> { this.props.filter.displayName} </h4>
                    </div>
                    <div className={"spacer"}></div>
                    <button className={"rounded " + (this.state.filterState ? "ticked" : "")} onClick={this.handleLocalChange}></button>
                </div>
            </>
        );
    }
}