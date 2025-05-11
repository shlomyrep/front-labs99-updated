import axios from 'axios';
import { store } from '../app/store';
import { setToken, clearToken } from '../features/auth/authSlice';

const Axios = axios.create({
    baseURL: 'http://localhost:8080/', // ✅ matches your old app (no /api)
    withCredentials: true,
});

Axios.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

Axios.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        const token = store.getState().auth.token; // ✅ prevent refresh logic if not logged in

        if (err.response?.status === 401 && token && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await Axios.get('/auth/access-token');
                const newToken = res.data.accessToken;

                store.dispatch(setToken(newToken));
                localStorage.setItem('accessToken', newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return Axios(originalRequest);
            } catch (refreshError) {
                store.dispatch(clearToken());
                localStorage.removeItem('accessToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(err);
    }
);

export default Axios;
