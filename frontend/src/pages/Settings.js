import React, { useState, useEffect } from 'react';

import './settings.css';
import '../page.css';

const Settings = () => {
    const [id, setId] = useState(null);
    const [email, setEmail] = useState("");
    const [curr_name, setCName] = useState("");
    const [new_name, setNName] = useState("");
    const [old_password, setOPassword] = useState("");
    const [new_password, setNPassword] = useState("");

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const stored_id = localStorage.getItem("user_id");
        getUser(stored_id);
        setId(stored_id);
        setLoading(false);
    }, [])


    async function getUser(uid) {
        //API request to get user based on id

        //set name and email
        //setLoading(false);
    }

    if(isLoading){
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }


    return(
        <div className="titleSplit">
            <div className="titleBar">
                <h1>Settings</h1>
            </div>
            <div className="settings_container"> 
                <div className="settings_options">

                </div>
                <div className="settings_display">

                </div>
                
            </div>
        </div>
    )   
}

export default Settings;