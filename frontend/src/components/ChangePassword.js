import { useState } from 'react';
import ReactDOM from 'react-dom';
import { Tooltip } from "@mui/material"

import {ReactComponent as Hidden} from "../images/EyeHidden.svg";
import {ReactComponent as Shown} from "../images/EyeOpen.svg";

import UserService from '../services/user.service.js';

import "./change_password.css";

const ChangePassword = ({ closeModal, email}) => {
    const [curr_password, setCPassword] = useState("");
    const [new_password, setNPassword] = useState("");

    const [correctPass, setCorrectPass] = useState(false);
    const [validPassword, setVPassword] = useState(false);
    const [passwordCShown, setCPShown] = useState(false);
    const [passwordNShown, setNPShown] = useState(false);

    const vPassword = new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/);

    async function handleSubmit(event){
        event.preventDefault();
        if(!validate()) return;
        try {
            const data = {"email": email, "old_password": curr_password, "new_password": new_password};
            await UserService.passReset(data);
            alert('Success! Password changed.');
            closeModal(false);
        } catch (error) {
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
                switch(error.response.status){
                    case 400:
                        setCorrectPass(false);
                        break;
                    case 453:
                        setCorrectPass(true);
                        break;
                    default:
                }
            } else {
                console.log(error);
                alert("Unable to reset password at this time.");
            }
        }
    }

    const validate = () => {
        let valid = true;

        if(vPassword.test(new_password)){
            setVPassword(false);
        } else {
            setVPassword(true);
            setCorrectPass(false);
            valid = false;
        }
        return valid;
    };

    const toggleCPassword = () => {
        setCPShown(!passwordCShown);
    }

    const toggleNPassword = () => {
        setNPShown(!passwordNShown);
    }

    return ReactDOM.createPortal(
        <div className="cp_modal_background">
            <div className="cp_modal_container">
                <div className="cp_modal_title">
                    Change your password.
                </div>
                <form className="cp_form" onSubmit={handleSubmit}>
                    <label>Current Password:<br/>
                        <div className="password">
                            <input 
                                type={passwordCShown ? "text" : "password"} 
                                value={curr_password}
                                onChange={(event) => setCPassword(event.target.value)}
                                className="input_box"
                            />
                            <Tooltip title={passwordCShown ? "Hide Password" : "Show Password"} placement="top-start" arrow>
                                {passwordCShown ? <Shown onClick={toggleCPassword} className="eye"/> : <Hidden onClick={toggleCPassword} className="eye"/>}
                            </Tooltip>
                        </div>
                        {correctPass && <p className="invalid_email">
                            Incorrect Password!
                        </p>}
                    </label>
                    <label>New Password:<br/>
                        <div className="password">
                            <input 
                                type={passwordNShown ? "text" : "password"}
                                value={new_password}
                                onChange={(event) => setNPassword(event.target.value)}
                                className="input_box"
                            />
                            <Tooltip title={passwordNShown ? "Hide Password" : "Show Password"} placement="top-start" arrow>
                                {passwordNShown ? <Shown onClick={toggleNPassword} className="eye"/> : <Hidden onClick={toggleNPassword} className="eye"/>}
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
                </form>
                <div className="cp_modal_confirm_options">
                    <button className="cp_modal_buttons" onClick={() => closeModal(false)}>Cancel</button>
                    <button className="cp_modal_buttons" onClick={ handleSubmit }>Submit</button>
                </div>
            </div>
        </div>
        ,document.body
    )
}

export default ChangePassword