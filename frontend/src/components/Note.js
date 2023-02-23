
import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

import './notes.css';

const Note = ({data}) => {

    return(
        <div className="note_container">
            <div className="note_title">
                {data.title}
            </div>
            <div className="note_text">
                {data.text}
            </div>
            <div className="note_bottom">
                text
            </div>
        </div>
    );
}

export default Note