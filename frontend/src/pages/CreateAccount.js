import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link} from "react-router-dom";
import { Tooltip } from "@mui/material"

import {ReactComponent as Hidden} from "../images/EyeHidden.svg";
import {ReactComponent as Shown} from "../images/EyeOpen.svg";
import logo from "../images/NoteworthyBlack.svg";

import UserService from '../services/user.service.js';

import './enter.css';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [user_name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rpassword, setRPassword] = useState("");
    
    const [validEmail, setVEmail] = useState(false);
    const [validPassword, setVPassword] = useState(false);
    const [passwordMatch, setPMatch] = useState(false);
    const [passwordShown, setPShown] = useState(false);

    const vEmail = RegExp(/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,4}$/);
    const vPassword = new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/);

    useEffect(() => {
        localStorage.setItem("authenticated", "false");
    }, []);

    async function handleSubmit(event){
        event.preventDefault();
        if(!validate()){
            return;
        }
        
        const data = { active: true, email: email, password: password, username: user_name };
        try {
            const create_response = await UserService.create(data);
            console.log(create_response)
            try {
                const info = { email: email, password: password}
                const login_response = await UserService.login(info);
                localStorage.setItem("authenticated", true);
                localStorage.setItem("user_id", login_response.data.id); //Change to id returned when user is created
                navigate("/home");
            } catch (error) {
                if(error.response?.status){
                    console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
                } else {
                    console.log(error);
                }
                alert("Unable to login at this time.")
            }
        } catch (error) {
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
            alert("Unable to create an account at this time.")
        }
    };

    const validate = () => {
        let valid = true;
        if(vEmail.test(email)){
            setVEmail(false)
        } else {
            setVEmail(true)
            valid = false;
        }

        if(vPassword.test(password)){
            setVPassword(false);
            if(password === rpassword){
                setPMatch(false);
            } else {
                setPMatch(true);
                valid = false;
            }
        } else {
            setVPassword(true);
            setPMatch(false);
            valid = false;
        }
        return valid;
    };

    const togglePassword = () => {
        setPShown(!passwordShown);
    }

    return(
        <div className="enter_fullPage">
            <div className="enter_modal">
                <img src={logo} className="enter_logo"/>
                <p className="enter_title">Create Account</p>
                <div>
                   <form className="enter_form" onSubmit={handleSubmit}>
                    <label>Name:<br/>
                        <input 
                            type="text"
                            value={user_name}
                            onChange={(event) => setName(event.target.value)}
                            className="input_box"
                        />
                    </label>
                    <label>Email:<br/>
                        <input 
                            type="text" 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="input_box"
                        />
                        {validEmail && <p className="invalid_email">
                            Invalid email!
                        </p>}
                    </label>
                    <label >Password:<br/>
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
                        {validPassword && <p className="invalid_password">
                            Invalid Password! A password must contain:<br/>
                             - 8 or more characaters<br/>
                             - An uppercase and lowercase letter<br/>
                             - A number<br/>
                             - A special character: @#$%^&+=
                        </p>}
                    </label>
                    
                    <label>Re-Type Password:<br/>
                        <div className="password">
                            <input 
                                type={passwordShown ? "text" : "password"}
                                value={rpassword}
                                onChange={(event) => setRPassword(event.target.value)}
                                className="input_box"
                            />
                            <Tooltip title={passwordShown ? "Hide Password" : "Show Password"} placement="top-start" arrow>
                                {passwordShown ? <Shown onClick={togglePassword} className="eye"/> : <Hidden onClick={togglePassword} className="eye"/>}
                            </Tooltip>
                        </div>
                        {passwordMatch && <p className="invalid_email">
                            Passwords don't match!
                        </p>}
                    </label>
                    <input type="submit" value="Create Account" className="submit_button"/>
                    </form> 
                </div>
                <div>
                    <p className="try_login">Trying to log in?</p>
                    <Link to="/login">Login instead.</Link>
                </div>
            </div>
        </div>
    )   
}

export default CreateAccount;