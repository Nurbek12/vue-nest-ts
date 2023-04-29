import axios from "axios"

const token = localStorage.getItem('token') || ''
const api = axios.create({ baseURL: 'http://localhost:3001' })

export const refreshRequest = () => {
    if(token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

refreshRequest()

export default api