import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link} from "react-router-dom";

import logo from "../images/NoteworthyBlack.png"

import './enter.css';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [user_name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        localStorage.setItem("authenticated", "false");
    }, []);

    async function handleSubmit(event){
        //Make request to check if email is in use
        if(false){ //Check if true
            alert("The email entered is already in use");
        } else {
            const data = { user_name: user_name, email: email, password: password };
            //make request to make a new user
            localStorage.setItem("authenticated", true);
            localStorage.setItem("user_id", 1); //Change to id returned when user is created
            navigate("/home");
        }
    };

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
                        /><br></br>
                    </label>
                    <label>Password:<br></br>
                        <input 
                            type="text"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        /><br></br>
                    </label>
                    <label>Re-Type Password:<br></br>
                        <input 
                            type="text"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        /><br></br>
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