import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import eventService from '../../services/EventService';
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
                const eventsData = await eventService.getAllEvents(token);
                setEvents(eventsData);
            } catch (err) {
                setError('Failed to fetch events.');
                console.error('Error fetching events:', err);
                if (err.message.includes('401')) {
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    Upcoming Events
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/events/create"
                >
                    Create Event
                </Button>
            </Box>
            {events.length > 0 ? (
                <List>
                    {events.map(event => (
                        <Paper key={event._id} elevation={3} sx={{ mb: 2, p: 2 }}>
                            <ListItem alignItems="center">
                                <ListItemText
                                    primary={event.name}
                                    secondary={`Date: ${new Date(event.date).toLocaleDateString()}${event.time ? ` at ${event.time}` : ''}`}
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