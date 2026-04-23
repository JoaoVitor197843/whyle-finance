import axios from 'axios';
import getCSRFToken from '../utils/getCSRFToken';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config
        const publicRoutes = ['/user/me/']
        if (publicRoutes.some(route => originalRequest.url?.includes(route))) {
                return Promise.reject(error)
                }
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                await api.post('/auth/token-refresh/')
                return api(originalRequest)
            } catch {
                
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

api.interceptors.request.use((config) => {
    const csrf = getCSRFToken();
    const method = (config.method ?? 'get').toLowerCase()
    if (csrf && ["post", "put", "patch", "delete"].includes(method)) {
        config.headers['X-CSRFToken'] = csrf;
    }
    return config;
});