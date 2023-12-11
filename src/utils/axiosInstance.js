import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'

const baseURL = 'http://127.0.0.1:8000'

let authToken =  localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')) : null
let refreshToken = localStorage.getItem('refresh_token') ? JSON.parse(localStorage.getItem('refresh_token')) : null

const axiosInstance = axios.create({
    baseURL,
    headers: {
        Authorization: `Bearer ${authToken}`
    }
});

axiosInstance.interceptors.request.use(async req => {

    if(authToken){
        authToken =  localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')) : null
        req.headers.Authorization = `Bearer ${authToken}`
    }

    const user = jwtDecode(authToken)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    console.log('isExpired: ', isExpired)
    if(!isExpired) return req

    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
        refresh: refreshToken
    })

    localStorage.setItem('access_token', JSON.stringify(response.data.access))
    localStorage.setItem('refresh_token', JSON.stringify(response.data.refresh))
    req.headers.Authorization = `Bearer ${response.data.access}`
    return req
})

export default axiosInstance