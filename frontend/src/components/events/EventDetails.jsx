import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    Typography,
    Paper,
    Box,
    Button,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import EventTimeline from '../timeline/EventTimeline';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEventDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvent(response.data);
            } catch (err) {
                setError('Failed to fetch event details.');
                console.error('Error fetching event details:', err);
                if (err.response?.status === 404) {
                    navigate('/events'); // Redirect if event not found
                } else if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchEventDetails();
        } else if (!token) {
            navigate('/login');
        }
    }, [token, id, navigate]);

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!event) {
        return <Typography>Event not found.</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {event.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Date: {new Date(event.date).toLocaleDateString()}
                    {event.time && ` - ${event.time}`}
                </Typography>
                {event.location && (
                    <Typography variant="body1" gutterBottom>
                        Location: {event.location}
                    </Typography>
                )}
                {event.description && (
                    <Typography variant="body1" gutterBottom>
                        Description: {event.description}
                    </Typography>
                )}

                <Typography variant="h6" mt={3} gutterBottom>
                    Progress Timeline
                </Typography>
                {event.milestones && event.milestones.length > 0 ? (
                    <EventTimeline milestones={event.milestones} />
                ) : (
                    <Typography>No milestones defined for this event.</Typography>
                )}

                <Typography variant="h6" mt={3} gutterBottom>
                    Associated Inventory
                </Typography>
                {event.inventory && event.inventory.length > 0 ? (
                    <List>
                        {event.inventory.map(itemId => (
                            <ListItem key={itemId}>
                                <ListItemText primary={`Inventory Item ID: ${itemId}`} />
                                {/* You might want to fetch and display actual inventory item details here */}
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No inventory associated with this event.</Typography>
                )}

                <Box mt={3}>
                    <Button variant="contained" color="primary" component={Link} to={`/events/edit/${event._id}`} sx={{ mr: 2 }}>
                        Edit Event
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/events')}>
                        Back to Events
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default EventDetails;