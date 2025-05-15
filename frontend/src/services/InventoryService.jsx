// frontend/src/services/inventoryService.js
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

const getAllInventoryItems = async (token) => {
    try {
        const response = await api.get('/api/inventory', getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch inventory');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to fetch inventory');
        }
    }
};

const getInventoryItemById = async (id, token) => {
    try {
        const response = await api.get(`/api/inventory/${id}`, getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch inventory item details');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to fetch inventory item details');
        }
    }
};

const addInventoryItem = async (itemData, token) => {
    try {
        const response = await api.post('/api/inventory', itemData, getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to add inventory item');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to add inventory item');
        }
    }
};

const updateInventoryItem = async (id, itemData, token) => {
    try {
        const response = await api.put(`/api/inventory/${id}`, itemData, getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to update inventory item');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to update inventory item');
        }
    }
};

const deleteInventoryItem = async (id, token) => {
    try {
        const response = await api.delete(`/api/inventory/${id}`, getAuthHeader(token));
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to delete inventory item');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('Error setting up request to delete inventory item');
        }
    }
};

const inventoryService = {
    getAllInventoryItems,
    getInventoryItemById,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
};

export default inventoryService;