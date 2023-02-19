import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";

import '../page.css';

const Login = () => {
    const navigate = useNavigate();
    const id = useRef(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => { 
        localStorage.setItem("authenticated", "false")
    }, []);

    async function handleSubmit(event){
        const p = await getUser(email);
        if(p){
            if(p === password){
                localStorage.setItem("authenticated", true);
                localStorage.setItem("user_id", id.current);
                navigate("/home");
            } else {
                alert("Incorrect password");
            }
        } else {
            alert("The email entered does not match any accounts");
        }
    };

    async function getUser(email) {
        //API call to get user
        //get and return user's password
        id.current = 1;
        return "password"
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
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
            <h3>Don't have an account?</h3>
            <Link to="/createaccount" >Create an account</Link>
        </div>
    )   
}

export default Login;