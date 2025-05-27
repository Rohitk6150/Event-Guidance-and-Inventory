// frontend/src/components/events/CreateEvent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import eventService from '../../services/EventService';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [milestones, setMilestones] = useState([]);
    const [inventory, setInventory] = useState([]);
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
    const [costs, setCosts] = useState([]);
    const [costCategory, setCostCategory] = useState('');
    const [costDescription, setCostDescription] = useState('');
    const [costAmount, setCostAmount] = useState(0);
    const [budgetTotal, setBudgetTotal] = useState(0);
    const [budgetCurrency, setBudgetCurrency] = useState('USD');

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

    const handleAddInventory = () => {
        if (inventoryName && inventoryQuantity > 0) {
            const newInventory = {
                name: inventoryName,
                quantity: inventoryQuantity,
                unit: inventoryUnit,
                cost: inventoryCost
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate required fields
        if (!title || !date || !time || !status) {
            setError('Please fill in all required fields: Event Title, Date, Time, and Status');
            return;
        }

        setLoading(true);
        try {
            await eventService.createEvent(
                {
                    name: title,
                    date,
                    time,
                    location,
                    description,
                    status,
                    milestones,
                    inventory,
                    costs,
                    budget: {
                        total: budgetTotal,
                        currency: budgetCurrency
                    }
                },
                token
            );
            navigate('/events');
        } catch (err) {
            setError(err.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Create New Event
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    
                    {/* Basic Event Information */}
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Event Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Event Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
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
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            maxHeight: '55px'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Budget and Cost Tracking */}
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
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
                                    value={costCategory}
                                    onChange={(e) => setCostCategory(e.target.value)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    sx={{
                                        '& .MuiSelect-select': {
                                            transition: 'all 0.3s ease'
                                        },
                                        '&:hover .MuiSelect-select': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
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

                    {/* Milestones Section */}
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Event Milestones
                            <Typography variant="body2" color="textSecondary">
                                Add key checkpoints or deadlines for your event
                            </Typography>
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

                    {/* Inventory Section */}
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Associated Inventory
                            <Typography variant="body2" color="textSecondary">
                                Add items or resources needed for the event
                            </Typography>
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
                                    label="Cost"
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
                                            secondary={`Quantity: ${item.quantity} ${item.unit} - Cost: ${budgetCurrency} ${item.cost}`}
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

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Event'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateEvent;