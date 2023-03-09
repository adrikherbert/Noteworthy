import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Tooltip } from "@mui/material"

import logo from "../images/NoteworthyBlack.svg";
import {ReactComponent as Hidden} from "../images/EyeHidden.svg";
import {ReactComponent as Shown} from "../images/EyeOpen.svg";

import UserService from '../services/user.service.js';

import './enter.css';;

const ResetPassword = () => {
    const navigate = useNavigate();;
    const [password, setPassword] = useState("");
    const [temp_password, setTPassword] = useState("");
    const [email, setEmail] = useState("");

    const [correctPass, setCorrectPass] = useState(false);
    const [validPassword, setVPassword] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [passwordShown, setPShown] = useState(false);

    const [success, setSuccess] = useState(false);

    const vPassword = new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/);

    useEffect(() => { 
        
    }, []);

    async function handleSubmit(event){
        event.preventDefault();
        if(!validate()) return;
        try {
            const data = {"email": email, "old_password": temp_password, "new_password": password};
            const response = await UserService.passReset(data);
            alert('Success! Navigating back to the login page.');
            navigate('/login');
        } catch (error) {
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
                switch(error.response.status){
                    case 400:
                        setCorrectPass(false);
                        break;
                    case 453:
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

    const validate = () => {
        let valid = true;

        if(vPassword.test(password)){
            setVPassword(false);
        } else {
            setVPassword(true);
            valid = false;
        }
        return valid;
    };

    return(
        <div className="enter_fullPage">
            <div className="enter_modal">
                <img src={logo} className="enter_logo"/>
                <p className="enter_title">Reset Password</p>
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
                    <label>Temporary Password:<br/>
                        <input 
                            type="text" 
                            value={temp_password}
                            onChange={(event) => setTPassword(event.target.value)}
                            className="input_box"
                        />
                        {correctPass && <p className="invalid_email">
                            Incorrect Temporary Password!
                        </p>}
                    </label>
                    <label>New Password:<br/>
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
                    <input type="submit" value="Submit" className="submit_button"/>
                </form>
                <div>
                    <Link to="/login">Back to login.</Link><br/>
                </div>
            </div>
        </div>
    )   
}

export default ResetPassword;