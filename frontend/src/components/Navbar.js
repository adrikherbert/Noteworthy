import { Outlet, useNavigate } from "react-router-dom";
// import { useEffect, useState } from 'react';
import { Tooltip } from "@mui/material"

import {ReactComponent as HomeLogo} from "../images/Home.svg";
import {ReactComponent as Settings} from "../images/Settings.svg";
import {ReactComponent as LogOut} from "../images/LogOut.svg";


const Navbar = () => {
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.setItem("authenticated", "false");
        localStorage.removeItem("user_id");
        navigate("/login");
    }

    const handleButtonClick = (loc) => {
        navigate(loc);
    }

    return(
        <>
            <div className="navbar">
                <Tooltip title="Homepage" placement="right" arrow>
                    <HomeLogo className="navblockli" onClick={() => handleButtonClick("/home")}/>
                </Tooltip>
                <Tooltip title="Settings" placement="right" arrow>
                    <Settings className="navblockli" onClick={() => handleButtonClick("/settings")}/>
                </Tooltip>
                <Tooltip title="Log Out" placement="right" arrow>
                    <LogOut className="navblockli" onClick={() => handleLogOut()}/>
                </Tooltip>
            </div>
        <Outlet />
        </>
    );
}

export default Navbar