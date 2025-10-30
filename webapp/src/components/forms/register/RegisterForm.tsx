import {Component} from "react";
import {GenericTypedInput} from "../../inputs/GenericTypedInput.tsx";
import {GenericButton,} from "../../inputs/GenericButton.tsx";
import {InputDescriptor} from "../../../services/helpers/forms/InputDescriptor.ts";
import {TextRequired} from "../../../services/helpers/forms/rules/TextRequired.ts";
import {FormValidator} from "../../../services/helpers/forms/FormValidator.ts";
import {toast, ToastContainer} from "react-toastify";
import {PasswordStrength} from "../../../services/helpers/forms/rules/PasswordStrength.ts";
import {Register} from "../../../services/models/dto/Register.ts";
import {AuthService} from "../../../services/authentication/AuthService.ts";
import {Navigate} from "react-router-dom";

export class RegisterForm extends Component {
    state = {
        emailInput:
            new InputDescriptor("email", '',[new TextRequired()]),
        pseudoInput:
            new InputDescriptor("pseudo", '',[new TextRequired()]),
        passwordInput :
            new InputDescriptor("mot de passe", '',[new TextRequired(), new PasswordStrength()]),
        confirmPasswordInput :
            new InputDescriptor("confirmation du mot de passe", '',[new TextRequired()]),
        redirectToLogin : false,
    }

    handlePasswordChange = (event) => {
        event.preventDefault()
        this.setState({
            passwordInput : this.state.passwordInput.updateValue(event.target.value)
        })
    }

    handleConfirmPasswordChange = (event) => {
        event.preventDefault()
        this.setState({
            confirmPasswordInput : this.state.confirmPasswordInput.updateValue(event.target.value)
        })
    }

    handleEmailChange = (event) => {
        event.preventDefault()
        this.setState({
            emailInput : this.state.emailInput.updateValue(event.target.value)
        })
    }

    handlePseudoChange = (event) => {
        event.preventDefault()
        this.setState({
            pseudoInput : this.state.pseudoInput.updateValue(event.target.value)
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const api = AuthService.getInstance();

        const validator = new FormValidator([
            this.state.pseudoInput,
            this.state.passwordInput,
            this.state.emailInput
        ]);

        if (this.state.confirmPasswordInput.inputValue !== this.state.passwordInput.inputValue) {
            toast.error("Les mots de passes doivent être identiques");
            return;
        }

        if (validator.validate()) {
            const user = new Register(this.state.emailInput.inputValue, this.state.pseudoInput.inputValue, this.state.passwordInput.inputValue);
            api.register(user).then((res) => {
                if(res) {
                    toast.success("Inscription validée");
                    this.setState({
                        redirectToLogin : true
                    });
                }
            }).catch(() => {toast.error("Erreur de connexion")});
        } else {
            validator.getErrors().forEach((e) => toast.error(e, {toastId: e}));
        }
    }

    render() {
        return (
            <form className={"menu"}>
                <div className={"inputContainer"}>
                    <GenericTypedInput onValueChanged={this.handleEmailChange} value={this.state.emailInput.inputValue} label={"Email"} name={"email"} type={"email"} placeholder={"knight77@gmail.com"}/>
                    <GenericTypedInput onValueChanged={this.handlePseudoChange} value={this.state.pseudoInput.inputValue} label={"Pseudo"} name={"name"} type={"text"} placeholder={"knight77"}/>
                    <GenericTypedInput onValueChanged={this.handlePasswordChange} value={this.state.passwordInput.inputValue} label={"Mot de passe"} name={"password"} type={"password"}/>
                    <GenericTypedInput onValueChanged={this.handleConfirmPasswordChange} value={this.state.confirmPasswordInput.inputValue} label={"Confirmer le mot de passe"} name={"confirmPassword"} type={"password"}/>
                </div>
                <div className={"buttonContainer"}>
                    <GenericButton onClick={this.handleSubmit} buttonLabel={"Inscription"} className={"redButton"}/>
                    <ToastContainer
                        position="top-right"
                        autoClose={4000}
                        theme="dark"
                    />
                </div>
                {this.state.redirectToLogin && <Navigate to={"/login"}/>}
            </form>
        );
    }
}