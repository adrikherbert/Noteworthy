import React, { useState, useEffect } from 'react';

import Notes from '../components/Notes'
import Collections from '../components/Collections'
import '../page.css';

import UserService from '../services/user.service';

const UserHome = () => {
    const [id, setId] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [root_id, setRootId] = useState(null);
    const [collection_id, setColID] = useState(null);
    const [collection_name, setColName] = useState("");

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const stored_id = localStorage.getItem("user_id");
        getUser(stored_id);
        setId(stored_id);
    }, [])

    async function getUser(uid) {
        //API request to get user based on id
        try {
            const response = await UserService.get(uid);
            setName(response.data.user.username);
            setEmail(response.data.user.email);
            const rid = response.data.user.root_collection_id;
            setRootId(rid);
            setColID(rid);
            setColName("General")
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

    async function changeNotes(new_id, name){
        setColID(new_id);
        setColName(name);
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
                <Collections user_id={id} root_id={root_id} updateId={changeNotes}/>
                <Notes user_id={id} col_id={collection_id} col_name={collection_name}/>
            </div>
        </div>
    )   
}

export default UserHome;