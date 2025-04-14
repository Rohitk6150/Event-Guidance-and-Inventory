import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import inventoryService from '../../services/InventoryService';
import { useAuth } from '../../context/AuthContext';

const InventoryList = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await inventoryService.getAllInventoryItems(token);
                setInventory(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch inventory items');
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [token]);

    const handleEdit = (id) => {
        navigate(`/inventory/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await inventoryService.deleteInventoryItem(id, token);
                setInventory(inventory.filter(item => item._id !== id));
            } catch (err) {
                setError(err.message || 'Failed to delete inventory item');
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2">
                    Inventory Items
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/inventory/add')}
                >
                    Add New Item
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(item._id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default InventoryList;