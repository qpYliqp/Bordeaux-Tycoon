import {Component} from "react";
import "../../inputs/styles/GenericInputs.css";
import "./styles/SearchBar.css";

export class SearchBar extends Component<{submit : Function}> {

    state = {
        search : ""
    }

    handleChange = (event) => {
        this.setState({
            search : event.target.value
        })
    }

    submitSearch = (event) => {
        if(event.key === "Enter") {
            this.props.submit.call(this,this.state.search);
        }
    }

    render() {
        return (
            <>
                <div className={"searchContainer"}>
                    <input className={"genericInput search"} type={"text"} placeholder={"Mairie ..."} onChange={this.handleChange} onKeyUp={this.submitSearch} />
                </div>
            </>
        );
    }
}