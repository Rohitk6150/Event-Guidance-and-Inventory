// frontend/src/services/inventoryService.js
import axios from 'axios';

const getAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

const getAllInventoryItems = async (token) => {
    try {
        const response = await axios.get('/api/inventory', getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch inventory';
    }
};

const getInventoryItemById = async (id, token) => {
    try {
        const response = await axios.get(`/api/inventory/${id}`, getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch inventory item details';
    }
};

const addInventoryItem = async (itemData, token) => {
    try {
        const response = await axios.post('/api/inventory', itemData, getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to add inventory item';
    }
};

const updateInventoryItem = async (id, itemData, token) => {
    try {
        const response = await axios.put(`/api/inventory/${id}`, itemData, getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update inventory item';
    }
};

const deleteInventoryItem = async (id, token) => {
    try {
        const response = await axios.delete(`/api/inventory/${id}`, getAuthHeader(token));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete inventory item';
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