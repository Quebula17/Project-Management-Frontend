import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import { useContext } from "react";
import axiosInstance from "./axiosInstance";
import AuthContext from "../context/AuthContext";

const baseURL = 'http://127.0.0.1:8000'


const useAxios = () => {

    const { authToken, setUser, setAuthToken, refreshToken, setRefreshToken } = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });

    axiosInstance.interceptors.request.use(async req => {
    
        const user = jwtDecode(authToken)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        console.log('isExpired: ', isExpired)
        if(!isExpired) return req
    
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: refreshToken
        })
    
        localStorage.setItem('access_token', JSON.stringify(response.data.access))
        localStorage.setItem('refresh_token', JSON.stringify(response.data.refresh))

        setAuthToken(response.data.access)
        setRefreshToken(response.data.refresh)
        setUser(jwtDecode(response.data.access))

        
        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    })
    


    return axiosInstance
}

export default useAxios;