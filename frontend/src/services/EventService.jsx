// frontend/src/services/eventService.js
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // While you can import it here, it's often better to pass the token

const getAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

const getAllEvents = async (token) => {
    try {
        const response = await axios.get('/api/events', getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch events';
    }
};

const getEventById = async (id, token) => {
    try {
        const response = await axios.get(`/api/events/${id}`, getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch event details';
    }
};

const createEvent = async (eventData, token) => {
    try {
        const response = await axios.post('/api/events', eventData, getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create event';
    }
};

const updateEvent = async (id, eventData, token) => {
    try {
        const response = await axios.put(`/api/events/${id}`, eventData, getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update event';
    }
};

const deleteEvent = async (id, token) => {
    try {
        const response = await axios.delete(`/api/events/${id}`, getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete event';
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