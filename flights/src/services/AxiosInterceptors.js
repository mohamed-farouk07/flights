import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

api.interceptors.response.use(response => response, async error => {
    const { config, response } = error;
    if (response.status === 401 && !config.__isRetryRequest) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const { token, refreshToken: newRefreshToken } = await refreshToken({ refreshToken });
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', newRefreshToken);
                
                // Retry the original request
                config.__isRetryRequest = true;
                config.headers.Authorization = `Bearer ${token}`;
                return api(config);
            } catch (err) {
                // Handle token refresh failure and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        } else {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default api;
