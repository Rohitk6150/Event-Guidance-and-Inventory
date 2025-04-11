// frontend/src/components/inventory/AddInventoryItem.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const AddInventoryItem = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(
                '/api/inventory',
                { name, description, quantity, unit },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/inventory'); // Redirect to inventory list after successful addition
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add inventory item');
            console.error('Error adding inventory item:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Add New Inventory Item
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Item Name"
                        name="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="description"
                        label="Description"
                        name="description"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="quantity"
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="unit"
                        label="Unit (e.g., pieces, sets)"
                        name="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        Add Item
                        {loading && <span className="loading-indicator"></span>}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddInventoryItem;