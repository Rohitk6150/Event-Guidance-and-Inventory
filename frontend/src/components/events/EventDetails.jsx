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
    Grid,
    Card,
    CardContent,
    LinearProgress,
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'success';
            case 'In Progress':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getMilestoneStatus = (milestone) => {
        const today = new Date();
        const milestoneDate = new Date(milestone.date);
        
        if (milestone.completed) {
            return { status: 'Completed', color: 'success' };
        } else if (milestoneDate < today) {
            return { status: 'Overdue', color: 'error' };
        } else if (milestoneDate.toDateString() === today.toDateString()) {
            return { status: 'Due Today', color: 'warning' };
        } else {
            return { status: 'Upcoming', color: 'info' };
        }
    };

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
                        {event.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Date: {new Date(event.date).toLocaleDateString()}
                        </Typography>
                        <Chip 
                            label={event.status} 
                            color={getStatusColor(event.status)}
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

                {/* Milestones Section */}
                {event.milestones && event.milestones.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="h6" gutterBottom>
                            Event Milestones
                        </Typography>
                        <Timeline>
                            {event.milestones.map((milestone, index) => {
                                const milestoneStatus = getMilestoneStatus(milestone);
                                return (
                                    <TimelineItem key={index}>
                                        <TimelineSeparator>
                                            <TimelineDot color={milestoneStatus.color} />
                                            {index < event.milestones.length - 1 && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Typography variant="subtitle1">
                                                {milestone.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Due: {new Date(milestone.date).toLocaleDateString()}
                                                {milestone.time && ` at ${milestone.time}`}
                                            </Typography>
                                            {milestone.description && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {milestone.description}
                                                </Typography>
                                            )}
                                            <Chip 
                                                label={milestoneStatus.status}
                                                color={milestoneStatus.color}
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                        </TimelineContent>
                                    </TimelineItem>
                                );
                            })}
                        </Timeline>
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Inventory Section */}
                {event.inventory && event.inventory.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="h6" gutterBottom>
                            Associated Inventory
                        </Typography>
                        <Grid container spacing={2}>
                            {event.inventory.map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Quantity: {item.quantity} {item.unit}
                                            </Typography>
                                            {item.cost > 0 && (
                                                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                                    Cost: {event.budget.currency} {item.cost}
                                                </Typography>
                                            )}
                                            {item.description && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {item.description}
                                                </Typography>
                                            )}
                                            <Box sx={{ mt: 1 }}>
                                                <Chip 
                                                    label={item.status || 'Available'} 
                                                    color={item.status === 'In Use' ? 'warning' : 'success'}
                                                    size="small"
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Budget and Cost Tracking Section */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                        Budget and Cost Tracking
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Budget Overview
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2">Total Budget:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {event.budget.currency} {event.budget.total}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2">Total Spent:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {event.budget.currency} {event.budget.spent}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2">Remaining:</Typography>
                                    <Typography 
                                        variant="body1" 
                                        fontWeight="bold"
                                        color={event.budget.total - event.budget.spent < 0 ? 'error.main' : 'success.main'}
                                    >
                                        {event.budget.currency} {event.budget.total - event.budget.spent}
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(event.budget.spent / event.budget.total) * 100}
                                    color={event.budget.spent > event.budget.total ? 'error' : 'primary'}
                                    sx={{ mt: 2 }}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Cost Breakdown by Category
                                </Typography>
                                {event.costs && event.costs.length > 0 ? (
                                    <List dense>
                                        {Object.entries(
                                            event.costs.reduce((acc, cost) => {
                                                acc[cost.category] = (acc[cost.category] || 0) + cost.amount;
                                                return acc;
                                            }, {})
                                        ).map(([category, amount]) => (
                                            <ListItem key={category}>
                                                <ListItemText
                                                    primary={category}
                                                    secondary={`${event.budget.currency} ${amount}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No costs recorded yet
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {event.costs && event.costs.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="h6" gutterBottom>
                            Cost Details
                        </Typography>
                        <Grid container spacing={2}>
                            {event.costs.map((cost, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                {cost.category}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                {new Date(cost.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="h5" color="primary">
                                                {event.budget.currency} {cost.amount}
                                            </Typography>
                                            {cost.description && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {cost.description}
                                                </Typography>
                                            )}
                                            <Chip 
                                                label={cost.status}
                                                color={cost.status === 'Paid' ? 'success' : 'warning'}
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />

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