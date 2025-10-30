import {ChangeEventHandler, Component} from "react";
import './styles/GenericInputs.css'

export class GenericTypedInput extends Component<{ label: string, name: string, type: string, placeholder? : string, value : any, onValueChanged : ChangeEventHandler}> {

    render() {
        return (
            <div className={"labelSpacing"}>
                <label className={"genericLabel"} htmlFor={this.props.name}> {this.props.label}</label>
                <input className={"genericInput"} type={this.props.type} name={this.props.name} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onValueChanged}/>
            </div>
        );
    }
}