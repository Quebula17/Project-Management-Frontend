import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRoutes = () => {
    console.log("Private route is working")
    const {user} = useContext(AuthContext);

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes;