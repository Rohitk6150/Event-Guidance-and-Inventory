import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    CircularProgress,
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';

const InventoryList = () => {
    const [inventory, setInventory] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/inventory', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInventory(response.data);
            } catch (err) {
                setError('Failed to fetch inventory.');
                console.error('Error fetching inventory:', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchInventory();
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Inventory
            </Typography>
            {inventory.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table aria-label="inventory table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Unit</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventory.map(item => (
                                <TableRow key={item._id}>
                                    <TableCell component="th" scope="row">
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">{item.unit}</TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/inventory/${item._id}`} aria-label="view">
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton component={Link} to={`/inventory/edit/${item._id}`} aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No inventory items found.</Typography>
            )}
        </div>
    );
};

export default InventoryList;