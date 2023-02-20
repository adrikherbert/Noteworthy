import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar.js"
import "../page.css"

const AuthWrapper = () => {
    const auth = localStorage.getItem("authenticated");

    return (auth=="true") ? (
        <div className="mainContainer">
            <Navbar />
        </div>
    ) : (
        <Navigate to="/login"/>
    )
}

export default AuthWrapper;
