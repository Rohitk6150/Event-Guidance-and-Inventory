import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Event & Inventory Manager
                </Typography>
                {isAuthenticated ? (
                    <Box>
                        <Button color="inherit" component={Link} to="/events">Events</Button>
                        <Button color="inherit" component={Link} to="/inventory">Inventory</Button>
                        <Button color="inherit" component={Link} to="/events/create">Create Event</Button>
                        <Button color="inherit" component={Link} to="/inventory/add">Add Inventory</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;