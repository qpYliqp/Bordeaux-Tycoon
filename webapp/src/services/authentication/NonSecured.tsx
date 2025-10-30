import {Component} from "react";
import {AuthService} from "./AuthService.ts";
import {Navigate, Outlet} from "react-router-dom";

export class NonSecured extends Component {
    private auth = AuthService.getInstance();

    render() {
        return !this.auth.isConnected() ? (
            <>
                <Outlet/>
            </>
        ) : (
            <>
                <Navigate to={"/dashboard"} replace={true}/>
            </>
        );
    }
}