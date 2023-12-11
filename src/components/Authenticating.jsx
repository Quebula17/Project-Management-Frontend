import React, {useContext, useEffect} from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Authenticating = () => {
    
   const {loginUser} = useContext(AuthContext);
   const navigate = useNavigate();

   useEffect(() => {
    loginUser();
        }, []
    )
    
    return navigate('/')
}

export default Authenticating;