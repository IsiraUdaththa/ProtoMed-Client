import axios from 'axios';

let accessToken: string | null = null;

const apiUrl = process.env['NEXT_PUBLIC_API_URL'];

export const setAccessToken = (token: string) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const res = await axios.post(
                    `${apiUrl}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                const newAccessToken = res.data.accessToken;
                setAccessToken(newAccessToken);
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(error.config);
            } catch (refreshError) {
                console.error('Refresh token failed', refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
