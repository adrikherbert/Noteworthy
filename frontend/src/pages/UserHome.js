import React, { useState, useEffect } from 'react';

import Notes from '../components/Notes'
import '../page.css';

import UserService from '../services/user.service.js';

const UserHome = () => {
    const [id, setId] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const stored_id = localStorage.getItem("user_id");
        getUser(stored_id);
        setId(stored_id);
        // setLoading(false);
    }, [])


    async function getUser(uid) {
        //API request to get user based on id
        try {
            const response = await UserService.get(uid);
            console.log(response);
        } catch (error) {
            console.log(error);
            console.log("Error Code " + error.code + ": " + error.msg);
            alert("Unable to load data at this time.")
        }

        //set name and email
        // setName("Quin")
        // setEmail("quin@gmail.com")
        setLoading(false);
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
            <h1 className="titleBar">{name} - Home</h1>
            <div className="pageContainer"> 
                <div className="left">
                    <h1>My Collections</h1>
                </div>
                <Notes user_id={id} />
            </div>
        </div>
    )   
}

export default UserHome;