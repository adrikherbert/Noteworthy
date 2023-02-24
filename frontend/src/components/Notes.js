import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

import Note from './Note.js'

import './notes.css';

const Notes = ({user_id}) => {
    const [notes, setNotes] = useState([]);


    useEffect(() => {
        getNotes();
    }, [])

    async function getNotes() {
        let list = [];

        for (let i=0; i<10; i++){
            const data = {
                id: i,
                title: "This is a note title",
                text: "This is some text for a random note. It is slightlty longer. Actually a lot longer as people can type a shit ton for this part. hhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
            }
            list.push(data);
        }
        setNotes(list);
    }

    return(
        <div className="notelist_container">
            <h1 className="notelist_title">Notes - {user_id}</h1>
            <div className="notelist">
                <ul>
                    {notes.map((data) => 
                        <Note data={data}/>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Notes