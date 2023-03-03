
import { useEffect, useState } from 'react';

import './notes.css';

import Confirm from './Confirm';
import NoteService from '../services/note.service.js';

import {ReactComponent as Link} from "../images/Link.svg";
import {ReactComponent as Trash} from "../images/Trash.svg";

const Note = ({data, onDelete}) => {
    const [confirmModal, showConfirm] = useState(false);

    const del_title = "Delete your Note?"
    const del_text = "Are you sure you want to delete this note? This action cannot be undone.";

    async function linkWebsite(){
        window.open(data.url, )
    }

    async function handleDelete(event){
        event.preventDefault();
        showConfirm(true)
    }

    async function handleConfirm(){
        try{
            const response = await NoteService.delete(data.id);
            // console.log(response.data.msg);
            onDelete();
        } catch(error) {
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
            alert('Could not delete your note at this time!');
        }
    }

    return(
        <div className="note_container">
            <div className="note_title">
                <p className="note_title_text">{data.title}</p>
                <Link className="note_title_button_link" onClick={linkWebsite}/>
                <Trash className="note_title_button_trash" onClick={handleDelete}/>
            </div>
            <div className="note_text">
                {data.text}
            </div>
            <div className="note_bottom">
                
            </div>
            {confirmModal && <Confirm closeModal={showConfirm} onConfirm={handleConfirm} text={del_text} title={del_title}/>}
        </div>
    );
}

export default Note