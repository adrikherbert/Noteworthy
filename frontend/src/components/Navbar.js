import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';


const Navbar = () => {

    const handleLogOut = () => {
        localStorage.setItem("authenticated", "false");
        localStorage.removeItem("user_id");
    }

    const [id, setId] = useState(0);

    useEffect(() => {
        setId(localStorage.getItem("user_id"));
    }, []);

    return(
        <>
        <nav className="navbar">
            <ul>
            <li className="navblockli">
                <Link to={"/home"}>Home</Link>
            </li>
            <li className="navblockli">
                <Link onClick={handleLogOut} to="/login" >Log Out</Link>
            </li>
            </ul>
        </nav>
        <Outlet />
        </>
    );
}

export default Navbar