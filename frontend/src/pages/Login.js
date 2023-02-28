import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Tooltip } from "@mui/material"

import logo from "../images/NoteworthyBlack.svg";
import {ReactComponent as Hidden} from "../images/EyeHidden.svg";
import {ReactComponent as Shown} from "../images/EyeOpen.svg";

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
        const p = await getUser(email);
        if(p){
            setValidEmail(false);
            if(p === password){
                localStorage.setItem("authenticated", true);
                localStorage.setItem("user_id", id.current);
                navigate("/home");
            } else {
                setCorrectPass(true);
            }
        } else {
            setValidEmail(true)
            setCorrectPass(false);
        }
    };

    async function getUser(email) {
        //API call to get user
        //get and return user's password
        id.current = 1;
        return "password"
    }

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