import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/EventService';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    CircularProgress,
    Paper,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('Pending');
    const [milestones, setMilestones] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [costs, setCosts] = useState([]);
    const [budgetTotal, setBudgetTotal] = useState(0);
    const [budgetCurrency, setBudgetCurrency] = useState('USD');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Milestone form state
    const [milestoneTitle, setMilestoneTitle] = useState('');
    const [milestoneDate, setMilestoneDate] = useState('');
    const [milestoneTime, setMilestoneTime] = useState('');
    const [milestoneDescription, setMilestoneDescription] = useState('');

    // Inventory form state
    const [inventoryName, setInventoryName] = useState('');
    const [inventoryQuantity, setInventoryQuantity] = useState(0);
    const [inventoryUnit, setInventoryUnit] = useState('');
    const [inventoryCost, setInventoryCost] = useState(0);

    // Cost tracking state
    const [costCategory, setCostCategory] = useState('');
    const [costDescription, setCostDescription] = useState('');
    const [costAmount, setCostAmount] = useState(0);

    useEffect(() => {
        const fetchEventDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const eventData = await eventService.getEventById(id, token);
                setName(eventData.name);
                setDescription(eventData.description || '');
                setDate(eventData.date.substring(0, 10));
                setTime(eventData.time || '');
                setLocation(eventData.location || '');
                setStatus(eventData.status || 'Pending');
                setMilestones(eventData.milestones || []);
                setInventory(eventData.inventory || []);
                setCosts(eventData.costs || []);
                setBudgetTotal(eventData.budget?.total || 0);
                setBudgetCurrency(eventData.budget?.currency || 'USD');
            } catch (err) {
                setError('Failed to fetch event details for editing.');
                console.error('Error fetching event details:', err);
                if (err.message.includes('404')) {
                    navigate('/events');
                } else if (err.message.includes('401')) {
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

    const handleAddMilestone = () => {
        if (milestoneTitle && milestoneDate) {
            const newMilestone = {
                title: milestoneTitle,
                date: milestoneDate,
                time: milestoneTime,
                description: milestoneDescription,
                completed: false,
            };
            setMilestones([...milestones, newMilestone]);
            setMilestoneTitle('');
            setMilestoneDate('');
            setMilestoneTime('');
            setMilestoneDescription('');
        }
    };

    const handleRemoveMilestone = (index) => {
        const updatedMilestones = milestones.filter((_, i) => i !== index);
        setMilestones(updatedMilestones);
    };

    const handleAddInventory = () => {
        if (inventoryName && inventoryQuantity > 0) {
            const totalCost = inventoryQuantity * inventoryCost;
            const newInventory = {
                name: inventoryName,
                quantity: inventoryQuantity,
                unit: inventoryUnit,
                cost: totalCost
            };
            setInventory([...inventory, newInventory]);
            setInventoryName('');
            setInventoryQuantity(0);
            setInventoryUnit('');
            setInventoryCost(0);
        }
    };

    const handleRemoveInventory = (index) => {
        const updatedInventory = inventory.filter((_, i) => i !== index);
        setInventory(updatedInventory);
    };

    const handleAddCost = () => {
        if (costCategory && costAmount > 0) {
            const newCost = {
                category: costCategory,
                description: costDescription,
                amount: costAmount,
                date: new Date(),
                status: 'Pending'
            };
            setCosts([...costs, newCost]);
            setCostCategory('');
            setCostDescription('');
            setCostAmount(0);
        }
    };

    const handleRemoveCost = (index) => {
        const updatedCosts = costs.filter((_, i) => i !== index);
        setCosts(updatedCosts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const eventData = {
                name,
                description,
                date,
                time,
                location,
                status,
                milestones,
                inventory,
                costs,
                budget: {
                    total: budgetTotal,
                    spent: costs.reduce((total, cost) => total + cost.amount, 0),
                    currency: budgetCurrency
                }
            };

            await eventService.updateEvent(id, eventData, token);
            navigate('/events');
        } catch (err) {
            setError(err.message || 'Failed to update event');
            console.error('Error updating event:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="lg">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5" gutterBottom>
                    Edit Event
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    
                    <Grid container spacing={3}>
                        {/* Top Row */}
                        <Grid item xs={12} md={6}>
                            {/* Basic Event Information */}
                            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>Event Information</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Event Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Date"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Time"
                                            type="time"
                                            InputLabelProps={{ shrink: true }}
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            select
                                            label="Status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            SelectProps={{
                                                native: true,
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            multiline
                                            rows={4}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            {/* Budget and Cost Tracking */}
                            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Budget and Cost Tracking
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Total Budget"
                                            type="number"
                                            value={budgetTotal}
                                            onChange={(e) => setBudgetTotal(Number(e.target.value))}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 1 }}>{budgetCurrency}</Typography>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Currency"
                                            value={budgetCurrency}
                                            onChange={(e) => setBudgetCurrency(e.target.value)}
                                            SelectProps={{
                                                native: true,
                                            }}
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                            <option value="INR">INR</option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="subtitle1" gutterBottom>
                                            Add Cost Item
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Category"
                                            value={costCategory}
                                            onChange={(e) => setCostCategory(e.target.value)}
                                            SelectProps={{
                                                native: true,
                                            }}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Venue">Venue</option>
                                            <option value="Catering">Catering</option>
                                            <option value="Equipment">Equipment</option>
                                            <option value="Staff">Staff</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Other">Other</option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Amount"
                                            type="number"
                                            value={costAmount}
                                            onChange={(e) => setCostAmount(Number(e.target.value))}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 1 }}>{budgetCurrency}</Typography>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={costDescription}
                                            onChange={(e) => setCostDescription(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={handleAddCost}
                                            variant="outlined"
                                            fullWidth
                                        >
                                            Add Cost Item
                                        </Button>
                                    </Grid>
                                </Grid>
                                {costs.length > 0 && (
                                    <List sx={{ mt: 2 }}>
                                        {costs.map((cost, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={`${cost.category} - ${budgetCurrency} ${cost.amount}`}
                                                    secondary={cost.description}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" onClick={() => handleRemoveCost(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Paper>
                        </Grid>

                        {/* Bottom Row */}
                        <Grid item xs={12} md={6}>
                            {/* Inventory Section */}
                            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Associated Inventory
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Item Name"
                                            value={inventoryName}
                                            onChange={(e) => setInventoryName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            type="number"
                                            value={inventoryQuantity}
                                            onChange={(e) => setInventoryQuantity(parseInt(e.target.value) || 0)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Unit"
                                            value={inventoryUnit}
                                            onChange={(e) => setInventoryUnit(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Cost per Unit"
                                            type="number"
                                            value={inventoryCost}
                                            onChange={(e) => setInventoryCost(Number(e.target.value))}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 1 }}>{budgetCurrency}</Typography>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={handleAddInventory}
                                            variant="outlined"
                                            fullWidth
                                        >
                                            Add Inventory Item
                                        </Button>
                                    </Grid>
                                </Grid>
                                {inventory.length > 0 && (
                                    <List sx={{ mt: 2 }}>
                                        {inventory.map((item, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={item.name}
                                                    secondary={`Quantity: ${item.quantity} ${item.unit} - Total Cost: ${budgetCurrency} ${item.cost}`}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" onClick={() => handleRemoveInventory(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            {/* Milestones Section */}
                            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Event Milestones
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Milestone Title"
                                            value={milestoneTitle}
                                            onChange={(e) => setMilestoneTitle(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Milestone Date"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={milestoneDate}
                                            onChange={(e) => setMilestoneDate(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Milestone Time"
                                            type="time"
                                            InputLabelProps={{ shrink: true }}
                                            value={milestoneTime}
                                            onChange={(e) => setMilestoneTime(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Milestone Description"
                                            value={milestoneDescription}
                                            onChange={(e) => setMilestoneDescription(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={handleAddMilestone}
                                            variant="outlined"
                                            fullWidth
                                        >
                                            Add Milestone
                                        </Button>
                                    </Grid>
                                </Grid>
                                {milestones.length > 0 && (
                                    <List sx={{ mt: 2 }}>
                                        {milestones.map((milestone, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={milestone.title}
                                                    secondary={
                                                        <Box component="span">
                                                            <Typography variant="body2" component="span">
                                                                Due: {new Date(milestone.date).toLocaleDateString()}
                                                            </Typography>
                                                            {milestone.time && (
                                                                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                                                    at {milestone.time}
                                                                </Typography>
                                                            )}
                                                            {milestone.description && (
                                                                <Typography variant="body2" component="span" sx={{ display: 'block', mt: 0.5 }}>
                                                                    {milestone.description}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" onClick={() => handleRemoveMilestone(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="center" mt={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={loading}
                            sx={{ minWidth: '200px' }}
                        >
                            Update Event
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default EditEvent;