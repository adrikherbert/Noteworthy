import React, { useState, useEffect } from 'react';

import '../page.css';

const UserHome = () => {
    const [id, setId] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const stored_id = localStorage.getItem("user_id");
        setId(stored_id)
        getUser(stored_id);
    }, [])

    async function getUser(uid) {
        //API request to get user based on id

        //set name and email
    }

    return(
        <div className="titleSplit">
            <div className="titleBar">
                <h1>User - Home</h1>
            </div>
            <div className="pageContainer"> 
                <div className="left">
                    <h1>My Collections</h1>
                </div>
                <div className="right">
                    <h1>Notes</h1>
                </div>
            </div>
        </div>
    )   
}

export default UserHome;