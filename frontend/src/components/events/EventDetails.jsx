import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    Container,
    Alert,
    Divider,
    Chip,
} from '@mui/material';
import EventTimeline from '../timeline/EventTimeline';
import eventService from '../../services/EventService';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await eventService.getEventById(id, token);
                setEvent(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch event details');
                if (err.message?.includes('404')) {
                    navigate('/events');
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
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="outlined" onClick={() => navigate('/events')}>
                    Back to Events
                </Button>
            </Container>
        );
    }

    if (!event) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Event not found
                </Alert>
                <Button variant="outlined" onClick={() => navigate('/events')}>
                    Back to Events
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                {/* Event Basic Information */}
                <Box mb={3}>
                    <Typography variant="h4" gutterBottom>
                        {event.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Date: {new Date(event.date).toLocaleDateString()}
                        </Typography>
                        <Chip 
                            label={event.status} 
                            color={
                                event.status === 'Completed' ? 'success' : 
                                event.status === 'In Progress' ? 'warning' : 
                                'default'
                            } 
                            size="small"
                        />
                    </Box>
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
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Progress Timeline Section */}
                <Box mb={3}>
                    <Typography variant="h5" gutterBottom>
                        Progress Timeline
                    </Typography>
                    {event.milestones && event.milestones.length > 0 ? (
                        <EventTimeline milestones={event.milestones} />
                    ) : (
                        <Alert severity="info">
                            No milestones defined for this event.
                        </Alert>
                    )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Associated Inventory Section */}
                <Box mb={3}>
                    <Typography variant="h5" gutterBottom>
                        Associated Inventory
                    </Typography>
                    {event.inventory && event.inventory.length > 0 ? (
                        <List>
                            {event.inventory.map((item, index) => (
                                <ListItem 
                                    key={index}
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        mb: 1,
                                    }}
                                >
                                    <ListItemText 
                                        primary={item.name || `Inventory Item ${index + 1}`}
                                        secondary={
                                            <Box component="span">
                                                <Typography variant="body2" component="span">
                                                    Quantity: {item.quantity}
                                                </Typography>
                                                {item.unit && (
                                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                                        Unit: {item.unit}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Alert severity="info">
                            No inventory associated with this event.
                        </Alert>
                    )}
                </Box>

                {/* Action Buttons */}
                <Box mt={3} display="flex" gap={2}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        component={Link} 
                        to={`/events/edit/${event._id}`}
                    >
                        Edit Event
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/events')}
                    >
                        Back to Events
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default EventDetails;