import React, { useState, useEffect } from 'react';

import './settings.css';
import '../page.css';

import UserService from '../services/user.service.js';

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
        try {
            const response = await UserService.get(uid);
            setCName(response.data.user.username);
            setEmail(response.data.user.email);
            setLoading(false);
        } catch (error) {
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
            alert("Unable to load data at this time.")
        }
    }

    if(isLoading){
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    async function handleSubmit(event){
        event.preventDefault();
        if(new_name == "") return;

        const data = {username: new_name}
        try {
            const response = await UserService.update(id, data);
            setCName(response.data.user.username);
            alert('Saved!');
        } catch (error) {
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
            alert("Unable to load data at this time.")
        }
    }

    async function handleDelete(event){
        event.preventDefault();
        alert("Delete Account!");
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
                    <p className="settings_display_title">Profile</p>

                    <form className="settings_display_options" onSubmit={handleSubmit}>
                    <label className="settings_display_option">
                        <p className="settings_option_title">Username:</p>
                        <input 
                            type="text"
                            placeholder={curr_name}
                            value={new_name}
                            onChange={(event) => setNName(event.target.value)}
                            className="settings_option_content"

                        />
                    </label>
                    <label className="settings_display_option">
                        <p className="settings_option_title">Email:</p>
                        <input 
                            disabled
                            value={email}
                            className="settings_option_content"
                        />
                    </label>
                    <label className="settings_display_option">
                        <p className="settings_option_title">Delete Account:</p>
                        <p className="settings_option_delete" onClick={handleDelete}>Permanently delete my account.</p>
                    </label>

                    </form>

                    <div className="settings_display_save">
                        <button className="settings_save_button" onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )   
}

export default Settings;