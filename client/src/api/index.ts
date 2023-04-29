import axios from "axios"

const token = localStorage.getItem('token') || ''
const api = axios.create({ baseURL: 'https://adminpanel-vnps.onrender.com' })

export const refreshRequest = () => {
    if(token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

refreshRequest()

export default api