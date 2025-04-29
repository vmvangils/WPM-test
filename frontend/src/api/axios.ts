import axios from 'axios';
// Axios library for making HTTP requests.
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
});

export default api; 