import backImage from "../assets/background.png";
import {Component} from "react";
import {Outlet} from "react-router-dom";
import './MainLayoutStyle.css';
import {GenericButton} from "../components/inputs/GenericButton.tsx";
import {AuthService} from "../services/authentication/AuthService.ts";

interface MainLayoutProps {
    navigate?: (path: string) => void;
}
export class MainLayout extends Component<MainLayoutProps> {

    constructor(props:MainLayoutProps) {
        super(props);
        this.state = {
            isAuthenticated: AuthService.getInstance().isConnected(),
        };
        
    }

    componentDidMount() {
        window.addEventListener('auth-change', this.handleAuthChange);
    }


    componentWillUnmount() {
        window.removeEventListener('auth-change', this.handleAuthChange);
    }

    handleAuthChange = () => {
        this.setState({
            isAuthenticated: AuthService.getInstance().isConnected()
        });
    };


    navigateToDashboard = () => {
        window.location.replace('/dashboard');
    };

    render() {
        return (
            <>

                <img className={"backImg"} src={backImage} alt={"background"}/>
                <div className={"backImgFilter"}/>
                <main>
                    <div className="header">
                    {AuthService.getInstance().isConnected() && (
                    <GenericButton
                            buttonLabel={"Accueil"}
                            onClick={this.navigateToDashboard}
                            className="blackButton navigateDashboardButton"
                            />
                        )} 
                        <h1>Bordeaux Tycoon</h1>
                        {AuthService.getInstance().isConnected() && (
    
                            <GenericButton
                                buttonLabel={"Déconnexion"}
                                onClick={AuthService.getInstance().logout}
                                className="blackButton disconnectButton"
                            />                            
                        )}                    </div>
                    <div className={"content"}>
                        <Outlet/>
                    </div>
                </main>
            </>
        );
    }
}