import React from 'react';
import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom'; // For nested routes if you decide to have separate /auth/login and /auth/register
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import { Routes, Route } from 'react-router-dom';

const AuthPage = () => {
    return (
        <Container maxWidth="sm">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Box>
        </Container>
    );
};

export default AuthPage;