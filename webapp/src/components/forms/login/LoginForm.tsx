    import {Component} from "react";
    import './LoginStyle.css';
    import '../SharedStyle.css'
    import {GenericTypedInput} from "../../inputs/GenericTypedInput.tsx";
    import {GenericButton} from "../../inputs/GenericButton.tsx";
    import {Navigate} from "react-router-dom";
    import {InputDescriptor} from "../../../services/helpers/forms/InputDescriptor.ts";
    import {FormValidator} from "../../../services/helpers/forms/FormValidator.ts";
    import {TextRequired} from "../../../services/helpers/forms/rules/TextRequired.ts";
    import {Login} from "../../../services/models/dto/Login.ts";
    import {AuthService} from "../../../services/authentication/AuthService.ts";
    import {toast} from "react-toastify";

    export class LoginForm extends Component {
        state = {
            emailInput:
                new InputDescriptor("email", '',[new TextRequired()]),
            passwordInput :
                new InputDescriptor("password", '',[new TextRequired()]),
            redirectToRegister : false,
            redirectToDashboard : false
        }

        handleSubmit = (event) => {
            event.preventDefault();

            const validator :FormValidator = new FormValidator([
                this.state.emailInput,
                this.state.passwordInput,
            ]);

            if (validator.validate()) {
                const loginInfo : Login = new Login(this.state.emailInput.inputValue, this.state.passwordInput.inputValue);
                AuthService.getInstance().login(loginInfo).then((response) => {
                    if (response) {
                        this.setState({
                            redirectToDashboard : true
                        })
                    }
                })
            } else {
                validator.getErrors().forEach((e : string) => toast.error(e, {toastId: e}));
                return;
            }
        }

        register = (event) => {
            event.preventDefault()
            this.setState({
                redirectToRegister : true
            });
        }

        handlePasswordChange = (event) => {
            event.preventDefault()
            this.setState({
                passwordInput : this.state.passwordInput.updateValue(event.target.value)
            })
        }

        handleEmailChange = (event) => {
            event.preventDefault()
            this.setState({
                nameInput : this.state.emailInput.updateValue(event.target.value)
            })
        }

        render() {
            return (
                <form onSubmit={this.handleSubmit} className={"menu"}>
                    <div className={"inputContainer"}>
                        <GenericTypedInput label={"Email"} name={this.state.emailInput.inputName} type={"email"} value={this.state.emailInput.inputValue} onValueChanged={this.handleEmailChange}/>
                        <GenericTypedInput label={"Mot de passe"} name={this.state.passwordInput.inputName} type={"password"} value={this.state.passwordInput.inputValue} onValueChanged={this.handlePasswordChange}/>
                    </div>
                    <div className={"buttonContainer"}>
                        <GenericButton onClick={this.handleSubmit} buttonLabel={"Connexion"} className={"redButton"}/>
                        <hr/>
                        <GenericButton onClick={this.register} buttonLabel={"Inscription"} className={"redButton"}/>
                        {this.state.redirectToRegister && <Navigate to={"/register"}/>}
                        {this.state.redirectToDashboard && <Navigate to={"/dashboard"}/>}
                    </div>
                </form>
            );
        }
    }