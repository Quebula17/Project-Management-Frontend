import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(() => localStorage.getItem('access_token') ? jwtDecode(localStorage.getItem('access_token')) : null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')) : null);
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token') ? JSON.parse(localStorage.getItem('refresh_token')) : null);
    const [loading, setLoading] = useState(true)


    const loginUser = async () => {
        const params = new URLSearchParams(window.location.search);
        const access = params.get('access');
        const refresh = params.get('refresh');
    
        if (access) {
            console.log('Access token:', access);
            console.log('Refresh token:', refresh);
    
            setAuthToken(access);
            const decodedAccess = jwtDecode(access);

            setUser(decodedAccess);
            console.log(decodedAccess);
            console.log(decodedAccess.first_name);

            localStorage.setItem('access_token', JSON.stringify(access));
            localStorage.setItem('refresh_token', JSON.stringify(refresh));
        } else {
            console.log('Access token not found in URL parameters.');
        }
    }

    const logoutUser = () => {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    // const updateToken = async () => {

    //     console.log("Updating token")
    //     const refresh = JSON.parse(localStorage.getItem('refresh_token'));
    //     const response = await fetch('http://localhost:8000/api/token/refresh/', {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken':Cookies.get('csrftoken'),
                
    //         },
    //         body: JSON.stringify({'refresh': refresh}),
    //     });
    //     const data = await response.json();

    //     if (response.status === 200) {
    //     console.log(data);
    //     setAuthToken(data.access);
    //     setUser(jwtDecode(data.access));
    //     localStorage.setItem('access_token', JSON.stringify(data.access));
    //     localStorage.setItem('refresh_token', JSON.stringify(data.refresh));
    //     }
    //     else {
    //         logoutUser();
    //     }
    // }

    const contextData = {
        user: user,
        authToken: authToken,
        refreshToken: refreshToken,
        setUser: setUser,
        loginUser: loginUser,
        logoutUser: logoutUser,
        setAuthToken: setAuthToken,
        setRefreshToken: setRefreshToken
    }

    useEffect(() => {

        if(authToken){
            setUser(jwtDecode(authToken))
        }
        setLoading(false)

    }, [authToken, loading])


    return (
        <AuthContext.Provider value = {contextData}>
            {children}
        </AuthContext.Provider>
    )
}