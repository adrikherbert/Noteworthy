import React, { useState, useEffect } from 'react';

import Notes from '../components/Notes'
import Collections from '../components/Collections'
import '../page.css';

import UserService from '../services/user.service';

const UserHome = () => {
    const [id, setId] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const stored_id = localStorage.getItem("user_id");
        getUser(stored_id);
        setId(stored_id);
    }, [])

    async function test(e){
        const data = {"resource": "email", "constraint": e}
        try {
            const response = await UserService.getAll(data);
            console.log(response);

        } catch(error){
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
        }
    }


    async function getUser(uid) {
        //API request to get user based on id
        try {
            const response = await UserService.get(uid);
            setName(response.data.user.username);
            setEmail(response.data.user.email);
            // localStorage.setItem("curr_collection_id", response.data.user.root_collection_id)
            setLoading(false);
            test(response.data.user.email);
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

    return(
        <div className="titleSplit">
            <h1 className="titleBar">{name} - Home</h1>
            <div className="pageContainer"> 
                <Collections user_id={id} />
                <Notes user_id={id} />
            </div>
        </div>
    )   
}

export default UserHome;