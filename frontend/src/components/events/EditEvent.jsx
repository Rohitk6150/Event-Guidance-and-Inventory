import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const eventData = response.data;
                setName(eventData.name);
                setDescription(eventData.description || '');
                setDate(eventData.date.substring(0, 10)); // Format date for input
                setTime(eventData.time || '');
                setLocation(eventData.location || '');
            } catch (err) {
                setError('Failed to fetch event details for editing.');
                console.error('Error fetching event details:', err);
                if (err.response?.status === 404) {
                    navigate('/events');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.put(
                `/api/events/${id}`,
                { name, description, date, time, location },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/events'); // Redirect to events list after successful update
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event');
            console.error('Error updating event:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Edit Event
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Event Name"
                        name="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="description"
                        label="Description"
                        name="description"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="date"
                        label="Date"
                        type="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="time"
                        label="Time"
                        type="time"
                        name="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="location"
                        label="Location"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        Save Changes
                        {loading && <span className="loading-indicator"></span>}
                    </Button>
                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/events/${id}`)}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditEvent;