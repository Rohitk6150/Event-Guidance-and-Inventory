// frontend/src/services/eventService.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5001',
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

const getAllEvents = async (token) => {
    try {
        const response = await api.get('/api/events', getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch events');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to fetch events');
        }
    }
};

const getEventById = async (id, token) => {
    try {
        const response = await api.get(`/api/events/${id}`, getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch event details');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to fetch event details');
        }
    }
};

const createEvent = async (eventData, token) => {
    try {
        const response = await api.post('/api/events', eventData, getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to create event');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to create event');
        }
    }
};

const updateEvent = async (id, eventData, token) => {
    try {
        const response = await api.put(`/api/events/${id}`, eventData, getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to update event');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to update event');
        }
    }
};

const deleteEvent = async (id, token) => {
    try {
        const response = await api.delete(`/api/events/${id}`, getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to delete event');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to delete event');
        }
    }
};

const eventService = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};

export default eventService;