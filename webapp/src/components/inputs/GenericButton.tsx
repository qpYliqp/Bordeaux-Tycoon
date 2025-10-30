import {Component, MouseEventHandler} from "react";
import './styles/GenericInputs.css'

export class GenericButton extends Component<{buttonLabel : string, onClick : MouseEventHandler, className?: string;}> {

    render() {
        const buttonClass = "genericButton " + this.props.className;
        return (
            <>
                <button onClick={this.props.onClick} className={buttonClass}>{this.props.buttonLabel}</button>
            </>
        );
    }
}