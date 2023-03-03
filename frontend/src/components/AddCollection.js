import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import "./add_collection_modal.css";

const AddCollection = ({ closeModal, onConfirm}) => {
    const [title, setTitle] = useState("");

    function handleConfirm(){
        if(title === "") {
            alert("Please add some text!");
            return;
        }
        closeModal(false);
        onConfirm(title);
    }

    return ReactDOM.createPortal(
        <div className="addcol_modal_background">
            <div className="addcol_modal_container">
                <div className="addcol_modal_title">
                    Please name your new Collection
                </div>
                <form className="addcol_modal_text_box" onSubmit={handleConfirm}>
                    <label>Collection Name:<br/>
                        <input 
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            // className="input_box"
                        />
                    </label>
                    </form>
                <div className="addcol_modal_confirm_options">
                    <button className="addcol_modal_buttons" onClick={() => closeModal(false)}>Cancel</button>
                    <button className="addcol_modal_buttons" onClick={ handleConfirm }>Confirm</button>
                </div>
            </div>
        </div>
        ,document.body
    )
}

export default AddCollection