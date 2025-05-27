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
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            default: 0
        },
        description: String,
        status: {
            type: String,
            enum: ['Available', 'In Use', 'Reserved'],
            default: 'Available'
        }
    }],
    costs: [{
        category: {
            type: String,
            required: true,
            enum: ['Venue', 'Catering', 'Equipment', 'Staff', 'Marketing', 'Other']
        },
        description: String,
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Pending', 'Paid'],
            default: 'Pending'
        }
    }],
    budget: {
        total: {
            type: Number,
            default: 0
        },
        spent: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'INR'],
            default: 'USD'
        }
    }
}, {
    timestamps: true,
});

// Calculate total spent before saving
eventSchema.pre('save', function(next) {
    if (this.costs && this.costs.length > 0) {
        this.budget.spent = this.costs.reduce((total, cost) => total + cost.amount, 0);
    }
    next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;