import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import './settings.css';
import '../page.css';

import UserService from '../services/user.service.js';
import Confirm from '../components/Confirm.js';
import ChangePassword from '../components/ChangePassword'

const Settings = () => {
    const navigate = useNavigate();

    const [id, setId] = useState(null);
    const [email, setEmail] = useState("");
    const [curr_name, setCName] = useState("");
    const [new_name, setNName] = useState("");

    const del_title = "Delete your account?"
    const del_text = "Are you sure you want to delete your account and all of its data? This action cannot be undone.";

    const [isLoading, setLoading] = useState(true);

    const [confirmModal, showConfirm] = useState(false);
    const [passModal, showChangePass] = useState(false);

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
        if(new_name === "") return;

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
        showConfirm(true)
    }

    async function handleChangePass(event){
        event.preventDefault();
        showChangePass(true)
    }

    async function handleConfirm(){
        try{
            const response = await UserService.delete(id);
            console.log(response.data.msg);
            localStorage.setItem("authenticated", "false");
            localStorage.removeItem("user_id");
            navigate("/login");
        } catch(error) {
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
            alert('Could not delete your account at this time!');
        }
    }

    return (
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
                        <p className="settings_option_title">Change Password:</p>
                        <p className="settings_option_pass" onClick={handleChangePass}>Change my password.</p>
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
            {confirmModal && <Confirm closeModal={showConfirm} onConfirm={handleConfirm} text={del_text} title={del_title}/>}
            {passModal && <ChangePassword closeModal={showChangePass} email={email}/>}
        </div>
    )   
}

export default Settings;