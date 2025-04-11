import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Paper,
    IconButton,
    Box,
    CircularProgress,
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/events', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(response.data);
            } catch (err) {
                setError('Failed to fetch events.');
                console.error('Error fetching events:', err);
                // Optionally redirect to login if unauthorized
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchEvents();
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
                Upcoming Events
            </Typography>
            {events.length > 0 ? (
                <List>
                    {events.map(event => (
                        <Paper key={event._id} elevation={3} sx={{ mb: 2, p: 2 }}>
                            <ListItem alignItems="center">
                                <ListItemText
                                    primary={event.name}
                                    secondary={`Date: ${new Date(event.date).toLocaleDateString()}`}
                                />
                                <IconButton edge="end" aria-label="view" component={Link} to={`/events/${event._id}`}>
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="edit" component={Link} to={`/events/edit/${event._id}`}>
                                    <EditIcon />
                                </IconButton>
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            ) : (
                <Typography>No events found.</Typography>
            )}
        </div>
    );
};

export default EventList;