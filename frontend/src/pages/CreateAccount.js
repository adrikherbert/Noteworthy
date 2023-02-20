import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link} from "react-router-dom";

import logo from "../images/NoteworthyBlack.svg";
import hidden from "../images/EyeHidden.svg";
import shown from "../images/EyeOpen.svg";

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
    const [eyeIcon, setIcon] = useState(hidden)

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

        alert("Successful!");


        //Make request to check if email is in use
        // if(false){ //Check if true
        //     alert("The email entered is already in use");
        // } else {
        //     const data = { user_name: user_name, email: email, password: password };
        //     //make request to make a new user
        //     localStorage.setItem("authenticated", true);
        //     localStorage.setItem("user_id", 1); //Change to id returned when user is created
        //     navigate("/home");
        // }
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
        if(eyeIcon==hidden){
            setIcon(shown);
        } else {
            setIcon(hidden);
        }
    }

    return(
        <div className="fullPage">
            <div className="modal">
                <img src={logo} className="logo"/>
                <p className="title">Create Account</p>
                <div>
                   <form className="form" onSubmit={handleSubmit}>
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
                            <img src={eyeIcon} onClick={togglePassword} className="eye"/>
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
                            <img src={eyeIcon} onClick={togglePassword} className="eye"/>
                        </div>
                        {passwordMatch && <p className="invalid_email">
                            Passwords don't match!
                        </p>}
                    </label>
                    <input type="submit" value="Create Account" className="button"/>
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