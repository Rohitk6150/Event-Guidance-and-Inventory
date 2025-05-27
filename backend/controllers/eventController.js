const asyncHandler = require('express-async-handler');
const Event = require('../modals/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getAllEvents = asyncHandler(async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch events');
    }
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404);
            throw new Error('Event not found');
        }
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch event details');
    }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
    try {
        const { 
            name, 
            description, 
            date, 
            time, 
            location, 
            status, 
            milestones = [], 
            inventory = [], 
            costs = [], 
            budget = { total: 0, spent: 0, currency: 'USD' } 
        } = req.body;

        // Validate required fields
        if (!name || !date || !time) {
            res.status(400);
            throw new Error('Please provide all required fields: name, date, and time');
        }

        // Create the event with default values for optional fields
        const event = await Event.create({
            name,
            description: description || '',
            date,
            time,
            location: location || '',
            status: status || 'Pending',
            milestones,
            inventory,
            costs,
            budget: {
                total: budget.total || 0,
                spent: budget.spent || 0,
                currency: budget.currency || 'USD'
            }
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500);
        throw new Error(error.message || 'Failed to create event');
    }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            // Update only the fields that are provided
            const updateFields = {};
            if (req.body.name) updateFields.name = req.body.name;
            if (req.body.description !== undefined) updateFields.description = req.body.description;
            if (req.body.date) updateFields.date = req.body.date;
            if (req.body.time) updateFields.time = req.body.time;
            if (req.body.location !== undefined) updateFields.location = req.body.location;
            if (req.body.status) updateFields.status = req.body.status;
            if (req.body.milestones) updateFields.milestones = req.body.milestones;
            if (req.body.inventory) updateFields.inventory = req.body.inventory;
            if (req.body.costs) updateFields.costs = req.body.costs;
            if (req.body.budget) updateFields.budget = req.body.budget;

            const updatedEvent = await Event.findByIdAndUpdate(
                req.params.id,
                { $set: updateFields },
                { new: true, runValidators: true }
            );
            res.json(updatedEvent);
        } else {
            res.status(404);
            throw new Error('Event not found');
        }
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500);
        throw new Error(error.message || 'Failed to update event');
    }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404);
            throw new Error('Event not found');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500);
        throw new Error(error.message || 'Failed to delete event');
    }
});

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};