import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link} from "react-router-dom";

import '../page.css';

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
                </label><br></br>
                <input type="submit" value="Submit"/>
            </form>
            <h3>Trying to log in?</h3>
            <Link to="/login" >Login instead.</Link>
        </div>
    )   
}

export default CreateAccount;