import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';

const EditInventoryItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`/api/inventory/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const itemData = response.data;
                setName(itemData.name);
                setDescription(itemData.description || '');
                setQuantity(itemData.quantity || 0);
                setUnit(itemData.unit || '');
            } catch (err) {
                setError('Failed to fetch inventory item details for editing.');
                console.error('Error fetching item details:', err);
                if (err.response?.status === 404) {
                    navigate('/inventory');
                } else if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchItemDetails();
        } else if (!token) {
            navigate('/login');
        }
    }, [token, id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.put(
                `/api/inventory/${id}`,
                { name, description, quantity, unit },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/inventory'); // Redirect to inventory list after successful update
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update inventory item');
            console.error('Error updating inventory item:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Edit Inventory Item
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
                        Save Changes
                        {loading && <span className="loading-indicator"></span>}
                    </Button>
                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/inventory')}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditInventoryItem;