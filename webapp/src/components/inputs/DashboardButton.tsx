import './styles/DashboardInputs.css'
import {Component} from "react";
import {Navigate} from "react-router-dom";


export class DashboardButton extends Component<{buttonLabel : string, path : string}> {

    state = {
        redirect : false,
    }

    redirecting = () => {
        this.setState({
            redirect : true
        });
    };

    render() {
        return (
            <>
                <button onClick={this.redirecting} className={"dashboardButton"}>{this.props.buttonLabel}</button>
                {this.state.redirect && <Navigate to={this.props.path}></Navigate>}
            </>
        );
    }
}