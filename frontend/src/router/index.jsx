import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';
import EventListPage from '../pages/EventListPage';
import EventDetailPage from '../pages/EventDetailPage';
import CreateEventPage from '../pages/CreateEventPage';
import EditEventPage from '../pages/EditEventPage';
import InventoryListPage from '../pages/InventoryListPage';
import AddInventoryPage from '../pages/AddInventoryPage';
import EditInventoryPage from '../pages/EditInventoryPage';
import Navbar from '../components/layout/Navbar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f0f2f5',
        },
    },
});

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Navbar />
                    <div style={{ padding: '20px' }}>
                        <Routes>
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/events" element={<PrivateRoute><EventListPage /></PrivateRoute>} />
                            <Route path="/events/create" element={<PrivateRoute><CreateEventPage /></PrivateRoute>} />
                            <Route path="/events/:id" element={<PrivateRoute><EventDetailPage /></PrivateRoute>} />
                            <Route path="/events/edit/:id" element={<PrivateRoute><EditEventPage /></PrivateRoute>} />
                            <Route path="/inventory" element={<PrivateRoute><InventoryListPage /></PrivateRoute>} />
                            <Route path="/inventory/add" element={<PrivateRoute><AddInventoryPage /></PrivateRoute>} />
                            <Route path="/inventory/edit/:id" element={<PrivateRoute><EditInventoryPage /></PrivateRoute>} />
                            <Route path="/" element={<Navigate to="/events" />} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default AppRouter;