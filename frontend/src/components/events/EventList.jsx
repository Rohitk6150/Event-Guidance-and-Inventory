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
    Alert,
    Tooltip,
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

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

    const handleEdit = (id) => {
        navigate(`/events/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.deleteEvent(id, token);
                setEvents(events.filter(event => event._id !== id));
            } catch (err) {
                setError(err.message || 'Failed to delete event');
            }
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
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
                                <Tooltip title="Edit">
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(event._id)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(event._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
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