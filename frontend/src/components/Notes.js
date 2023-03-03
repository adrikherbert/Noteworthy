import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

import Note from './Note'

import NoteService from '../services/note.service.js';

import './notes.css';

const Notes = ({user_id, col_id, col_name}) => {
    const [notes, setNotes] = useState([]);
    const [collection_id, setColID] = useState(null);
    const [collection_name, setColName] = useState("");
    const [numNotes, setNumNotes] = useState(null);

    useEffect(() => {
        // const col_id = localStorage.getItem("curr_collection_id");
        setColID(col_id);
        setColName(col_name);
        getNotes();
    }, [col_id, numNotes])

    async function getNotes() {
        const constraints = "" + user_id + "," + col_id;
        const info = {"resource": "user_id,collection_id", "constraint": constraints}
        try {
            const response = await NoteService.getAll(info);
            // console.log(response);
            let list = [];
            response.data.results.forEach(function(note) {
                const data = {
                    id: note.id,
                    title: note.title,
                    text: note.content,
                    url: note.url
                }
                list.push(data);
            });
            setNotes(list);

        } catch(error){
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
        }
    }

    async function noteDeleted(){
        setNumNotes(numNotes-1);
    }

    return(
        <div className="notelist_container">
            <h1 className="notelist_title">Notes - {collection_name}</h1>
            <div className="notelist">
                <ul>
                    {notes.map((data) => 
                        <Note key={data.id} data={data} onDelete={noteDeleted}/>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Notes