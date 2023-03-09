import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';

import "./add_collection_modal.css";
import UserService from '../services/user.service'

const ForgotPassword = ({ closeModal }) => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    function handleConfirm(){
        if(email === "") {
            alert("Please add some text!");
            return;
        }

        const data = {"email": email};
        try {
            const response = UserService.tempPass(data);
            alert("Email sent!");
            closeModal(false);
            navigate("/resetpassword");
        } catch(error){
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
                if(error.response.status == 452){
                    alert('We have no accounts with that email!')
                } else {
                    alert("Failed to send email.");
                }
            } else {
                console.log(error);
                alert("Failed to send email.");
            }
            
        }
    }

    return ReactDOM.createPortal(
        <div className="addcol_modal_background">
            <div className="addcol_modal_container">
                <div className="addcol_modal_title">
                    Reset Password
                </div>
                <form className="addcol_modal_text_box" onSubmit={handleConfirm}>
                    <label>Please enter your email:<br/>
                        <input 
                            type="text"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
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

export default ForgotPassword