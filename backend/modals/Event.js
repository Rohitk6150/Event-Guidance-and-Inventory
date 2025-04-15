const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        trim: true,
        required: false,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        required: true,
        default: 'Pending',
    },
    milestones: [{
        title: String,
        date: Date,
        time: String,
        description: String,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    inventory: [{
        name: String,
        quantity: Number,
        unit: String
    }]
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;