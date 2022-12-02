import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";

import "./custom.scss";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/login/Login";
import Signup from './components/login/Signup';
import Home from './components/Home';
import UpdatePassword from './components/login/UpdatePassword';
import PatientSearchView from './components/PatientSearchView';
import Appointments from './components/Appointments';
import SendResetPassword from './components/login/SendResetPassword';
import PatientProfileView from './components/PatientProfileView';
import IssueView from './components/IssueView';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <AuthProvider>
        <BrowserRouter>
            <Routes>                
                <Route index element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                <Route path={"patients"} element={<ProtectedRoute><PatientSearchView/></ProtectedRoute>}/>
                <Route path={"appointments"} element={<ProtectedRoute><Appointments/></ProtectedRoute>}/>
                <Route path={"patient"} element={<ProtectedRoute><PatientProfileView/></ProtectedRoute>}/>
                <Route path={"issue"} element={<ProtectedRoute><IssueView/></ProtectedRoute>}/>


                <Route path={"login"} element={<Login/>}/>
                <Route path={"signup"} element={<Signup/>}/>          
                <Route path={"send-reset-password"} element={<SendResetPassword/>}/>    
                <Route path={"update-password"} element={<UpdatePassword/>}/>    
                <Route path="*" element={<Navigate to="/" replace />}
    />
            </Routes>
        </BrowserRouter>
    </AuthProvider>,
 // </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
