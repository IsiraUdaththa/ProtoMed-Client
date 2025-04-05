// services/authService.ts
import api, { getAccessToken, setAccessToken } from '@/lib/axiosInstance';
import { message } from 'antd';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email: string, password: string) => {
    const response = await axios.post(
        `${apiUrl}/auth/login`,
        { email, password },
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
    setAccessToken(response.data.accessToken);
    console.log(getAccessToken())
    message.success("Login successful!");

    return response.data;
};

export const logout = async () => {
    await api.post('/auth/logout');
    setAccessToken('');
};

export const refreshAccessToken = async () => {
    const response = await api.post('/auth/refresh');
    setAccessToken(response.data.accessToken);
};

export const getMe = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching data', error);
    }
};