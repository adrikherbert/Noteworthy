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
        validate();


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
        if(vEmail.test(email)){
            setVEmail(false)
        } else {
            setVEmail(true)
        }

        if(vPassword.test(password)){
            setVPassword(false);
            if(password === rpassword){
                setPMatch(false);
            } else {
                setPMatch(true);
            }
        } else {
            setVPassword(true);
            setPMatch(false);
        }
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
                <img src={logo} className="title"/>
                <h3>Creat Account</h3>
                <div>
                   <form onSubmit={handleSubmit}>
                    <label>Name:<br></br>
                        <input 
                            type="text"
                            value={user_name}
                            onChange={(event) => setName(event.target.value)}
                        /><br></br>
                    </label>
                    <label>Email:<br></br>
                        <input 
                            type="text" 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        {validEmail && <p>Invalid email!</p>}
                        {!validEmail && <br></br>}
                    </label>
                    <label>Password:<br></br>
                        <input 
                            type={passwordShown ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <img src={eyeIcon} onClick={togglePassword} className="eye"/>
                        {/* {passwordShown ? <img src={shown} className="eye"/> : <img src={hidden} className="eye"/>} */}
                        {validPassword && <p>Invalid Password!</p>}
                        {!validPassword && <br></br>}
                    </label>
                    <label>Re-Type Password:<br></br>
                        <input 
                            type={passwordShown ? "text" : "password"}
                            value={rpassword}
                            onChange={(event) => setRPassword(event.target.value)}
                        />
                        {passwordMatch && <p>Passwords don't match!</p>}
                        {!passwordMatch && <br></br>}
                    </label><br></br>
                    <input type="submit" value="Create Account"/>
                    </form> 
                </div>
                <div>
                    <h4>Trying to log in?</h4>
                    <Link to="/login" >Login instead.</Link>
                </div>
            </div>
        </div>
    )   
}

export default CreateAccount;