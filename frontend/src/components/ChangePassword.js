import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import {ReactComponent as Hidden} from "../images/EyeHidden.svg";
import {ReactComponent as Shown} from "../images/EyeOpen.svg";

import UserService from '../services/user.service.js';

import "./add_collection_modal.css";

const AddCollection = ({ closeModal, onConfirm, email}) => {
    const [curr_password, setCPassword] = useState("");
    const [new_password, setNPassword] = useState("");

    const [correctPass, setCorrectPass] = useState(false);
    const [validPassword, setVPassword] = useState(false);
    const [passwordShown, setPShown] = useState(false);

    const vPassword = new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/);

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
                <form className="enter_form" onSubmit={handleSubmit}>
                    <label>Current Password:<br/>
                        <input 
                            type="text" 
                            value={curr_password}
                            onChange={(event) => setCPassword(event.target.value)}
                            className="input_box"
                        />
                        {correctPass && <p className="invalid_email">
                            Incorrect Password!
                        </p>}
                    </label>
                    <label>New Password:<br/>
                        <div className="password">
                            <input 
                                type={passwordShown ? "text" : "password"}
                                value={new_password}
                                onChange={(event) => setNPassword(event.target.value)}
                                className="input_box"
                            />
                            <Tooltip title={passwordShown ? "Hide Password" : "Show Password"} placement="top-start" arrow>
                                {passwordShown ? <Shown onClick={togglePassword} className="eye"/> : <Hidden onClick={togglePassword} className="eye"/>}
                            </Tooltip>
                        </div>
                        {validPassword && <p className="invalid_password">
                            Invalid Password! A password must contain:<br/>
                             - 8 or more characaters<br/>
                             - An uppercase and lowercase letter<br/>
                             - A number<br/>
                             - A special character: @#$%^&+=
                        </p>}
                    </label>
                    <input type="submit" value="Submit" className="submit_button"/>
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