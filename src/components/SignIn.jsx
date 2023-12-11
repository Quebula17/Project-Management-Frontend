import React from "react";
import omniport from "../assets/omniport.png";

const SignIn = () => {

    const handleSignIn = () => {
        window.location.href = 'http://localhost:8000/api/oauth/authorize';       
    }

    return(
        <div className="signin-div">
        <div className="sign-in-description">Weclome to Project Management Web App!</div>
        <button className="sign-in" onClick={handleSignIn}>Continue with Omniport <img className="omniport" src={omniport} alt="omniport logo"/></button>
        </div>
    )
}

export default SignIn;