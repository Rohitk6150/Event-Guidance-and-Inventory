import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Footer = () => {
    return (
        <AppBar position="static" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="inherit" align="center">
                        &copy; {new Date().getFullYear()} Event & Inventory Management
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;