import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './page.css';

import { BrowserRouter } from "react-router-dom";
import {Route, Routes, Link, Navigate } from "react-router-dom";
import UserHome from "./pages/UserHome";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import AuthWrapper from "./pages/AuthWrapper";
import Settings from "./pages/Settings";

import reportWebVitals from './reportWebVitals';


const App = () => {

  return (
  <BrowserRouter>
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route element={<AuthWrapper />}>
          <Route exact path="/" element={<Navigate to="/login"/>} />
          <Route exact path="/home" element={<UserHome />} />
          <Route exact path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  </BrowserRouter>
  );
}
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
  
reportWebVitals();