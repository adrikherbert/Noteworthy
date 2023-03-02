import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import "./confirm_modal.css";

const Confirm = ({ closeModal, onConfirm, text, title}) => {

    function handleConfirm(){
        closeModal(false);
        onConfirm();
    }

    return ReactDOM.createPortal(
        <div className="modal_background">
            <div className="modal_container">
                <div className="modal_title">
                    {title}
                </div>
                <div className="modal_text_box">
                    {text}
                </div>
                <div className="modal_confirm_options">
                    <button className="modal_buttons" onClick={() => closeModal(false)}>Cancel</button>
                    <button className="modal_buttons" onClick={ handleConfirm }>Confirm</button>
                </div>
            </div>
        </div>
        ,document.body
    )
}

export default Confirm