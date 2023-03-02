import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Tooltip } from "@mui/material"

import logo from "../images/NoteworthyBlack.svg";
import {ReactComponent as Hidden} from "../images/EyeHidden.svg";
import {ReactComponent as Shown} from "../images/EyeOpen.svg";

import UserService from '../services/user.service.js';

import './enter.css';;

const Login = () => {
    const navigate = useNavigate();
    const id = useRef(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [correctPass, setCorrectPass] = useState(false);
    const [validEmail, setValidEmail] = useState(false);

    const [passwordShown, setPShown] = useState(false);

    useEffect(() => { 
        localStorage.setItem("authenticated", "false")
    }, []);

    async function handleSubmit(event){
        event.preventDefault();
        try {
            const info = { email: email, password: password};
            const response = await UserService.login(info);
            localStorage.setItem("authenticated", true);
            localStorage.setItem("user_id", response.data.id); //Change to id returned when user is created
            navigate("/home");
        } catch (error) {
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
                switch(error.response.status){
                    case 400:
                        setCorrectPass(false);
                        setValidEmail(false);
                        break;
                    case 452:
                        setValidEmail(true);
                        setCorrectPass(false);
                        break;
                    case 453:
                        setValidEmail(false);
                        setCorrectPass(true);
                        break;
                    default:
                }
            } else {
                console.log(error);
                alert("Unable to login at this time.");
            }
        }
    };

    const togglePassword = () => {
        setPShown(!passwordShown);
    }

    return(
        <div className="enter_fullPage">
            <div className="enter_modal">
                <img src={logo} className="enter_logo"/>
                <p className="enter_title">Login</p>
                <form className="enter_form" onSubmit={handleSubmit}>
                    <label>Email:<br/>
                        <input 
                            type="text" 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="input_box"
                        />
                        {validEmail && <p className="invalid_email">
                            We don't have an account matching that email!
                        </p>}
                    </label>
                    <label>Password:<br/>
                        <div className="password">
                            <input 
                                type={passwordShown ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="input_box"
                            />
                            <Tooltip title={passwordShown ? "Hide Password" : "Show Password"} placement="top-start" arrow>
                                {passwordShown ? <Shown onClick={togglePassword} className="eye"/> : <Hidden onClick={togglePassword} className="eye"/>}
                            </Tooltip>
                        </div>
                        {correctPass && <p className="invalid_email">
                            Incorrect Password!
                        </p>}
                    </label>
                    <input type="submit" value="Submit" className="submit_button"/>
                </form>
                <div>
                    <p className="try_login">Don't have an account?</p>
                    <Link to="/createaccount">Create an account.</Link>
                </div>
            </div>
        </div>
    )   
}

export default Login;