// frontend/src/services/authService.js
import axios from 'axios';

const register = async (userData) => {
    try {
        const response = await axios.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

const login = async (credentials) => {
    try {
        const response = await axios.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};

const authService = {
    register,
    login,
};

export default authService;