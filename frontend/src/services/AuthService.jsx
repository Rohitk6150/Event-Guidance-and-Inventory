// frontend/src/services/authService.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5001', // Make sure this matches your backend server port
    headers: {
        'Content-Type': 'application/json',
    },
});

const register = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(error.response.data.message || 'Registration failed');
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from server. Please try again.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error setting up registration request');
        }
    }
};

const login = async (credentials) => {
    try {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(error.response.data.message || 'Login failed');
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from server. Please try again.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error setting up login request');
        }
    }
};

const authService = {
    register,
    login,
};

export default authService;