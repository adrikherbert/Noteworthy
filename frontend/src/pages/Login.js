import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";

import logo from "../images/NoteworthyBlack2.svg";
import hidden from "../images/EyeHidden.svg";
import shown from "../images/EyeOpen.svg";

import './enter.css';;

const Login = () => {
    const navigate = useNavigate();
    const id = useRef(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [correctPass, setCorrectPass] = useState(false);
    const [validEmail, setValidEmail] = useState(false);

    const [passwordShown, setPShown] = useState(false);
    const [eyeIcon, setIcon] = useState(hidden)

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
        if(eyeIcon==hidden){
            setIcon(shown);
        } else {
            setIcon(hidden);
        }
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
                            <img src={eyeIcon} onClick={togglePassword} className="eye"/>
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