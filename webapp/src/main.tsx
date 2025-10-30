import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {MainLayout} from "./layouts/MainLayout.tsx";
import {LoginPage} from "./pages/Authentication/LoginPage.tsx";
import {RegisterPage} from "./pages/Authentication/RegisterPage.tsx";
import {AuthInterceptor} from "./services/authentication/AuthInterceptor.tsx";
import {BuildingListPage} from "./pages/buildings/BuildingList/BuildingListPage.tsx";
import {DashboardPage} from "./pages/Dashboard/DashboardPage.tsx";
import {ToastContainer} from "react-toastify";
import {BuildingMapPage} from "./pages/buildings/BuildingList/BuildingMapPage.tsx";
import { BuildingDetailPageWrapper} from "./pages/buildings/BuildingDetail/BuildingDetailPage.tsx";
import {NonSecured} from "./services/authentication/NonSecured.tsx";
import {BuildingOwnedPage} from "./pages/buildings/BuildingList/BuildingOwnedPage.tsx";
import { RankingPage } from './pages/Ranking/RankingPage.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Navigate to="/login" replace={true}/>}/>
                <Route element={<MainLayout/>}>
                    {/* Non secured routes */}
                    <Route element={<NonSecured/>}>
                        <Route path={"/login"} element={<LoginPage/>}/>
                        <Route path={"/register"} element={<RegisterPage/>}/>
                    </Route>
                    {/* Secured routes */}
                    <Route element={<AuthInterceptor/>}>
                        <Route path={"/dashboard"} element={<DashboardPage/>}/>
                        <Route path={"/list"} element={<BuildingListPage/>}/>
                        <Route path={"/player/list"} element={<BuildingOwnedPage/>}/>
                        <Route path={"/building/:id"} element={<BuildingDetailPageWrapper/>}/>
                        <Route path={"/map"} element={<BuildingMapPage/>}/>
                        <Route path={"/ranking"} element={<RankingPage/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right"
                        autoClose={4000}
                        theme="dark"/>
    </StrictMode>,
)
