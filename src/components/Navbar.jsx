import React, { useContext } from "react";
import logo from "../assets/IITR.jpeg";
import { Link } from 'react-router-dom';
import AuthContext from "../context/AuthContext";

const Navbar = () => {

    const { user } =  useContext(AuthContext)

    return (
        <div className = "navbar">
            <img className = "logo" src={logo} alt = "IITR Logo" />
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>My Dashboard</Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
            { user && user.is_admin && <Link to="/members" style={{ color: 'white', textDecoration: 'none' }}>Members</Link> }
        </div>
    )
}

export default Navbar;